import {MongoClient} from 'mongodb';
import './index';

const url = 'mongodb://localhost:27017/test-s3upload';


export const connect = (callback)=>{
    MongoClient.connect(url, (err,db)=>{
        return callback(err,db.db('test-s3upload'));
    });
};
