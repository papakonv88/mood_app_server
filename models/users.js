
const mongoose = require('mongoose');
const moment = require('moment');

const boundaries = mongoose.model('boundaries', new mongoose.Schema({}), 'Boundaries');

const userSchema = new mongoose.Schema({
    type: {
        type: String,
        default: 'Feature'
    },
    properties: {
        country: {
            ISO3_CODE: {
                type: String
            },
            name: {
                type: String
            }
        },
        mood: {
            type: String,
            required: true
        },
        tags: {
            type: Array,
            required: true

        },
        date: {
            type: String,
            default: moment().format("DD/MM/YYYY, h:mm:ss a")
        }
    },
    geometry: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    }
});

userSchema.pre('save', function (next) {
    const data = this.geometry.coordinates;

    async function geores() {
        let result = await boundaries.find({
            loc: {
                $geoIntersects: {
                    $geometry: {
                        type: "Point",
                        coordinates: data
                    }
                }
            }
        });
        return result;
    };

    geores().then((doc) => {
        this.properties.country.ISO3_CODE = doc[0]._doc.properties.ISO3_CODE;
        this.properties.country.name = doc[0]._doc.properties.NAME_ENGL;

        if (this.properties.country) {
            next();
        }
    }).catch((err) => {
        next(err);
    });

});

const Users = mongoose.model('User', userSchema);

module.exports = {
    Users
};