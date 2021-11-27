const rp = require("request-promise");

const BASE_URL = process.env.NEWSLETTER_HOST + "/api"
// const BASE_URL = "http://localhost:3001/api"

const newsletter = (() => {
  function notify(data) {
    const options = {
      url: `${BASE_URL}/notify`,
      body: data,
      json: true,
    };
    return rp.post(options);
  }

  function deleteSubscriptions(data) {
    const options = {
      url: `${BASE_URL}/subscriptions`,
      body: data,
      json: true,
    };
    return rp.delete(options);
  }

  return {
    notify: notify,
    deleteSubscriptions: deleteSubscriptions,
  };
})();

module.exports = newsletter;
