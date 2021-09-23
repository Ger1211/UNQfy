class ArtistNotFound extends Error {
  constructor() {
    super("Artist not Found");
    this.message = "Artist not Found. Please insert an exist artist.";
  }
}

module.exports = ArtistNotFound;
