class Artist {
  constructor(_id, _name, _country) {
    this.id = _id;
    this.name = _name;
    this.country = _country;
    this.albums = [];
  }

  getId() {
    return this.id;
  }

  eraseAlbum(albumName) {
    this.albums.filter((album) => album.name.toLowerCase() !== albumName.toLowerCase());
  }
}

module.exports = Artist;
