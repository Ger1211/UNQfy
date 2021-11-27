const Listened = require("./listened");

class User {
  constructor(_id, _username) {
    this.id = _id;
    this.username = _username;
    this.listened = [];
  }

  listen(track) {
    let listen = this.listened.find((listen) => listen.track.id === track.id);
    listen ? listen.count() : this.listened.push(new Listened(track));
    return track;
  }

  allListened() {
    return this.listened.map((listen) => listen.track);
  }

  listened(track) {
    return this.listened.find((listen) => listen.track.id === track.id)
      .quantity;
  }
}

module.exports = User;
