const rp = require("request-promise");
const newsletter = (() => {
  function notify(data) {
    const options = {
      url: `http://localhost:3001/api/notify`,
      body: data,
      json: true,
    };
    return rp.post(options);
  }

  function deleteSubscriptions(data) {
    const options = {
      url: `http://localhost:3001/api/subscriptions`,
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
