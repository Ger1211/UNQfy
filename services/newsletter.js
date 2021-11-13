const rp = require("request-promise");
const newsletter = (() => {
  function notify(data) {
    const options = {
      url: `http://localhost:3001/api/notify`,
      body: data,
      json: true,
    };
    return rp.post(options)
        .then((response) =>  console.log(response));
  }
  
  return {
    notify: notify,
  };
})();

module.exports = newsletter;