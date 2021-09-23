class InvalidArtist extends Error {
  constructor() {
    super("The Artist is already used in another album. Please use other");
    this.message ="The Artist is already used in another album. Please use other.";
  }
}

module.exports = InvalidArtist;
