const logging = require("../services/logging");
class LoggingObserver {
  notify(data, action) {
    if(action === 'artists') {
      logging.sendArtistCreation(data);
    }
  }
}

module.exports = LoggingObserver;
