const sdk = require("matrix-js-sdk");

const Platform = require("./base");
const Channel = require("../objects/channel");
const Message = require("../objects/message");
const Reaction = require("../objects/reaction");
const Presence = require("../objects/presence");

class Matrix extends Platform {
  constructor(userId, accessToken, server, handle) {
    super("Matrix", handle);

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

        this.handle.handleMessage(
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
        this._reactionRecieved(data.event_id, data.key);
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

  async sendMessage(text, room) {
    var event = await this._client.sendTextMessage(room._internal, text);
    return new Message(this, event.event_id, event.event_id, text, room);
  }

  async deleteMessage(message) {
    await this._client.redactEvent(
      message.channel._internal,
      message._internal
    );
  }

  async editMessage(message, text) {
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

  async addReaction(emoji, message) {
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
    return new Reaction(this, reaction.event_id, emoji, message);
  }

  async removerUserReaction(reaction, user) {
    await this._client.redactEvent(
      reaction.message.channel._internal,
      reaction._internal
    );
  }

  async setPresence(presence, status) {
    await this._client.setPresence({
      presence: ["online", "unavailable", "unavailable", "offline"][presence],
      status_msg: status,
    });
    this.log("Set presence");
  }

  async typing(room, timeout) {
    await this._client.sendTyping(room._internal, true, timeout);
  }

  hasDeleteTraces() {
    return true;
  }
}

module.exports = Matrix;
