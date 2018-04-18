'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.connect = undefined;

var _mongodb = require('mongodb');

var url = 'mongodb://localhost:27017/test-s3upload';

var connect = exports.connect = function connect(callback) {
    _mongodb.MongoClient.connect(url, function (err, db) {
        return callback(err, db);
    });
};
//# sourceMappingURL=database.js.map