const rp = require("request-promise");
const logging = (() => {
  function sendInfo(data,action) {
    const options = {
      url: `http://localhost:3001/api/${action}`,
      body: data,
      json: true,
    };
    return rp.post(options)
        .then((response) =>  console.log(response));
  }
    
  return {
    sendInfo: sendInfo,
  };
})();

module.exports = logging;