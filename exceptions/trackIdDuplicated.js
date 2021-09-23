class TrackIdDuplicated extends Error {
  constructor() {
    super("Track id is already exist in that album");
    this.message = "Track id is already exist in that album";
  }
}

module.exports = TrackIdDuplicated;
