class ArtistIdDuplicated extends Error {
    constructor() {
      super("Artist ID duplicated");
      this.message = "Artist ID already exists. Please insert another one.";
    }
 }


 module.exports = ArtistIdDuplicated;