const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb');
const app_port = 3000;
const expressApi = require('./modules/expressApi')
const proxy = require('http-proxy-middleware');
require('dotenv').config();

app.use(express.static('public'));

MongoClient.connect(process.env.EXPRESS_MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(cl => app.locals.db = cl.db('express'))

app.use(
    '/.netlify/functions/',
    proxy({ target: 'http://localhost:9000', changeOrigin: true })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(app_port, '0.0.0.0', function () {
    console.log("App Started on PORT " + app_port);
});

app.post('/', async (req,res) => {
    if (req.body.act === 'searchZenitByCadNum' && req.body.cadNum){
        const id = await expressApi.searchZenitByCadNum(req.body.cadNum, app.locals.db)
        res.end(JSON.stringify(id))
    } else if (req.body.act === 'postZenitFiles' && req.body.id && req.body.photoArray){
        const status = await expressApi.postZenitFiles(req.body.id, req.body.photoArray, app.locals.db)
        res.end(JSON.stringify(status))
    }
})