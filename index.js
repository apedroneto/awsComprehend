const aws = require('aws-sdk');
var express = require('express');
var app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const cors       = require('cors');
(async function() {

    try {

    aws.config.setPromisesDependency();
    aws.config.update({
        accessKeyId: process.env.ACCESSKEY,
        secretAccessKey: process.env.SECRETKEY,
        region: process.env.REGION
    }) 

    var params = {
        LanguageCode: 'pt',
        TextList: ["minha impressora Canon Maxx Tinta G3111 parou de funcionar e só mostra uma luz vermelha no painel"]
    };

    var comprehend = new aws.Comprehend();
    comprehend.batchDetectKeyPhrases(params, (err, data) => {
        if(!err) {
            console.log("\npalavras chave:\n")
            console.log(data.ResultList[0].KeyPhrases)
        } else {
            console.log(err)
        }
    });

    comprehend.batchDetectEntities(params, (err, data) => {
        if(!err) {
            console.log("\nElementos encontrados:\n")
            console.log(data.ResultList[0].Entities)
        } else {
            console.log(err)
        }
    });

    comprehend.batchDetectSentiment(params, (err, data) => {
        if(!err) {
            console.log("\nSentimentos encontrados:\n")
            console.log(data.ResultList[0])
        } else {
            console.log(err)
        }
    })

    } catch(e) {
        console.log('our error', e);
    }
    
})();

app.use(cors());
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.post('/', function (req, res) {
    
    res.send({response: req.body});
});
  

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });
  