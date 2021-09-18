class ArtistDoesntExist extends Error {
    constructor() {
      super("The Artist does not exist");
      this.message = "The Artist does not exist.";
    }
 }

 module.exports = ArtistDoesntExist;