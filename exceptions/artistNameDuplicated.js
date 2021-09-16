class ArtistNameDuplicated extends Error {
    constructor() {
      super("Artist name duplicated");
      this.message = "Artist name already exists. Please insert another one.";
    }
 }


 module.exports = ArtistNameDuplicated;