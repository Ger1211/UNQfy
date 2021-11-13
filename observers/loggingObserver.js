const logging = require("./services/logging");


class LoggingObserver {
    
    notify(data,action){
        logging.sendInfo(data,action);   
    }    
}


module.exports = LoggingObserver;