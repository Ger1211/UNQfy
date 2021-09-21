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


  let invocation = arguments_[0];

switch(invocation){

    case "addArtist":
      try{
        artist = unqfy.addArtist({name: arguments_[1], country:arguments_[2]}); //consola: node main.js addArtist name country.
        console.log("New Artist: ",artist);
      }catch(error){
        console.log(error.message);
        }
        break;    

    case "addAlbum":
      try{
        album = unqfy.addAlbum(arguments_[3],{name: arguments_[1], year: arguments_[2]});  //consola: node main.js addAlbum name year artistId.
        console.log("New Album: ",album);
        } catch(error){
          console.log(error.message);
          }
        break;

    case "addTrack":     
      try{
        track = unqfy.addTrack(arguments_[4],{name: arguments_[1], genres: arguments_[2].split(","), duration: arguments_[3]});  //consola: node main.js addTrack name "genre" duration albumId.
        console.log(track);
      }catch(error){
        console.log("New Track: ",error.message);
        }
      break;

    case "deleteTrack":     
      try{
        unqfy.deleteTrack(arguments_[1]);  //consola: node main.js deleteTrack name.
      }catch(error){
        console.log(error.message);
        }
      break;

    case "deleteAlbum":     
      try{
        unqfy.deleteAlbum(arguments_[1]);  //consola: node main.js deleteAlbum name.
      }catch(error){
        console.log(error.message);
        }
      break;

    case "deleteArtist":     
      try{
        unqfy.deleteArtist(arguments_[1]);  //consola: node main.js deleteArtist name.
      }catch(error){
        console.log(error.message);
        }
      break;

    case "addUser":     
      try{
        unqfy.addUser({username: arguments_[1]});  //consola: node main.js addUser username.
      }catch(error){
        console.log(error.message);
        }
      break;

    case "listen":     
      try{
        unqfy.listen(arguments_[1], arguments_[2]);  //consola: node main.js listen username trackName.
      }catch(error){
        console.log(error.message);
        }
      break;

    case "findUserByUsername":     
      try{
        unqfy.findUserByUsername(arguments_[1]);  //consola: node main.js findUserByUsername username.
      }catch(error){
        console.log(error.message);
        }
      break;

    case "threeMostListen":     
      try{
        unqfy.threeMostListen(arguments_[1]);  //consola: node main.js threeMostListen artistName.
      }catch(error){
        console.log(error.message);
        }
      break;    
}



  saveUNQfy(unqfy);

  //console.log("Artista encontrado: ",unqfy.getArtistById(1).albums[0].tracks[0]);
  //console.log("Tracks de  artista: ", unqfy.getArtistById(1).albums.flatMap(album => album.tracks));
  //console.log("Album encontrado: ",unqfy.getAlbumById(1));
  //console.log("Track encontrado: ",unqfy.getTrackById(4));
  //console.log("Tracks del usuario encontrado: ",unqfy.getTracksMatchingArtist("Slash"));
  
  //let genres = ['rock'];

  //console.log("RESULT ESPERADO", unqfy.getTracksMatchingGenres(genres));
  //console.log("RESULT ESPERADO PLAYLIST", unqfy.createPlaylist('myPlaylist',genres, 100));

}

main();