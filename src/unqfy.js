const picklify = require("picklify"); // para cargar/guarfar unqfy
const fs = require("fs"); // para cargar/guarfar unqfy
const Artist = require("./domain/artist");
const Album = require("./domain/album");
const Track = require("./domain/track");
const Playlist = require("./domain/playlist");
const User = require("./domain/user");
const Listened = require("./domain/listened");
const spotify = require("./services/spotify");
const NewsletterObserver = require("./observers/newsletterObserver");
const LoggingObserver = require("./observers/loggingObserver");


const {
  EntityIdDoesntExist,
  EntityNameDoesntExist,
  EntityNameDuplicated,
  AlbumIdNotFound,
  InvalidArtist,
} = require("./exceptions/exceptions");
class UNQfy {
  constructor(_observers) {
    this.playlists = [];
    this.artists = [];
    this.users = [];
    this.nextArtistId = 1;
    this.nextAlbumId = 1;
    this.nextTrackId = 1;
    this.nextPlaylistId = 1;
    this.nextUserId = 1;
    this.observers = _observers;
  }


  addArtist(artistData) {
 
    if (this.existArtist(artistData)) {
      throw new EntityNameDuplicated("Artist", artistData.name);
    } else {
      let artist = this.createArtist(artistData);
      this.artists.push(artist);
      this.save("data.json");
      this.notify(artistData, "artists");
      return artist;
    }
  }

  existArtist(artistData) {
    return this.getArtistByName(artistData.name);
  }

  createArtist(artistData) {
    return new Artist(
      this.getNextArtistId(),
      artistData.name,
      artistData.country
    );
  }

  getNextArtistId() {
    let nextId = this.nextArtistId;
    this.nextArtistId++;
    return nextId;
  }

  modifyArtistById(id, artistData) {
    const artist = this.getArtistById(id);
    artist.name = artistData.name;
    artist.country = artistData.country;
    this.save("data.json");
    return artist;
  }

  
  addAlbum(artistId, albumData) {

    let artist = this.getArtistById(artistId);
    if (this.doesntExistArtist(artist)) {
      throw new EntityIdDoesntExist("Artist", artistId);
    } else if (this.albumDuplicatedOnArtist(artist, albumData)) {
      throw new InvalidArtist(artist.getId());
    } else {
      let album = this.createAlbum(artistId, albumData);
      artist.albums.push(album);
      this.save("data.json");
      delete album.artistId;
      let data = {};
      data.artistId = artistId;
      data.artistName = artist.name;
      data.albumName = album.name;
      this.notify(data, "albums");
      return album;
    }
  }

  notify(data, action) {
    this.observers.forEach((observer) => observer.notify(data, action));
  }

  albumDuplicatedOnArtist(artist, albumData) {
    return artist.albums.some(
      (album) => album.name.toString() === albumData.name.toString()
    );
  }

  doesntExistArtist(artist) {
    return !artist;
  }

  createAlbum(artistId, albumData) {
    return new Album(
      this.getNextAlbumId(),
      albumData.name,
      albumData.year,
      artistId
    );
  }

  getNextAlbumId() {
    let nextId = this.nextAlbumId;
    this.nextAlbumId++;
    return nextId;
  }

  modifyAlbumById(albumId, newYear) {
    const album = this.getAlbumById(albumId);
    album.year = newYear;
    this.save("data.json");
    delete album.artistId;
    return album;
  }


  addTrack(albumId, trackData) {
 
    let album = this.getAlbumById(albumId);
    if (this.doesntExistAlbum(album)) {
      throw new AlbumIdNotFound();
    } else if (this.trackDuplicatedOnAlbum(album, trackData)) {
      throw new EntityNameDuplicated("Track", trackData.name);
    } else {
      let track = this.createTrack(albumId, trackData);
      album.tracks.push(track);
      this.save("data.json");
      this.notify(trackData, "tracks");
      return track;
    }
  }

  trackDuplicatedOnAlbum(album, trackData) {
    return album.tracks.some(
      (track) => track.name.toString() === trackData.name.toString()
    );
  }

  doesntExistAlbum(album) {
    return !album;
  }

