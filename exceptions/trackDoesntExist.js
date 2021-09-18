class TrackDoesntExist extends Error {
    constructor() {
      super("The Track does not exist");
      this.message = "The Track does not exist.";
    }
 }

 module.exports = TrackDoesntExist;