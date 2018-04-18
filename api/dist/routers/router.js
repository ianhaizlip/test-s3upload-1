'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _package = require('../../package.json');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _file = require('../models/file');

var _file2 = _interopRequireDefault(_file);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppRouter = function () {
    function AppRouter(app) {
        _classCallCheck(this, AppRouter);

        this.app = app;
        this.setupRouters();
    }

    _createClass(AppRouter, [{
        key: 'setupRouters',
        value: function setupRouters() {
            var app = this.app;
            var db = app.get('db');
            var uploadDir = app.get('storageDir');
            var upload = app.get('upload');

            //root routing
            app.get('/', function (req, res) {
                return res.status(200).json({
                    version: _package.version
                });
            });

            //Upload Routing
            app.post('/api/upload', upload.array('test-file'), function (req, res) {
                var files = _lodash2.default.get(req, 'files', []);

                var fileModels = [];

                _lodash2.default.each(files, function (fileObject) {
                    var newfile = new _file2.default(app).initObject(fileObject).toJsonObject();
                    fileModels.push(newFile);
                });

                if (fileModels.length) {
                    db.collection('files').insertMany(fileModels, function (err, result) {
                        if (err) {
                            return res.status(503).json({
                                error: { message: err.toString() }
                            });
                        } else {
                            console.log('files saved:', result);
                            return res.json({
                                files: fileModels
                            });
                        }
                    });
                } else {
                    return res.status(503).json({ error: { message: 'File upload required' } });
                }

                return res.json({ files: fileModels });
            });

            //download routing
            app.get('/api/download/:name', function (req, res) {
                var fileName = req.params.name;

                var filePath = _path2.default.join(uploadDir, '/', filename);

                return res.download(filePath, fileName, function (err) {
                    if (err) {
                        return res.status(501).json({ error: { message: "file not found" }
                        });
                    } else {
                        console.log("file downloaded");
                    }
                });
            });

            console.log('routing setup complete');
        }
    }]);

    return AppRouter;
}();

exports.default = AppRouter;
//# sourceMappingURL=router.js.map