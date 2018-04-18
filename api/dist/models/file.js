'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var File = function () {
    function File(app, object) {
        _classCallCheck(this, File);

        this.app = app;
        this.model = {
            name: null,
            originalname: null,
            mimetype: null,
            size: null,
            createdAt: Date.now()
        };
    }

    _createClass(File, [{
        key: 'initObject',
        value: function initObject(object) {
            this.model.name = _lodash2.default.get(object, 'filename'); //
            this.model.originalname = _lodash2.default.get(object, 'originalname');
            this.model.mimetype = _lodash2.default.get(object, 'mimetype');
            this.model.size = _lodash2.default.get(object, 'size');
            this.model.createdAt = Date.now();

            return this;
        }
    }, {
        key: 'toJsonObject',
        value: function toJsonObject() {
            return this.model;
        }
    }, {
        key: 'save',
        value: function save(callback) {
            var db = this.app.get('db');
            db.collection('files').insertOne(this.model, function (err, result) {
                return callback(err, result);
            });
        }
    }]);

    return File;
}();
//# sourceMappingURL=file.js.map