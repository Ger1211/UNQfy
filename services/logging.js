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
    
  return {
    sendArtistCreation: sendArtistCreation,
  };
})();

module.exports = logging;