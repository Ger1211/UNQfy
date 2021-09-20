
const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const Artist = require('./domain/artist');
const Album = require('./domain/album');
const Track = require('./domain/track');
const Playlist = require('./domain/playlist');
const User = require('./domain/user');
const Listened = require('./domain/listened');
const ArtistIdNotFound = require('./exceptions/artistIdNotFound');
const ArtistNameDuplicated = require('./exceptions/artistNameDuplicated');
const AlbumIdNotFound = require('./exceptions/albumIdNotFound');
const TrackIdDuplicated = require('./exceptions/trackIdDuplicated');
const InvalidArtist = require('./exceptions/invalidArtist');
const TrackDoesntExist = require('./exceptions/trackDoesntExist');
const AlbumDoesntExist = require('./exceptions/albumDoesntExist');
const ArtistDoesntExist = require('./exceptions/artistDoesntExist');



TrackDoesntExist

class UNQfy {

  constructor() {
    this.playlists = [];
    this.artists = [];
    this.users = [];
    this.nextArtistId = 1;
    this.nextAlbumId = 1;
    this.nextTrackId = 1;
    this.nextPlaylistId = 1;
    this.nextUserId = 1;
  }

  //ALGO

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
      return new Track(this.getNextTrackId(), trackData.name, trackData.genres, parseInt(trackData.duration), albumId); 
    }
  
    getNextTrackId() {
      let nextId = this.nextTrackId;
      this.nextTrackId++;
      return nextId;
    }


  getArtistById(id) {
    return this.artists.find(artist => artist.id.toString() === id.toString());
  }

  getArtistByName(name) {
    return this.artists.find(artist => artist.name.toString() === name.toString());
  }
 
  getAlbumById(id) {
    return this.artists.flatMap(artist => artist.albums).find(album => album.id.toString() === id.toString());
  }

  getAlbumByName(name) {
    return this.artists.flatMap(artist => artist.albums).find(album => album.name.toString() === name.toString());
  }

  getTrackById(id) {
    return this.artists.flatMap(artist => artist.albums).flatMap(album => album.tracks).find(track => track.id.toString() === id.toString());
  }

  getTrackByName(name) {
    return this.artists.flatMap(artist => artist.albums).flatMap(album => album.tracks).find(track => track.name.toString() === name.toString());
  }


  getPlaylistById(id) {
    return this.playlists.find(playlist => playlist.id.toString() === id.toString());
  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {
    return this.artists.flatMap(artist => artist.albums).flatMap(album => album.tracks).filter(track => track.genres.some(genre => genres.some(gen => gen === genre)));
  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {
    let artist = this.getArtistByName(artistName);
    return artist.albums.flatMap(album => album.tracks);
  }


  deleteTrack(name){
    if(this.getTrackByName(name) === undefined){
      throw new TrackDoesntExist();
    }else{
      this.artists.flatMap(artist => artist.albums).find(album => album.tracks.some(track => track.name === name)).eraseTrack(name);
      this.playlists.filter(playlist => playlist.tracks.some(track => track.name === name)).forEach( playlist => playlist.eraseTrack(name));
    }
  }

  deleteAlbum(name){
    if(this.getAlbumByName(name) === undefined){
      throw new AlbumDoesntExist();
    }else{
      this.artists.flatMap(artist => artist.albums).find(album => album.name === name).tracks.forEach( track => this.deleteTrack(track.name));
      this.artists.find(artist => artist.albums.some(album => album.name === name)).eraseAlbum(name);
    }
  }


  deleteArtist(name){
    if(this.getArtistByName(name) === undefined){
      throw new ArtistDoesntExist();
    }else{
      this.artists.flatMap(artist => artist.albums).forEach(album => this.deleteAlbum(album.name));
      this.artists = this.artists.filter(artist => artist.name !== name);
    }
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
    let playlist = this.createNewPlaylist(name);
    let tracks = this.getTracksMatchingGenres(genresToInclude);
    playlist.tracks  = this.generateRandomTracks(tracks, maxDuration);
    this.playlists.push(playlist);
    return playlist;
  }

  generateRandomTracks(tracks, maxDuration) {
    let tracksToInclude = [];
    let tracksToAdd = tracks;
    while(maxDuration > 0 && tracksToAdd.length !== 0) {
      let random = Math.floor(Math.random() * (tracksToAdd.length - 1));
      let trackToAdd = tracksToAdd[random];
      tracksToAdd = tracksToAdd.filter(track => track.id.toString() !== trackToAdd.id.toString());
      if(maxDuration >= trackToAdd.duration) {
        tracksToInclude.push(trackToAdd);
        maxDuration -= trackToAdd.duration;
      }
    }
    return tracksToInclude;
  }

  createNewPlaylist(name) {
    return new Playlist(this.getNextPlaylistId(), name);
  }

  getNextPlaylistId() {
    let nextId = this.nextPlaylistId;
    this.nextPlaylistId++;
    return nextId;
  }

  searchByName(name) {
    let result = {}
    result.artists = this.artists.filter(artist => artist.name.includes(name));
    result.albums = this.artists.flatMap(artist => artist.albums).filter(album => album.name.includes(name));
    result.tracks = this.artists.flatMap(artist => artist.albums).flatMap(album => album.tracks).filter(track => track.name.includes(name));
    result.playlists = this.playlists.filter(playlist => playlist.name.includes(name));
    return result;
  }

  addUser(userData) {
    let user = this.createUser(userData)
    return this.users.push(user);
  }

  createUser(userData) {
    return new User(this.getNextUserId(),userData.username);
  }

  getNextUserId() {
    let nextId = this.nextUserId;
    this.nextUserId++;
    return nextId;
  }

  listen(username, trackName) {
    let user = this.users.find(user => user.username === username);
    let track = this.getTrackByName(trackName);
    return user.listen(track);
  }

  findUserByUsername(username) {
    return console.log(this.users.find(user => user.username === username));
  }

  threeMostListen(artistName) {
    let artist = this.artists.find(artist => artist.name === artistName);
    let tracks = artist.albums.flatMap(album => album.tracks);
    let listenedOfArtistTracks = this.users.flatMap(user => user.listened).filter(listened => tracks.map(track => track.id).includes(listened.track.id));
    let mostListenedTracks = tracks.map(track => {
      let sumListened = {track: track, quantity: listenedOfArtistTracks.filter(listened => listened.track.id === track.id).map(listened => listened.quantity).reduce((acc, num) =>  num + acc,0)};
      return sumListened; 
    })
    let order = mostListenedTracks.sort(this.compare);

    console.log("This is the three most listened of " + artistName + "\n 1." + order[0].track.name + "\n 2." + order[1].track.name + "\n 3." + order[2].track.name); 
  }

  compare( a, b ) {
    if ( a.quantity > b.quantity ){
      return -1;
    }
    if ( a.quantity < b.quantity ){
      return 1;
    }
    return 0;
  }

  save(filename) {
    const serializedData = picklify.picklify(this);
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artist, Album, Track, Playlist, User, Listened];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy: UNQfy,
};

