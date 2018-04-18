import _ from 'lodash';

class File {

    constructor(app, object){
        this.app = app;
        this.model = {
            name: null,
            originalname: null,
            mimetype: null,
            size: null,
            createdAt: Date.now(),
        }
    }

    initObject(object){
        this.model.name = _.get(object,'filename'); //
        this.model.originalname = _.get(object, 'originalname');
        this.model.mimetype = _.get(object, 'mimetype');
        this.model.size = _.get(object, 'size');
        this.model.createdAt = Date.now();

        return this;
    }

    toJsonObject(){
        return this.model;
    }

    save(callback){
        const db = this.app.get('db');
        db.collection('files').insertOne(this.model, (err,result)=>{
            return callback(err,result);
        });
    }
}

export default File;