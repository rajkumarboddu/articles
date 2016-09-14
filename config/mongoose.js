var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function(){
    var db = mongoose.connect(config.db);

    require('../app/models/users.server.model');
    require('../app/models/article.server.model');

    return db;
}