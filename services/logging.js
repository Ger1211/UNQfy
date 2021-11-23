const rp = require("request-promise");
const logging = (() => {

  function sendArtistCreation(data) {
    const options = {
      url: `http://localhost:3002/api/artists/creation`,
      body: data,
      json: true,
    };
    return rp.post(options);
  }

  function sendAlbumCreation(data) {
    const options = {
      url: `http://localhost:3002/api/albums/creation`,
      body: data,
      json: true,
    };
    return rp.post(options);
  }

  function sendTrackCreation(data) {
    const options = {
      url: `http://localhost:3002/api/tracks/creation`,
      body: data,
      json: true,
    };
    return rp.post(options);
  }

  function sendArtistElimination(data) {
    const options = {
      url: `http://localhost:3002/api/artists/elimination`,
      body: data,
      json: true,
    };
    return rp.post(options);
  }

  function sendAlbumElimination(data) {
    const options = {
      url: `http://localhost:3002/api/albums/elimination`,
      body: data,
      json: true,
    };
    return rp.post(options);
  }

  function sendTrackElimination(data) {
    const options = {
      url: `http://localhost:3002/api/tracks/elimination`,
      body: data,
      json: true,
    };
    return rp.post(options);
  }


    
  return {
    sendArtistCreation: sendArtistCreation,
    sendAlbumCreation: sendAlbumCreation,
    sendTrackCreation: sendTrackCreation,
    sendArtistElimination: sendArtistElimination,
    sendAlbumElimination:sendAlbumElimination,
    sendTrackElimination:sendTrackElimination,
  };
})();

module.exports = logging;