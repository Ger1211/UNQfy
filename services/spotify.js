const rp = require("request-promise");
const credentials = require("../spotifyCreds.json");
const spotify = (() => {
  function getAllAlbumsFromArtist(name) {
    const options = {
      url: `https://api.spotify.com/v1/search?q=${encodeURIComponent(name.trim())}&type=artist`,
      headers: {
        Authorization: `Bearer ${credentials.access_token}`,
      },
      json: true,
    };
    return rp.get(options).then((response) => {
      const id = response.artists.items[0].id;
      const options = {
        url: `https://api.spotify.com/v1/artists/${id}/albums`,
        headers: {
          Authorization: `Bearer ${credentials.access_token}`
        },
        json: true,
      };
      return rp.get(options);
    });
  }

  return {
    getAllAlbumsFromArtist: getAllAlbumsFromArtist,
  };
})();

exports.default = spotify;
