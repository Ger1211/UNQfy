class Album {
    constructor(_id, _name, _year, _artistId) {
      this.id = _id;
      this.name = _name;
      this.year = _year;
      this.tracks = [];
      this.artistId = _artistId;
    }

    deleteTrack(name) {
      this.tracks = this.tracks.filter(tr => tr.name !== name);
    }
  }
  
  module.exports = Album;