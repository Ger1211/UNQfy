class Playlist {
  constructor(_id, _name) {
    this.id = _id;
    this.name = _name;
    this.tracks = [];
  }

  duration() {
    return this.tracks
      .map((track) => track.duration)
      .reduce((acc, num) => num + acc, 0);
  }

  hasTrack(track) {
    return this.tracks.some((tr) => tr.id.toString() === track.id.toString());
  }

  eraseTrack(name) {
    this.tracks = this.tracks.filter((tr) => tr.name !== name);
  }
}

module.exports = Playlist;