  createTrack(albumId, trackData) {
    return new Track(
      this.getNextTrackId(),
      trackData.name,
      trackData.genres,
      parseInt(trackData.duration),
      albumId
    );
  }

  getNextTrackId() {
    let nextId = this.nextTrackId;
    this.nextTrackId++;
    return nextId;
  }

  getArtistById(id) {
    return this.artists.find(
      (artist) => artist.id.toString() === id.toString()
    );
  }

  getArtistByName(name) {
    return this.artists.find(
      (artist) => artist.name.toString() === name.toString()
    );
  }

  getAlbumById(id) {
    return this.artists
      .flatMap((artist) => artist.albums)
      .find((album) => album.id.toString() === id.toString());
  }

  getAlbumByName(name) {
    return this.artists
      .flatMap((artist) => artist.albums)
      .find((album) => album.name.toString() === name.toString());
  }

  getTrackById(id) {
    return this.artists
      .flatMap((artist) => artist.albums)
      .flatMap((album) => album.tracks)
      .find((track) => track.id.toString() === id.toString());
  }

  getTrackByName(name) {
    return this.artists
      .flatMap((artist) => artist.albums)
      .flatMap((album) => album.tracks)
      .find((track) => track.name.toString() === name.toString());
  }

  getPlaylistById(id) {
    return this.playlists.find(
      (playlist) => playlist.id.toString() === id.toString()
    );
  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {
    let tracks = this.artists
      .flatMap((artist) => artist.albums)
      .flatMap((album) => album.tracks)
      .filter((track) =>
        track.genres.some((genre) =>
          genres.some((gen) => gen.toLowerCase() === genre.toLowerCase())
        )
      );
    return tracks;
  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {
    let artist = this.getArtistByName(artistName);
    let tracks = artist.albums.flatMap((album) => album.tracks);
    console.log(tracks);
    return tracks;
  }

  deleteTrack(name) {
    if (this.doesntExistTrackByName(name)) {
      throw new EntityNameDoesntExist("Track", name);
    } else {
      const trackToDelete = this.getTrackByName(name)
      this.artists
        .flatMap((artist) => artist.albums)
        .find((album) => album.tracks.some((track) => track.name === name))
        .eraseTrack(name);
      this.playlists
        .filter((playlist) =>
          playlist.tracks.some((track) => track.name === name)
        )
        .forEach((playlist) => playlist.eraseTrack(name));
        this.notify(trackToDelete, "deleteTrack");
      this.save("data.json");
    }
  }

  doesntExistTrackByName(name) {
    return !this.getTrackByName(name);
  }

  deleteAlbum(name) {
    if (this.doesntExistAlbumByName(name)) {
      throw new EntityNameDoesntExist("Album", name);
    } else {
      let albumToDelete = this.getAlbumByName(name);
      let artistOwnerAlbum = this.getArtistById(albumToDelete.getArtistId());
      const indexToDelete = artistOwnerAlbum.albums.findIndex(
        (album) => album.id === albumToDelete.id
      );
      albumToDelete.tracks.forEach((track) => this.deleteTrack(track.name));
      artistOwnerAlbum.albums.splice(indexToDelete, 1);
      this.notify(albumToDelete, "deleteAlbum");
      this.save("data.json");
    }
  }

  doesntExistAlbumByName(name) {
    return !this.getAlbumByName(name);
  }

  deleteArtist(name) {
    if (this.doesntExistArtistByName(name)) {
      throw new EntityNameDoesntExist("Artist", name);
    } else {
      let artistToDelete = this.getArtistByName(name);
      const indexToDelete = this.artists.findIndex(
        (artist) => artist.id === artistToDelete.id
      );
      artistToDelete.deleteAllAlbums();
      this.artists.splice(indexToDelete, 1);
      this.notify(artistToDelete, "deleteArtist");
      this.save("data.json");
    }
  }

  doesntExistArtistByName(name) {
    return !this.getArtistByName(name);
  }

  deletePlaylist(id) {
    let playlistToDelete = this.getPlaylistById(id);
    if (playlistToDelete === undefined) {
      throw new EntityIdDoesntExist("Playlist", id);
    } else {
      const indexToDelete = this.playlists.findIndex(
        (playlist) => playlist.id === playlistToDelete.id
      );
      this.playlists.splice(indexToDelete, 1);
      this.save("data.json");
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
    playlist.tracks = this.generateRandomTracks(tracks, maxDuration);
    this.playlists.push(playlist);
    this.save("data.json");
    return playlist;
  }

  createPlaylistWithSetOfTracks(name, tracksToInclude) {
    let playlist = this.createNewPlaylist(name);
    let tracks = this.getTracks(tracksToInclude); //devuelve una lista de tracks
    playlist.tracks = tracks;
    this.playlists.push(playlist);
    this.save("data.json");
    return playlist;
  }

  getTracks(trackIDs) {
    let tracks = [];
    for (let i = 0; i < trackIDs.length; i++) {
      let track = this.getTrackById(trackIDs[i]);
      if (track !== undefined) {
        tracks.push(track);
      } else {
        throw new EntityIdDoesntExist("Track", trackIDs[i]);
      }
    }
    return tracks;
  }

  allPlaylist() {
    return console.log(
      this.playlists.map((pl) => {
        let playlist = {
          id: pl.id,
          name: pl.name,
          tracks: JSON.stringify(pl.tracks),
        };
        return playlist;
      })
    );
  }

  generateRandomTracks(tracks, maxDuration) {
    let tracksToInclude = [];
    let tracksToAdd = tracks.slice();
    let maxDurationCopy = maxDuration;
    while (maxDurationCopy > 0 && tracksToAdd.length !== 0) {
      let random = Math.floor(Math.random() * (tracksToAdd.length - 1));
      let trackToAdd = tracksToAdd[random];
      tracksToAdd.splice(random, 1);
      if (maxDurationCopy >= trackToAdd.duration) {
        tracksToInclude.push(trackToAdd);
        maxDurationCopy -= trackToAdd.duration;
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
    let result = {};
    result.artists = this.artistMatchWith(name);
    result.albums = this.albumMatchWith(name);
    result.tracks = this.trackMatchWith(name);
    result.playlists = this.playlistMatchWith(name);
    return result;
  }

  artistMatchWith(artistName) {
    return this.artists.filter((artist) =>
      artist.name.toLowerCase().includes(artistName.toLowerCase())
    );
  }

  albumMatchWith(albumName) {
    let albums = this.artists
      .flatMap((artist) => artist.albums)
      .filter((album) =>
        album.name.toLowerCase().includes(albumName.toLowerCase())
      );
    albums.forEach((album) => delete album.artistId);
    return albums;
  }

  trackMatchWith(trackName) {
    return this.artists
      .flatMap((artist) => artist.albums)
      .flatMap((album) => album.tracks)
      .filter((track) =>
        track.name.toLowerCase().includes(trackName.toLowerCase())
      );
  }

  playlistMatchWith(playlistName) {
    return this.playlists.filter((playlist) =>
      playlist.name.toLowerCase().includes(playlistName.toLowerCase())
    );
  }

  playlistMatchWithNameAndDuration(playlistName, min, max) {
    return this.playlists.filter(
      (playlist) =>
        playlist.name.toLowerCase().includes(playlistName.toLowerCase()) &&
        playlist.getDuration() >= min &&
        playlist.getDuration() <= max
    );
  }

  addUser(userData) {
    let user = this.createUser(userData);
    this.save("data.json");
    return this.users.push(user);
  }

  createUser(userData) {
    return new User(this.getNextUserId(), userData.username);
  }

  getNextUserId() {
    let nextId = this.nextUserId;
    this.nextUserId++;
    return nextId;
  }

  listen(username, trackName) {
    let user = this.users.find((user) => user.username === username);
    if (!user) {
      throw new EntityNameDoesntExist("User", username);
    } else {
      let track = this.getTrackByName(trackName);
      if (!track) {
        throw new EntityNameDoesntExist("Track", trackName);
      } else {
        return user.listen(track);
      }
    }
  }

  findUserByUsername(username) {
    return console.log(
      this.users
        .find((user) => user.username === username)
        .listened.map((lis) => {
          let listen = {
            track: JSON.stringify(lis.track),
            quantity: lis.quantity,
          };
          return listen;
        })
    );
  }

  threeMostListen(artistName) {
    let artist = this.artists.find((artist) => artist.name === artistName);
    if (!artist) {
      throw new EntityNameDoesntExist("Artist");
    } else {
      let tracks = artist.albums.flatMap((album) => album.tracks);
      let listenedOfArtistTracks = this.users
        .flatMap((user) => user.listened)
        .filter((listened) =>
          tracks.map((track) => track.id).includes(listened.track.id)
        );
      let mostListenedTracks = tracks.map((track) => {
        let sumListened = {
          track: track,
          quantity: listenedOfArtistTracks
            .filter((listened) => listened.track.id === track.id)
            .map((listened) => listened.quantity)
            .reduce((acc, num) => num + acc, 0),
        };
        return sumListened;
      });
      let order = mostListenedTracks.sort(this.compare);

      console.log(
        "This is the three most listened of " +
          artistName +
          "\n 1." +
          order[0].track.name +
          "\n 2." +
          order[1].track.name +
          "\n 3." +
          order[2].track.name
      );
    }
  }

  compare(a, b) {
    if (a.quantity > b.quantity) {
      return -1;
    }
    if (a.quantity < b.quantity) {
      return 1;
    }
    return 0;
  }

  allArtists() {
    return console.log(
      this.artists.map((art) => {
        let artist = { id: art.id, name: art.name };
        return artist;
      })
    );
  }

  allAlbumsOfArtist(artistId) {
    return console.log(
      this.artists
        .flatMap((artist) => artist.albums)
        .filter((album) => album.artistId === artistId)
        .map((alb) => {
          let album = {
            id: alb.id,
            name: alb.name,
            year: alb.year,
            artistId: alb.artistId,
          };
          return album;
        })
    );
  }

  allTracksOfAlbum(albumId) {
    return console.log(
      this.artists
        .flatMap((artist) => artist.albums)
        .flatMap((album) => album.tracks)
        .filter((track) => track.albumId === albumId)
    );
  }

  populateAlbumsForArtist(artistName) {
    let artist = this.getArtistByName(artistName);
    if (artist != undefined) {
      return spotify
        .getAllAlbumsFromArtist(artistName)
        .then((response) => this.createAlbumsFromArtist(artist, response))
        .then(() => this.save("data.json"))
        .catch((error) => console.log(error.message));
    } else {
      return Promise.reject(new EntityNameDoesntExist("Artist", artistName));
    }
  }

  createAlbumsFromArtist(artist, response) {
    response.items.forEach((alb) =>
      this.addAlbumBySpotify(artist.getId().toString(), {
        name: alb.name,
        year: parseInt(alb.release_date.substring(0, 4)),
      })
    );
  }

  addAlbumBySpotify(artistId, albumData) {
    let artist = this.getArtistById(artistId);
    // if (this.albumDuplicatedOnArtist(artist, albumData)) { //Consultar Profe
    // throw new InvalidArtist(artist.getId());}
    let album = this.createAlbum(artistId, albumData);
    artist.albums.push(album);
    return album;
  }

  getLyrics(trackName) {
    //Nota: todos los returns devuelven Promesas.
    let track = this.getTrackByName(trackName);
    if (track !== undefined) {
      if (track.lyrics === "") {
        return track.getLyrics().then((lyrics) => {
          this.save("data.json");
          return lyrics;
        });
      } else {
        return Promise.resolve(track.lyrics);
      }
    } else {
      return Promise.reject(new EntityNameDoesntExist("Track", trackName));
    }
  }

  getAllArtist() {
    return this.artists;
  }

  getAllAlbums() {
    let albums = this.artists
      .flatMap((artist) => artist.albums)
      .filter((album) => album != null);
    return this.createAlbumsResponse(albums);
  }

  createAlbumsResponse(albums) {
    return albums.map(album => {
      return {
        id : album.id,
        name: album.name,
        year: album.year,
        tracks: album.tracks,
      }
    })
  }

  save(filename) {
    const serializedData = picklify.picklify(this);
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, { encoding: "utf-8" });
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [
      UNQfy,
      Artist,
      Album,
      Track,
      Playlist,
      User,
      Listened,
      NewsletterObserver,
      LoggingObserver,
    ];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy: UNQfy,
};
