const fs = require("fs"); // necesitado para guardar/cargar unqfy
const unqfy = require("./unqfy");
const unqmod = require("./unqfy"); // importamos el modulo unqfy
const spotify = require("./services/spotify");
const musixmatch = require("./services/musixmatch")

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename = "data.json") {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

function saveUNQfy(unqfy, filename = "data.json") {
  unqfy.save(filename);
}

/*
 En esta funcion deberán interpretar los argumentos pasado por linea de comandos
 e implementar los diferentes comandos.

  Se deberán implementar los comandos:
    - Alta y baja de Artista
    - Alta y Baja de Albums
    - Alta y Baja de tracks

    - Listar todos los Artistas
    - Listar todos los albumes de un artista
    - Listar todos los tracks de un album

    - Busqueda de canciones intepretadas por un determinado artista
    - Busqueda de canciones por genero

    - Dado un string, imprimir todas las entidades (artistas, albums, tracks, playlists) que coincidan parcialmente
    con el string pasado.

    - Dada un nombre de playlist, una lista de generos y una duración máxima, crear una playlist que contenga
    tracks que tengan canciones con esos generos y que tenga como duración máxima la pasada por parámetro.

  La implementacion de los comandos deberá ser de la forma:
   1. Obtener argumentos de linea de comando
   2. Obtener instancia de UNQfy (getUNQFy)
   3. Ejecutar el comando correspondiente en Unqfy
   4. Guardar el estado de UNQfy (saveUNQfy)

*/

async function main() {
  console.log("arguments: ");
  let unqfy = getUNQfy();
  const arguments_ = process.argv.splice(2);
  let invocation = arguments_[0];

  execFunction(invocation, unqfy, arguments_);

  // unqfy.populateAlbumsForArtist("Charly García")
  // unqfy.allAlbumsOfArtist(1);
  // saveUNQfy(unqfy);

  // spotify.default.getAllAlbumsFromArtist("Queen").then(response => {
  //   console.log(response.items.map(item => item.name))});
  // musixmatch.default.getTrackLyric("Despacito Luis Fonsi");
  // musixmatch.default.getTrackLyric("Bohemiam Rhapsody");
  // musixmatch.default.getTrackLyric("Ciudad Mágica");
  // musixmatch.default.getTrackLyric("Gracias a la vida");
  // musixmatch.default.getTrackLyric("Rasguña las piedras")
  //   .then(response => console.log(response.message.body.lyrics.lyrics_body))
  //   .catch(() => console.log("The song has not lyrics."));
}

main();
function execFunction(invocation, unqfy, arguments_) {
  switch (invocation) {
    case "addArtist":
      execAddArtist(unqfy, arguments_);
      break;

    case "addAlbum":
      execAddAlbum(unqfy, arguments_);
      break;

    case "addTrack":
      execAddTrack(unqfy, arguments_);
      break;

    case "deleteTrack":
      execDeleteTrack(unqfy, arguments_);
      break;

    case "deleteAlbum":
      execDeleteAlbum(unqfy, arguments_);
      break;

    case "deleteArtist":
      execDeleteArtist(unqfy, arguments_);
      break;

    case "allArtists":
      execAllArtist(unqfy);
      break;

    case "allAlbumsOfArtist":
      execAllAlbumsOfArtist(unqfy, arguments_);
      break;
    
    case "allTracksOfAlbum":
      execAllTracksOfAlbum(unqfy, arguments_);
      break;

    case "addUser":
      execAddUser(unqfy, arguments_);
      break;

    case "listen":
      execListen(unqfy, arguments_);
      break;

    case "findUserByUsername":
      execFindUserByUsername(unqfy, arguments_);
      break;

    case "threeMostListen":
      execThreeMostListen(unqfy, arguments_);
      break;
    
    case "getTracksMatchingArtist":
      execGetTracksMatchingArtist(unqfy, arguments_);
      break;
    
    case "getTracksMatchingGenres":
      execGetTracksMatchingGenres(unqfy, arguments_);
      break;
    
    case "createPlaylist":
      execCreatePlaylist(unqfy, arguments_);
      break;
    
    case "allPlaylist":
      execAllPlaylist(unqfy);
      break;

    case "searchByName":
      execSearchByName(unqfy, arguments_);
      break;

    case "populateAlbumsForArtist":
      execPopulateAlbumsForArtist(unqfy, arguments_);
      break;

    default:
      console.log("The command",invocation, "does not exist.");
  }
}

function execAddArtist(unqfy, arguments_) {
  try {
    let artist = unqfy.addArtist({
      name: arguments_[1],
      country: arguments_[2],
    }); //consola: node main.js addArtist name country.
    console.log("New Artist: ", artist);
  } catch (error) {
    console.log(error.message);
  }
}

function execAddAlbum(unqfy, arguments_) {
  try {
    let album = unqfy.addAlbum(arguments_[3], {
      name: arguments_[1],
      year: arguments_[2],
    }); //consola: node main.js addAlbum name year artistId.
    console.log("New Album: ", album);
  } catch (error) {
    console.log(error.message);
  }
}

function execAddTrack(unqfy, arguments_) {
  try {
    let track = unqfy.addTrack(arguments_[4], {
      name: arguments_[1],
      genres: arguments_[2].split(","),
      duration: arguments_[3],
    }); //consola: node main.js addTrack name "genre" duration albumId.
    console.log(track);
  } catch (error) {
    console.log("New Track: ", error.message);
  }
}

function execDeleteTrack(unqfy, arguments_) {
  try {
    unqfy.deleteTrack(arguments_[1]); //consola: node main.js deleteTrack name.
  } catch (error) {
    console.log(error.message);
  }
}

function execDeleteAlbum(unqfy, arguments_) {
  try {
    unqfy.deleteAlbum(arguments_[1]); //consola: node main.js deleteAlbum name.
  } catch (error) {
    console.log(error.message);
  }
}

function execDeleteArtist(unqfy, arguments_) {
  try {
    unqfy.deleteArtist(arguments_[1]); //consola: node main.js deleteArtist name.
  } catch (error) {
    console.log(error.message);
  }
}

function execAllArtist(unqfy) {
  try {
    unqfy.allArtists(); //consola: node main.js allArtists.
  } catch (error) {
    console.log(error.message);
  }
}

function execAllAlbumsOfArtist(unqfy, arguments_) {
  try {
    unqfy.allAlbumsOfArtist(arguments_[1]); //consola: node main.js allAlbumsOfArtist artistId.
  } catch (error) {
    console.log(error.message);
  }
}

function execAllTracksOfAlbum(unqfy, arguments_) {
  try {
    unqfy.allTracksOfAlbum(arguments_[1]); //consola: node main.js allTracksOfAlbum albumId.
  } catch (error) {
    console.log(error.message);
  }
}

function execAddUser(unqfy, arguments_) {
  try {
    unqfy.addUser({ username: arguments_[1] }); //consola: node main.js addUser username.
  } catch (error) {
    console.log(error.message);
  }
}

function execListen(unqfy, arguments_) {
  try {
    unqfy.listen(arguments_[1], arguments_[2]); //consola: node main.js listen username trackName.
  } catch (error) {
    console.log(error.message);
  }
}

function execFindUserByUsername(unqfy, arguments_) {
  try {
    unqfy.findUserByUsername(arguments_[1]); //consola: node main.js findUserByUsername username.
  } catch (error) {
    console.log(error.message);
  }
}

function execThreeMostListen(unqfy, arguments_) {
  try {
    unqfy.threeMostListen(arguments_[1]); //consola: node main.js threeMostListen artistName.
  } catch (error) {
    console.log(error.message);
  }
}

function execGetTracksMatchingArtist(unqfy, arguments_) {
  try {
    unqfy.getTracksMatchingArtist(arguments_[1]); //consola: node main.js getTracksMatchingArtist artistName.
  } catch (error) {
    console.log(error.message);
  }
}

function execGetTracksMatchingGenres(unqfy, arguments_) {
  try {
    unqfy.getTracksMatchingGenres(arguments_[1].split(",")); //consola: node main.js getTracksMatchingGenres genres.
  } catch (error) {
    console.log(error.message);
  }
}

function execCreatePlaylist(unqfy, arguments_) {
  try {
    unqfy.createPlaylist(arguments_[1], arguments_[2].split(","),arguments_[3]); //consola: node main.js createPlaylist name genresToInclude maxDuration.
  } catch (error) {
    console.log(error.message);
  }
}

function execAllPlaylist(unqfy) {
  try {
    unqfy.allPlaylist(); //consola: node main.js allPlaylist.
  } catch (error) {
    console.log(error.message);
  }
}

function execSearchByName(unqfy, arguments_) {
  try {
    console.log(unqfy.searchByName(arguments_[1])); //consola: node main.js searchByName name.
  } catch (error) {
    console.log(error.message);
  }
}

function execPopulateAlbumsForArtist(unqfy, arguments_) {
  try {
    console.log(unqfy.populateAlbumsForArtist(arguments_[1])) //consola: node main.js populateAlbumsForArtist artistName
  } catch(error) {
    console.log(error.message);
  }
}


