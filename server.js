require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const topojson = require('topojson-server');


const { mongoose } = require('./db/mongoose.js');
const { dataModel } = require('./models/boundaries');
const { dataModelCities } = require('./models/cities');

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());


app.get('/countries', (req, res) => {

    dataModel.find({}).then((docs) => {

        return docs;

    }).then((data) => {

        const geojs = {
            type: "FeatureCollection",
            features: []
        };

        function Entity(i) {
            this.type = "Feature";
            this.properties = i._doc.properties;
            this.geometry = i._doc.loc;
        }
        Object.keys(data).forEach((key) => {
            geojs.features.push(new Entity(data[key]));
        });

        const topology = topojson.topology({ data: geojs });
        res.json(topology);

    }).catch((err) => {
        throw new Error;
    });

});

app.get('/cities', (req, res) => {

    dataModelCities.find({}).then((docs) => {

        return docs;

    }).then((data) => {

        const geojs = {
            type: "FeatureCollection",
            features: []
        };

        function Entity(i) {
            this.type = "Feature";
            this.properties = i._doc.properties;
            this.geometry = i._doc.loc;
        }
        Object.keys(data).forEach((key) => {
            geojs.features.push(new Entity(data[key]));
        });

        const topology = topojson.topology({ data: geojs });
        res.json(topology);

    }).catch((err) => {
        throw new Error;
    });

});

app.post('/form', (req, res) => {
    console.log(req.body);
    if (!req.body) {
    res.sendStatus(200);
    }
});

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});


