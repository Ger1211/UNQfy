const fs = require("fs"); // necesitado para guardar/cargar unqfy
const unqmod = require("./unqfy"); // importamos el modulo unqfy

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

    - Dado un string, imprimmir todas las entidades (artistas, albums, tracks, playlists) que coincidan parcialmente
    con el string pasado.

    - Dada un nombre de playlist, una lista de generos y una duración máxima, crear una playlist que contenga
    tracks que tengan canciones con esos generos y que tenga como duración máxima la pasada por parámetro.

  La implementacion de los comandos deberá ser de la forma:
   1. Obtener argumentos de linea de comando
   2. Obtener instancia de UNQfy (getUNQFy)
   3. Ejecutar el comando correspondiente en Unqfy
   4. Guardar el estado de UNQfy (saveUNQfy)

*/

function main() {
  console.log("arguments: ");
  let unqfy = getUNQfy();
  const arguments_ = process.argv.splice(2);
  let artist = undefined;
  let album = undefined;
  let track = undefined;

  if (arguments_[0] === "addArtist") {
    try{
      artist = unqfy.addArtist({name: arguments_[1], country:arguments_[2]}); //consola: node main.js addArtist name country.
    }catch(error){
      console.log(error.message);
      }
  }

  if (arguments_[0] === "addAlbum") {
    try{
    album = unqfy.addAlbum(arguments_[3],{name: arguments_[1], year: arguments_[2]});  //consola: node main.js addAlbum name year artistId.
    } catch(error){
      console.log(error.message);
      }
  }

  if (arguments_[0] === "addTrack") {
    try{
      album = unqfy.addTrack(arguments_[4],{name: arguments_[1], genres: arguments_[2], duration: arguments_[3]});  //consola: node main.js addTrack name "genre" duration albumId.
    }catch(error){
      console.log(error.message);
      }
}


/*
try {
    myroutine();      //puede lanzar tres excepciones
 } catch (error) {
    if (error instanceof TypeError) {
        console.log(error.message);
    } else if (error instanceof RangeError) {
        console.log(error.message);
    } else {
       // Sentencias para manejar una excepcion no esperada
       throw e
    }
}
*/






  saveUNQfy(unqfy);
  console.log(artist);
  console.log(album);
  console.log(track);


  //console.log("Artista encontrado: ",unqfy.getArtistById(1).albums[0].tracks[0]);
  //console.log("Album encontrado: ",unqfy.getAlbumById(1));
  //console.log("Track encontrado: ",unqfy.getTrackById(1));
  //console.log("Tracks del usuario encontrado: ",unqfy.getTracksMatchingArtist("Slash"));
  

/*

  let list11 = ['rock']
  let list22 = ["rock"]

  let result = false;
  for(let i=0; i < (list11.length); i++){ //ejemplo basico
    console.log(list11[i]);
    if (list22.includes(list11[i])){
      result = true;
    }
} 
  console.log("resultado espetado",result);
    
*/

  let genres = ['rock'];

  console.log("RESULT ESPERADO", unqfy.getTracksMatchingGenres(genres));

}

main();








