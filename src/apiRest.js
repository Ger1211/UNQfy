const fs = require("fs"); // necesitado para guardar/cargar unqfy
const unqmod = require("./unqfy"); // importamos el modulo unqfy
const NewsletterObserver = require("./observers/newsletterObserver");
const LoggingObserver = require("./observers/loggingObserver");

function getUNQfy(filename = "data.json") {
  let observers = [new NewsletterObserver(), new LoggingObserver()];
  let unqfy = new unqmod.UNQfy(observers);
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
  .get("/status", function (req, res) {
    res.status(200).send();
  })
  .get("/artists/:artistId", function (req, res) {
    const artistId = req.params.artistId;
    const artista = getUNQfy().getArtistById(artistId);
    if (artista !== undefined) {
      res.status(200);
      artista.albums.forEach((album) => delete album.artistId);
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
    if (req.body.name && req.body.country) {
      const artistData = req.body;
      let artist = getUNQfy().getArtistByName(artistData.name);
      if (artist === undefined) {
        let newArtist = getUNQfy().addArtist(artistData);
        res.status(201);
        res.json(newArtist);
      } else {
        res.status(409);
        res.json({
          status: 409,
          errorCode: "RESOURCE_ALREADY_EXISTS",
        });
      }
    } else {
      res.status(400);
      res.json({
        status: 400,
        errorCode: "BAD_REQUEST",
      });
    }
  })
  .put("/artists/:artistId", function (req, res) {
    if (req.body.name && req.body.country) {
      const artistId = req.params.artistId;
      const artista = getUNQfy().getArtistById(artistId);
      if (artista !== undefined) {
        const newArtistData = req.body;
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
    } else {
      res.status(400);
      res.json({
        status: 400,
        errorCode: "BAD_REQUEST",
      });
    }
  })
  .delete("/artists/:artistId", function (req, res) {
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
      delete album.artistId;
      res.json(album);
    } else {
      res.status(404);
      res.json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
    }
  })
  .post("/albums", function (req, res) {
    if (req.body.name && req.body.year && req.body.artistId) {
      const albumData = {
        name: req.body.name,
        year: req.body.year,
      };
      let album = getUNQfy().getAlbumByName(albumData.name);
      if (!album) {
        const artistId = req.body.artistId;
        const artist = getUNQfy().getArtistById(artistId);
        if (artist === undefined) {
          res.status(404);
          res.json({
            status: 404,
            errorCode: "RELATED_RESOURCE_NOT_FOUND",
          });
        } else if (albumData.name && albumData.year && artistId) {
          newAlbum = getUNQfy().addAlbum(artistId, albumData);
          res.status(201);
          res.json(newAlbum);
        }
      } else {
        res.status(409);
        res.json({
          status: 409,
          errorCode: "RESOURCE_ALREADY_EXISTS",
        });
      }
    } else {
      res.status(400);
      res.json({
        status: 400,
        errorCode: "BAD_REQUEST",
      });
    }
  })
  .patch("/albums/:albumId", function (req, res) {
    if (req.body.year) {
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
    } else {
      res.status(400);
      res.json({
        status: 400,
        errorCode: "BAD_REQUEST",
      });
    }
  })
  .post("/playlists", function (req, res) {
    try {
      const playlistName = req.body.name;
      const maxDuration = req.body.maxDuration;
      const genres = req.body.genres;
      const tracks = req.body.tracks;
      if (tracks === undefined) {
        if (req.body.name && req.body.maxDuration && req.body.genres) {
          newPlaylist = getUNQfy().createPlaylist(
            playlistName,
            genres,
            maxDuration
          );
          res.status(201);
          res.json(newPlaylist);
        } else {
          res.status(400);
          res.json({
            status: 400,
            errorCode: "BAD_REQUEST",
          });
        }
      } else {
        if (req.body.name && req.body.tracks) {
          newPlaylist = getUNQfy().createPlaylistWithSetOfTracks(
            playlistName,
            tracks
          );
          res.status(201);
          res.json(newPlaylist);
        } else {
          res.status(400);
          res.json({
            status: 400,
            errorCode: "BAD_REQUEST",
          });
        }
      }
    } catch (error) {
      res.status(400);
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
  .get("/tracks/:trackId/lyrics", function (req, res) {
    const trackId = req.params.trackId;
    const track = getUNQfy().getTrackById(trackId);

    if (track === undefined) {
      res.status(404);
      res.json({
        errorMessage: `RESOURCE_NOT_FOUND`,
        statusCode: res.statusCode,
      });
    } else {
      getUNQfy()
        .getLyrics(track.name)
        .then((lyric) => {
          const result = {
            name: track.name,
            lyrics: lyric,
          };
          return result;
        })
        .then((lyrics) => {
          res.status(200);
          res.json(lyrics);
        });
    }
  });

app.use("/api", router);
app.use(function (req, res) {
  res.status(404);
  res.json({
    status: 404,
    errorCode: "RESOURCE_NOT_FOUND",
  });
  // next(new Error)
});
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send({ status: 400, errorCode: "BAD_REQUEST" });
  }
  next();
});
app.listen(port, () => console.log(`Port ${port} listening`));
