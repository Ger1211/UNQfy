
const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const Artist = require('./domain/artist');
const Album = require('./domain/album');
const Track = require('./domain/track');
const ArtistIdNotFound = require('./exceptions/artistIdNotFound');
const ArtistNameDuplicated = require('./exceptions/artistNameDuplicated');
const AlbumIdNotFound = require('./exceptions/albumIdNotFound');
const TrackIdDuplicated = require('./exceptions/trackIdDuplicated');
const InvalidArtist = require('./exceptions/invalidArtist');


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

    if(this.getArtistByName(artistData.name) !== undefined){
      throw new ArtistNameDuplicated();
    }else{
      let artist = this.createArtist(artistData);
      this.artists.push(artist);
      return artist;
    }
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

  //VERIFICAR QUE EL ARTISTA NO TENGA ESE MISMO NOMBRE DE ALBUM EN SU LISTA DE ALBUMS.
    
    let artist = this.getArtistById(artistId);
    if( artist === undefined){
      throw new ArtistIdNotFound();
    } 
    else if(artist.albums.some(album => album.name.toString() === albumData.name.toString())){
      throw new InvalidArtist(); 
     }
    else{
      let album = this.createAlbum(artistId,albumData);
      artist.albums.push(album);
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
    let album = this.getAlbumById(albumId);
    if(album === undefined){
      throw new AlbumIdNotFound();
    }
    else if(album.tracks.some(track => track.name.toString() === trackData.name.toString())){
      throw new TrackIdDuplicated(); 
    }
    else{
      let track = this.createTrack(albumId,trackData);
      album.tracks.push(track);
      return track;
    }
  }

    createTrack(albumId,trackData) {
      return new Track(this.getNextTrackId(), trackData.name, trackData.genres.split(","), parseInt(trackData.duration), albumId); 
    }
  
    getNextTrackId() {
      let nextId = this.nextTrackId;
      this.nextTrackId++;
      return nextId;
    }


  getArtistByName(name) {
    return this.artists.filter(artist => artist.name.toString() === name.toString())[0];
  }

  getArtistById(id) {
    return this.artists.filter(artist => artist.id.toString() === id.toString())[0];
  }

  getAlbumById(id) {
    return this.artists.flatMap(artist => artist.albums).filter(album => album.id.toString() === id.toString())[0];
  }
  
  getTrackById(id) {
    return this.artists.flatMap(artist => artist.albums).flatMap(album => album.tracks).filter(track => track.id.toString() === id.toString())[0];
  }


  getPlaylistById(id) {
    return this.playlists.filter(playlist => playlist.id.toString() === id.toString())[0];
  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {
    return this.artists.flatMap(artist => artist.albums).flatMap(album => album.tracks).filter(track => track.genres); //SIN TERMINAR
  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {
    let artist = this.getArtistByName(artistName);
    return artist.albums.flatMap(album => album.tracks);
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

