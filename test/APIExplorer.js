const { MongoClient } = require("mongodb")
const express = require("express");
const bodyParser = require("body-parser");
const { fetch, setGlobalDispatcher, Agent } = require('undici')
const cors = require('cors');

const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../test/.env') })

const apiKey = process.env.API_KEY;

async function mainQuerry(client) {
    const query = {
        PETS_ALLOWED: "Yes",
    }
    const cursor = client.db("full_data").collection("access").find(query).limit(10);
    const results = await cursor.toArray();
    //console.log(results);
}


async function main(app) {
    const uri = "mongodb+srv://stevenza:gummybear5@beaches.dpvcq96.mongodb.net/?retryWrites=true&w=majority"
    const client = new MongoClient(uri);
    try {
        await client.connect();

        await app.post('/home', async (req, res) => {

            const { latitude, longitude } = await req.body;
            console.log(latitude, longitude);
            await client.connect();
            /*

            client.db("full_data").collection("access").find().limit(2189).forEach(function (myDoc) {
                let newDistance = 0;
                let api_key = "apiKey";
                let google_maps = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${myDoc.Y_LATITUDE},${myDoc.X_LONGITUDE}&origins=${latitude},${longitude}&key=${api_key}`;
                //console.log(google_maps);
                const arr = [];
                fetch(google_maps)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (response) {
                        try {
                            newDistance = (response["rows"][0].elements[0].duration.value);

                            arr.push(myDoc.OBJECTID);
                            client.db("full_data").collection("access").updateOne(
                                { ACCESS_STATUS: { $in: ["Full Access", "Full Access With Parking"] }, ACCESS_NAME: myDoc.ACCESS_NAME },
                                { $set: { distance: newDistance } }
                            );
                        } catch (e){
                            console.log(e);
                        }
                    });
                });
                
            
            */

        });



        await app.post("/send-data", async (req, res) => {
            const { BEACH_OR_CITY_NAME, GULF_COAST, ATLANTIC_COAST, FEE, PARKING, ADA, RV_PARKING, LIFEGUARD, RESTROOM, TRAIL, PICNIC, BOAT_RAMP, FISHING_PIER, MARINA, PETS_ALLOWED, FOOD } = await req.body;
            await client.connect();

            /* Make query */
            const query = {};
            query.ACCESS_STATUS = { $in: ["Full Access", "Full Access With Parking"] }
            if (GULF_COAST) query.GULF_COAST = "Yes";
            if (ATLANTIC_COAST) query.GULF_COAST = "Yes";
            if (FEE) {
                query.ENTRANCE_FEE = { $not: { $eq: 'Yes' } }
                query.PARKING_FEE = { $not: { $eq: 'Yes' } }
            }

            if (PARKING) query.REGULAR_PARKING = "Yes";
            if (ADA) {
                query.ADA_PARKING = "Yes";
                query.ADA_ACCESSIBLE = "Yes";
            }
            if (RV_PARKING) {
                query.RV_PARKING = "Yes";
            }
            if (LIFEGUARD) {
                query.LIFEGUARD = "Yes";
            }
            if (RESTROOM) {
                query.RESTROOM = "Yes";
            }
            if (TRAIL) {
                query.BOARDWALK_TRAIL = "Yes";
            }
            if (PICNIC) {
                query.PICNIC_OPEN = "Yes";
            }

            if (BOAT_RAMP) {
                query.BOAT_RAMP = "Yes";
            }

            if (FISHING_PIER) {
                query.FISHING_PIER = "Yes";
            }

            if (MARINA) {
                query.MARINA = "Yes";
            }

            if (PETS_ALLOWED) {
                query.PETS_ALLOWED = "Yes";
            }

            if (FOOD) {
                query.$or = [{ FOOD_ON_SITE: "Yes" }, { FOOD_NEARBY: "Yes" }];
            }

            query.distance = { $gt: 100 };
            //console.log(query);

            //change the limit as many times as you want -- 1 is set as default so that I reduce usage of API
            const cursor = client.db("full_data").collection("access").find(query).limit(50).sort({ distance: 1 });
            const results = await cursor.toArray();
            //console.log(results);
            res.json(results);
        });

        await app.post("/send-stars", async (req, res) => {
            //remember to turn this off later so that you avoid API Costs
            // Construct the URL for the Nearby Search request
            const { latitude, longitude } = await req.body;
            
            const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=beach&location=${latitude},${longitude}&radius=1500&key=${apiKey}`;
            console.log(url);
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'OK') {
                        const results = data.results;
                        console.log(results);
                        if (results.length > 0) {
                            const place = results[0];
                            

                            const placeId = place.place_id;

                            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;
                           
                            fetch(detailsUrl)
                                .then(response => response.json())
                                .then(placeData => {
                                    if (placeData.status === 'OK' && placeData.result.photos && placeData.result.photos.length > 0) {
                                        const photoReference = placeData.result.photos[0].photo_reference;
                                        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;
                                        
                                        const returnObject = {
                                            rating: place.rating,
                                            numRatings: place.user_ratings_total,
                                            photoUrl: photoUrl
                                        }
                                        res.json(returnObject);
                                    }
                                })
                                .catch(error => {
                                    console.error('Error fetching place details:', error);
                                });
                        } else {
                            console.log('Error retrieving reviews');
                        }
                    } else {
                        console.log('Error retrieving reviews');
                    }
                })
                .catch(error => {
                   console.log('Error retrieving reviews');
                });

        });



    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

const app = express();

/* Setting up the backend */
setGlobalDispatcher(new Agent({ connect: { timeout: 60_000 } }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors());



app.listen(5000, () => console.log('Server is Up!'));

main(app).catch(console.error);
