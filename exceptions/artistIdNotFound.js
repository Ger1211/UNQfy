class ArtistIdNotFound extends Error {
  constructor() {
    super("Artist ID not Found");
    this.message = "Artist ID not Found. Please insert an exist ID.";
  }
}

module.exports = ArtistIdNotFound;
