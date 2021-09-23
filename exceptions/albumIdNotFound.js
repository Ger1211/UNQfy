class AlbumIdNotFound extends Error {
  constructor() {
    super("Artist ID not Found");
    this.message = "Album ID not Found. Please insert an exist Album ID.";
  }
}

module.exports = AlbumIdNotFound;
