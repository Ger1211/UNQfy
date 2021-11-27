const rp = require("request-promise");

const BASE_URL = process.env.LOGGING_HOST + "/api"
// const BASE_URL = "http://localhost:3002/api"

const logging = (() => {

  function sendArtistCreation(data) {
    const options = {
      url: `${BASE_URL}/artists/creation`,
      body: data,
      json: true,
    };
    return rp.post(options);
  }

  function sendAlbumCreation(data) {
    const options = {
      url: `${BASE_URL}/albums/creation`,
      body: data,
      json: true,
    };
    return rp.post(options);
  }

  function sendTrackCreation(data) {
    const options = {
      url: `${BASE_URL}/tracks/creation`,
      body: data,
      json: true,
    };
    return rp.post(options);
  }

  function sendArtistElimination(data) {
    const options = {
      url: `${BASE_URL}/artists/elimination`,
      body: data,
      json: true,
    };
    return rp.post(options);
  }

  function sendAlbumElimination(data) {
    const options = {
      url: `${BASE_URL}/albums/elimination`,
      body: data,
      json: true,
    };
    return rp.post(options);
  }

  function sendTrackElimination(data) {
    const options = {
      url: `${BASE_URL}/tracks/elimination`,
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