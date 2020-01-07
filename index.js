require('dotenv').config();
const aws = require('aws-sdk');
var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

aws.config.setPromisesDependency();
aws.config.update({
    accessKeyId: process.env.ACCESSKEY,
    secretAccessKey: process.env.SECRETKEY,
    region: process.env.REGION
}) 

var comprehend = new aws.Comprehend();

app.use(cors());
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.post('/', async function (req, res) {
    var response = {}
    cont = 0;
    
    var params = {
        LanguageCode: 'pt',
        TextList: [req.body.phrase]
    };

    await comprehend.batchDetectKeyPhrases(params, (err, data) => {
        if(!err) {
            response.KeyPhrases = data.ResultList[0].KeyPhrases;
            cont ++
            if(cont === 3) {
                res.send(response);
            }
        } else {
            console.log(err)
        }
    });

    await comprehend.batchDetectEntities(params, (err, data) => {
        if(!err) {
            response.Entities = data.ResultList[0].Entities;
            cont ++
            if(cont === 3) {
                res.send(response);
            }
        } else {
            console.log(err)
        }
    });

    await comprehend.batchDetectSentiment(params, (err, data) => {
        if(!err) {
            response.Sentiment = data.ResultList[0];
            cont ++
            if(cont === 3) {
                res.send(response);
            }
        } else {
            console.log(err)
        }
    });
});

  

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });
  