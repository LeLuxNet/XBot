import { Platform } from "../platform";
import sdk, { MatrixEvent, Room, RoomMember } from "matrix-js-sdk";
import { FileType, Message } from "../message";
import { Channel } from "../channel";
import { Reaction } from "../reaction";
import { User } from "../user";
import { Presence } from "src/presence";
import { Readable } from "stream";

export class Matrix extends Platform {
  userId: string;
  _client: sdk.MatrixClient;

  deleteTraces = true;

  // 10 MB (default; varies from homeserver to homeserver)
  // The actual value is set after the start
  uploadLimit = 1024 * 1024 * 10;

  constructor(userId: string, accessToken: string, server: string) {
    super("Matrix");

    this.userId = userId.toLowerCase();
    this._client = sdk.createClient({
      baseUrl: server,
      accessToken: accessToken,
      userId: this.userId,
    });

    // Auto join
    this._client.on(
      "RoomMember.membership",
      (event: MatrixEvent, member: RoomMember) => {
        if (member.membership === "invite" && member.userId === this.userId) {
          this._client.joinRoom(member.roomId);
        }
      }
    );

    this._client.on(
      "Room.timeline",
      (event: MatrixEvent, room: Room, toStartOfTimeline: boolean) => {
        if (toStartOfTimeline) {
          return;
        }

        if (event.sender.userId === this.userId) {
          return;
        }

        console.log(event);

        if (event.getType() === "m.room.message") {
          // Ignore edits
          // @ts-ignore
          if (event.getContent()["m.new_content"]) {
            return;
          }

          const channel = new Channel(
            this,
            room.roomId,
            room.name,
            room.currentState.getJoinedMemberCount() === 2
          );

          const user = new User(
            this,
            event.sender.userId,
            event.sender.name,
            false
          );

          this.emit(
            "message",
            new Message(
              this,
              // @ts-ignore
              event.event_id,
              // @ts-ignore
              event.event_id,
              event.getContent().body,
              channel,
              user
            )
          );
          // @ts-ignore
        } else if (event.getType() === "m.reaction") {
          // @ts-ignore
          const data = event.getContent()["m.relates_to"];
          this._reactionRecieved(
            data.event_id,
            data.key,
            new User(this, event.sender.userId, event.sender.name, false)
          );
        }
      }
    );
  }

  async start() {
    await this._client.startClient({ initialSyncLimit: 0 });

    this._client.getMediaConfig().then((val: { "m.upload.size"?: number }) => {
      const uploadLimit = val["m.upload.size"];
      if (uploadLimit !== undefined) {
        this.uploadLimit = uploadLimit;
      }
    });

    this.log("Started");
  }

  async stop() {
    await this._client.stopClient();
    this.log("Stopped");
  }

  get me(): Promise<User> {
    const self = this._client.getUserId()!;
    const user = new User(
      this,
      self,
      this._client.getUser(self)!.displayName,
      false
    );
    return Promise.resolve(user);
  }

  async sendText(text: string, room: Channel): Promise<Message> {
    // @ts-ignore
    const event = await this._client.sendTextMessage(room._internal, text);
    return new Message(
      this,
      // @ts-ignore
      event.event_id,
      // @ts-ignore
      event.event_id,
      text,
      room,
      await this.me
    );
  }

  async sendFile(
    name: string,
    fileName: string,
    stream: Readable,
    type: FileType,
    room: Channel
  ): Promise<Message> {
    // @ts-ignore
    const upload = JSON.parse(await this._client.uploadContent(stream, {}));

    const content = {
      msgtype: ["m.image", "m.audio", "m.video", "m.file"][type],
      body: name,
      url: upload.content_uri,
    };

    // @ts-ignore
    const event = await this._client.sendMessage(room._internal, content);

    return new Message(
      this,
      // @ts-ignore
      event.event_id,
      // @ts-ignore
      event.event_id,
      "",
      room,
      await this.me
    );
  }

  async deleteMessage(message: Message) {
    // @ts-ignore
    await this._client.redactEvent(
      message.channel._internal,
      message._internal
    );
  }

  async editMessage(message: Message, text: string) {
    // @ts-ignore
    await this._client.sendEvent(message.channel._internal, "m.room.message", {
      body: "*" + text,
      msgtype: "m.text",
      "m.new_content": {
        body: text,
        msgtype: "m.text",
      },
      "m.relates_to": {
        event_id: message._internal,
        rel_type: "m.replace",
      },
    });
  }

  async addReaction(emoji: string, message: Message): Promise<Reaction> {
    // @ts-ignore
    var reaction = await this._client.sendEvent(
      message.channel._internal,
      "m.reaction",
      {
        "m.relates_to": {
          event_id: message._internal,
          key: emoji,
          rel_type: "m.annotation",
        },
      }
    );
    // @ts-ignore
    return new Reaction(this, reaction.event_id, emoji, message);
  }

  async removerUserReaction(reaction: Reaction, user: User) {
    // @ts-ignore
    await this._client.redactEvent(
      reaction.message.channel._internal,
      reaction._internal
    );
  }

  async setPresence(presence: Presence, status: string) {
    await this._client.setPresence({
      presence: ["online", "unavailable", "unavailable", "offline"][presence],
      status_msg: status,
    });
    this.log("Set presence");
  }

  async typing(room: Channel, duration: number) {
    await this._client.sendTyping(room._internal, true, duration);
  }
}
