import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import {connect} from './database';
import AppRouter from './routers/router';
import multer from 'multer';
import path from 'path';


//File storage config
const storageDir = path.join(__dirname,'..','storage');

const storageConfig = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, storageDir)
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage: storageConfig});


const PORT = 3000;
const app = express();
app.server = http.createServer(app);

app.use(morgan('dev'));

app.use(cors({
    exposedHeaders: "*"
}));

app.use(bodyParser.json({
    limit: '50mb'
}));

app.set('root', __dirname);
app.set('storageDir', storageDir);
app.set('upload', upload);


//connect to database
connect((err, db)=>{
    // console.log(db);
    if(err){
        console.log('mongodb server error: ', err);
    }
    else {
        app.set('db', db);

        //init router
        new AppRouter(app);

        app.server.listen(process.env.PORT || PORT, ()=>{
            console.log(`App is running on port ${app.server.address().port}`);
        });
    }
})



export default app;