
import {version} from '../../package.json';
import path from 'path';
import _ from 'lodash';
import File from '../models/file';
import {ObjectId} from 'mongodb';


class AppRouter {
    constructor(app){
        this.app = app;
        this.setupRouters = this.setupRouters.bind(this);
        this.setupRouters();
    }


    setupRouters(){
        const app = this.app;
        const db = app.get('db');
        const uploadDir = app.get('storageDir');
        const upload = app.get('upload');

        //root routing
        app.get('/',(req,res)=>{
           return res.status(200).json({
               version: version
           });
        });

        //Upload Routing
        app.post('/api/upload',upload.array('files'), (req, res)=>{
            console.log('uploading in progress');
            const files = _.get(req, 'files', []);

            let fileModels =[];

            _.each(files, (fileObject)=>{

                const newFile = new File(app).initObject(fileObject).toJsonObject();
                fileModels.push(newFile);
            });

            // return res.json({
            //     files: fileModels
            // })
            // console.log(fileModels);

            // console.log(db);
            if(fileModels.length){
                db.collection('files').insertMany(fileModels, (err,result)=>{
                    if (err){
                        return res.status(503).json({
                            error: {message: err.toString()}
                        })
                    }
                    else {
                        console.log('files saved:', result);
                        return res.json({
                            files: fileModels
                        })
                    }

                });
            }
            else{
                return res.status(503).json({error: {message: 'File upload required'}});
            }
        });

        //download routing
        app.get('/api/download/:id', (req,res)=>{
            const fileId = req.params.id;
            console.log(fileId);
            db.collection('files').find({_id: ObjectId(fileId)}).toArray((err,result)=>{
                // console.log(result);
                const fileName = _.get(result, '[0].name');
                // console.log(fileName);
                // console.log(err);
                if(err || !fileName){
                    return res.status(404).json({
                        error:{
                            message:"file not found"
                        }
                    });
                }

                const filePath = path.join(uploadDir, '/', fileName);
                return res.download(filePath, fileName, (err)=> {
                    if (err) {
                        return res.status(501).json(
                            {
                                error:
                                    {message: "file not found"}
                            });
                    }
                    else {
                        console.log("file downloaded");
                    }
                });

            });

            // const filePath = path.join(uploadDir, '/', filename);
            //
            // return res.download(filePath, fileName, (err)=>{
            //     if(err){
            //         return res.status(501).json(
            //             {error:
            //                 {message:"file not found"}
            //         });
            //     }
            //     else{
            //         console.log("file downloaded");
            //     }
            // });
        });

        console.log('routing setup complete');
    }
}

export default AppRouter;