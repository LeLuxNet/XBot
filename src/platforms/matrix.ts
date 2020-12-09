import { Platform } from "../platform";
import sdk from "matrix-js-sdk";
import { FileType, Message } from "../message";
import { Channel } from "../channel";
import { Reaction } from "../reaction";
import { User } from "../user";
import { Presence } from "src/presence";
import { createReadStream } from "fs";

export class Matrix extends Platform {
  deleteTraces = true;
  userId: string;
  _client: sdk.MatrixClient;

  constructor(userId: string, accessToken: string, server: string) {
    super("Matrix");

    this.userId = userId.toLowerCase();
    this._client = sdk.createClient({
      baseUrl: server,
      accessToken: accessToken,
      userId: this.userId,
    });

    // Auto join
    this._client.on("RoomMember.membership", (event, member) => {
      if (member.membership === "invite" && member.userId === this.userId) {
        this._client.joinRoom(member.roomId);
      }
    });

    this._client.on("Room.timeline", (event, room, toStartOfTimeline) => {
      if (toStartOfTimeline) {
        return;
      }

      if (event.sender.userId === this.userId) {
        return;
      }

      console.log(event);

      if (event.getType() === "m.room.message") {
        // Ignore edits
        if (event.getContent()["m.new_content"]) {
          return;
        }

        this.emit(
          "message",
          new Message(
            this,
            event.event_id,
            event.event_id,
            event.getContent().body,
            new Channel(
              this,
              room.roomId,
              room.name,
              room.currentState.getJoinedMemberCount() === 2
            )
          )
        );
      } else if (event.getType() === "m.reaction") {
        const data = event.getContent()["m.relates_to"];
        this._reactionRecieved(data.event_id, data.key, new User(this, "", ""));
      }
    });
  }

  async start() {
    await this._client
      .startClient({ initialSyncLimit: 0 })
      .then(() => this.log("Started"));
  }

  async stop() {
    await this._client.stopClient();
    this.log("Stopped");
  }

  async sendText(text: string, room: Channel): Promise<Message> {
    // @ts-ignore
    const event = await this._client.sendTextMessage(room._internal, text);
    // @ts-ignore
    return new Message(this, event.event_id, event.event_id, text, room);
  }

  async sendFile(
    name: string,
    fileName: string,
    type: FileType,
    room: Channel
  ): Promise<Message> {
    const readStream = createReadStream(fileName);

    // @ts-ignore
    const url = this._client.uploadContent(readStream, {});

    const content = {
      msgtype: ["m.image", "m.audio", "m.video", "m.file"][type],
      body: name,
      url: url,
    };

    // @ts-ignore
    const event = await this._client.sendMessage(room._internal, content);
    // @ts-ignore
    return new Message(this, event.event_id, event.event_id, text, room);
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

  async typing(room: Channel, timeout: number) {
    await this._client.sendTyping(room._internal, true, timeout);
  }
}
