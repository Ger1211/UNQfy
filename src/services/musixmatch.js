const rp = require("request-promise");
const BASE_URL = "http://api.musixmatch.com/ws/1.1";
const musixmatch = (() => {
  function getTrackLyric(trackName) {
    const options = {
      uri: `${BASE_URL}/track.search?q_track=${encodeURIComponent(
        trackName.trim()
      )}`,
      qs: {
        apikey: "2ea2daaeb804beda89d86a8693ee9398",
      },
      json: true,
    };

    return rp.get(options).then((response) => {
      const track = response.message.body.track_list.find(
        (track) => track.track.has_lyrics === 1
      );
      if (track) {
        const options = {
          uri: `${BASE_URL}/track.lyrics.get?track_id=${track.track.track_id}`,
          qs: {
            apikey: "2ea2daaeb804beda89d86a8693ee9398",
          },
          json: true,
        };
        return rp.get(options);
      }
    });
  }

  return {
    getTrackLyric: getTrackLyric,
  };
})();

module.exports = musixmatch;
