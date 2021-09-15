
const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const Artist = require('./domain/artist');
const Album = require('./domain/album');
const Track = require('./domain/track');
const ArtistIdNotFound = require('./exceptions/ArtistIdNotFound');



class UNQfy {

  constructor() {
    this.playlists = [];
    this.artists = [];
    this.nextArtistId = 1;
    this.nextAlbumId = 1;
    this.nextTrackId = 1;
  }

  // artistData: objeto JS con los datos necesarios para crear un artista
  //   artistData.name (string)
  //   artistData.country (string)
  // retorna: el nuevo artista creado
  addArtist(artistData) {
  /* Crea un artista y lo agrega a unqfy.
  El objeto artista creado debe soportar (al menos):
    - una propiedad name (string)
    - una propiedad country (string)
  */
    let artist = this.createArtist(artistData);
    this.artists.push(artist);
    return artist;
  }

  createArtist(artistData) {
    return new Artist(this.getNextArtistId(),artistData.name, artistData.country);
  }

  getNextArtistId() {
    let nextId = this.nextArtistId;
    this.nextArtistId++;
    return nextId;
  }


  // albumData: objeto JS con los datos necesarios para crear un album
  //   albumData.name (string)
  //   albumData.year (number)
  // retorna: el nuevo album creado
  addAlbum(artistId, albumData) {
     /* Crea un album y lo agrega al artista con id artistId.
    El objeto album creado debe tener (al menos):
     - una propiedad name (string)
     - una propiedad year (number)
  */

    if(this.getArtistById(artistId) === undefined){
      throw new ArtistIdNotFound();
    }else{
      let album = this.createAlbum(artistId,albumData);
      return album;
    }
  }

  createAlbum(artistId,albumData) {
    return new Album(this.getNextAlbumId(), albumData.name, albumData.year, artistId);
  }

  getNextAlbumId() {
    let nextId = this.nextAlbumId;
    this.nextAlbumId++;
    return nextId;
  }
 
  


  // trackData: objeto JS con los datos necesarios para crear un track
  //   trackData.name (string)
  //   trackData.duration (number)
  //   trackData.genres (lista de strings)
  // retorna: el nuevo track creado
  addTrack(albumId, trackData) {
  /* Crea un track y lo agrega al album con id albumId.
  El objeto track creado debe tener (al menos):
      - una propiedad name (string),
      - una propiedad duration (number),
      - una propiedad genres (lista de strings)
  */
      let track = this.createTrack(albumId,trackData);
      return track;
    }
  
    createTrack(albumId,trackData) {
      return new Track(this.getNextTrackId(), trackData.name, trackData.genres.split(","), trackData.duration, albumId);
    }
  
    getNextTrackId() {
      let nextId = this.nextTrackId;
      this.nextTrackId++;
      return nextId;
    }


  

  getArtistById(id) {
    return this.artists.filter(artist => artist.id === id)[0];
  }

  getAlbumById(id) {
    return this.artists.flatMap(artist => artist.album).filter(album => album.id === id)[0];
  }
  

  getTrackById(id) {
    return this.artists.flatMap(artist => artist.album).flatMap(album => album.track).filter(track => track.id === id)[0];
  }


  getPlaylistById(id) {
    return this.playlists.filter(playlist => playlist.id === id)[0];
  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {

  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {

  }


  // name: nombre de la playlist
  // genresToInclude: array de generos
  // maxDuration: duración en segundos
  // retorna: la nueva playlist creada
  createPlaylist(name, genresToInclude, maxDuration) {
  /*** Crea una playlist y la agrega a unqfy. ***
    El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist.
  */

  }

  save(filename) {
    const serializedData = picklify.picklify(this);
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artist, Album, Track ] // Playlist, User];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy: UNQfy,
  Artist: Artist,
};

