const rp = require("request-promise");
const newsletter = (() => {
  function sendAlbumInfo(albumData) {
    const options = {
      url: `http://localhost:3001/api/newAlbums`,
      body: albumData,
      json: true,
    };
    return rp.post(options)
        .then((response) =>  console.log(response));
  }
  
 
  
  return {
    sendAlbumInfo: sendAlbumInfo,
  };
})();

module.exports = newsletter;