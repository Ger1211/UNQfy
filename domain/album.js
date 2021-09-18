class Album {
    constructor(_id, _name, _year, _artistId) {
      this.id = _id;
      this.name = _name;
      this.year = _year;
      this.tracks = [];
      this.artistId = _artistId;
    }

    eraseTrack(name) {
      this.tracks = this.tracks.filter(tr => tr.name !== name);
    }

    deleteAllTracks(){
      this.tracks = [];
    }


  }
  
  module.exports = Album;