const fs = require("fs"); // necesitado para guardar/cargar unqfy
const unqmod = require("./unqfy"); // importamos el modulo unqfy

function getUNQfy(filename = "data.json") {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

let express = require("express");
let app = express();
let router = express.Router();
let port = process.env.PORT || 8080;
app.use(express.json());

router
  .get("/", function (req, res) {
    res.status(200);
    res.json({ message: "hooray! welcome to our API" });
  })
  .get("/artists/:artistId", function (req, res) {
    //router.route('/artists/:artistId').get(function (req, res){

    const artistId = req.params.artistId;
    const artista = getUNQfy().getArtistById(artistId);
    if (artista !== undefined) {
      res.status(200);
      res.json(artista);
    } else {
      res.status(404);
      res.json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
    }
  })
  .get("/artists", function (req, res) {
    const artistName = req.query.name;
    let result;
    if (artistName != undefined) {
      result = getUNQfy().artistMatchWith(artistName);
      if (result.length !== 0) {
        res.status(200);
        res.json(result);
      } else {
        res.status(200);
        res.json([]);
      }
    } else {
      result = getUNQfy().getAllArtist();
      res.status(200);
      res.json(result);
    }
  })
  .post("/artists", function (req, res) {
    try {
      if (req.body.name && req.body.country) {
        const artistData = req.body;
        newArtist = getUNQfy().addArtist(artistData);
        res.status(201);
        res.json(newArtist);
      } else {
        throw Error("BAD_REQUEST");
      }
    } catch (error) {
      res.status(400);
      res.json({
        status: 400,
        errorCode: "BAD_REQUEST",
      });
    }
  })
  .put("/artists/:artistId", function (req, res) {
    const artistId = req.params.artistId;
    const artista = getUNQfy().getArtistById(artistId);
    if (artista !== undefined) {
      const newArtistData = { name: req.body.name, country: req.body.country };
      const modifiedArtist = getUNQfy().modifyArtistById(
        artistId,
        newArtistData
      );
      res.status(200);
      res.json(modifiedArtist);
    } else {
      res.status(404);
      res.json({
        errorMessage: `There is no Artist with ID ${artistId}`,
        statusCode: res.statusCode,
      });
    }
  })
  .delete("/artists/:artistId", function (req, res) {
    //Metodo Delete no devuelve respuesta cuando es exitoso.

    const artistId = req.params.artistId;
    const artist = getUNQfy().getArtistById(artistId);
    if (artist !== undefined) {
      try {
        getUNQfy().deleteArtist(artist.name);
        res.status(204).send();
      } catch (error) {
        res.status(404);
        res.json({ errorMessage: error.message, statusCode: res.statusCode });
      }
    } else {
      res.status(404);
      res.json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
    }
  })
  .delete("/albums/:albumId", function (req, res) {
    const albumId = req.params.albumId;
    const album = getUNQfy().getAlbumById(albumId);
    if (album !== undefined) {
      try {
        getUNQfy().deleteAlbum(album.name);
        res.status(204).send();
      } catch (error) {
        res.status(404);
        res.json({ errorMessage: error.message, statusCode: res.statusCode });
      }
    } else {
      res.status(404);
      res.json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
    }
  })
  .delete("/playlists/:playlistId", function (req, res) {
    const playlistId = req.params.playlistId;
    try {
      getUNQfy().deletePlaylist(playlistId);
      res.status(204).send();
    } catch (error) {
      res.status(404);
      res.json({ errorMessage: error.message, statusCode: res.statusCode });
    }
  })
  .get("/albums", function (req, res) {
    const albumName = req.query.name;
    let result;
    if (albumName != undefined) {
      result = getUNQfy().albumMatchWith(albumName);
      if (result.length !== 0) {
        res.status(200);
        res.json(result);
      } else {
        res.status(200);
        res.json([]);
      }
    } else {
      result = getUNQfy().getAllAlbums();
      res.status(200);
      res.json(result);
    }
  })
  .get("/albums/:albumId", function (req, res) {
    const albumId = req.params.albumId;
    const album = getUNQfy().getAlbumById(albumId);
    if (album !== undefined) {
      res.status(200);
      res.json(album);
    } else {
      res.status(404);
      res.json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
    }
  })
  .post("/albums", function (req, res) {
    try {
      const albumData = {
        name: req.body.name,
        year: req.body.year,
      };
      const artistId = req.body.artistId;
      const artist = getUNQfy().getArtistById(artistId);
      if (artist === undefined) {
        res.status(404);
        res.json({
          status: 404,
          errorCode: "RELATED_RESOURCE_NOT_FOUND",
        });
      }
      if (albumData.name && albumData.year && artistId) {
        newAlbum = getUNQfy().addAlbum(artistId, albumData);
        res.status(201);
        res.json(newAlbum);
      } else {
        throw Error("BAD_REQUEST");
      }
    } catch (error) {
      res.status(400);
      res.json({
        status: 400,
        errorCode: "BAD_REQUEST",
      });
    }
  })
  .patch("/albums/:albumId", function (req, res) {
    const albumId = req.params.albumId;
    const album = getUNQfy().getAlbumById(albumId);
    if (album !== undefined) {
      const newYear = req.body.year;
      const modifiedAlbum = getUNQfy().modifyAlbumById(albumId, newYear);
      res.status(200);
      res.json(modifiedAlbum);
    } else {
      res.status(404);
      res.json({
        errorMessage: `There is no Album with ID ${albumId}`,
        statusCode: res.statusCode,
      });
    }
  })
  .post("/playlists", function (req, res) {
    //node main.js createPlaylist name genresToInclude maxDuration.
    try {
      const playlistName = req.body.name;
      const maxDuration = req.body.maxDuration;
      const genres = req.body.genres;

      newPlaylist = getUNQfy().createPlaylist(
        playlistName,
        genres,
        maxDuration
      ); //unqfy.createPlaylist(arguments_[1], arguments_[2].split(","),arguments_[3]);
      res.status(201);
      res.json(newPlaylist);
    } catch (error) {
      res.status(400);
      res.json({ errorMessage: error.message, statusCode: res.statusCode });
    }
  })
  .post("/playlists2", function (req, res) {
    //Tuve que poner el playlists2 ya que los endpoint's de arriba y este son iguales, solo cambia el body y no se como diferenciarlos.
    try {
      const playlistName = req.body.name;
      const tracks = req.body.tracks;

      newPlaylist = getUNQfy().createPlaylistWithSetOfTracks(
        playlistName,
        tracks
      );
      res.status(201);
      res.json(newPlaylist);
    } catch (error) {
      res.status(404);
      res.json({ errorMessage: error.message, statusCode: res.statusCode });
    }
  })
  .get("/playlists/:playlistId", function (req, res) {
    const playlistId = req.params.playlistId;
    const playlist = getUNQfy().getPlaylistById(playlistId);
    if (playlist !== undefined) {
      res.status(200);
      res.json(playlist);
    } else {
      res.status(404);
      res.json({
        errorMessage: `There is no Playlist with ID ${playlistId}`,
        statusCode: res.statusCode,
      });
    }
  })
  .get("/playlists", function (req, res) {
    const playlistName = req.query.name;
    const durationLT = req.query.durationLT;
    const durationGT = req.query.durationGT;
    result = getUNQfy().playlistMatchWithNameAndDuration(
      playlistName,
      durationGT,
      durationLT
    );
    if (result.length !== 0) {
      res.status(200);
      res.json(result);
    } else {
      res.status(404);
      res.json({
        errorMessage: `There is no result for the playlist with the name ${playlistName} and the given duration`,
        statusCode: res.statusCode,
      });
    }
  })
  .get("/tracks/:trackId/lyrics", async function (req, res) {
    const trackId = req.params.trackId;
    const track = getUNQfy().getTrackById(trackId);
    if (track !== undefined) {
      let lyric = await getUNQfy()
        .getLyrics(track.name)
        .then((lyric) => {
          const result = {
            name: track.name,
            lyrics: lyric,
          };

          return result;
        });
      res.status(200);
      res.json(lyric);
    } else {
      res.status(404);
      res.json({
        errorMessage: `There is no Track with ID ${trackId}`,
        statusCode: res.statusCode,
      });
    }
  });

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send({ status: 400, errorCode: "BAD_REQUEST" });
  }
  next();
});
app.use("/api", router);
app.use(function (req, res) {
  // Invalid request
  res.status(404);
  res.json({
    status: 404,
    errorCode: "RESOURCE_NOT_FOUND",
  });
});
app.listen(port, () => console.log(`Port ${port} listening`));
