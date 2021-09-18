class AlbumDoesntExist extends Error {
    constructor() {
      super("The Album does not exist");
      this.message = "The Album does not exist.";
    }
 }

 module.exports = AlbumDoesntExist;