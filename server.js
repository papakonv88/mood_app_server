require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const topojson = require('topojson-server');


const { mongoose } = require('./db/mongoose.js');
const { dataModel } = require('./models/boundaries');
const { dataModelCities } = require('./models/cities');
const { Users } = require('./models/users');

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

app.post('/form', async (req, res) => {
    if (!req.body) {
        res.sendStatus(500);
    }

    const newUser = new Users({ properties: { mood: req.body.mood, tags: req.body.tags }, geometry: { coordinates: req.body.location } });
    newUser.save().then((data) => {
        console.log('User doc Saved');
        res.sendStatus(200);
    }).catch((err) => {
        console.log('User doc not Saved');
        res.sendStatus(404);
    });
});

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});

app.get('/votes', (req, res) => {

    Users.find({}).then((docs) => {

        return docs;

    }).then((data) => {

        const geojs = {
            type: "FeatureCollection",
            features: []
        };

        function Entity(i) {
            this.type = "Feature";
            this.properties = i.properties;
            this.geometry = i.geometry;
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
