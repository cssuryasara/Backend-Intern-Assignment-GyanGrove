const express = require("express");
const mongoose = require("mongoose");
const csvtojson = require("csvtojson");
const axios = require("axios");
require('dotenv').config()

const csvFilePath = "./dataset.csv";
const mongoUri = "mongodb://localhost:27017/assignment";
const mongooseSchemaName = "events";

const eventSchema = new mongoose.Schema({
    event_name: String,
    city_name: String,
    date: Date,
    time: String,
    latitude: Number,
    longitude: Number,
});

mongoose
    .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

async function importCSVToMongo() {
    const Event = mongoose.model(mongooseSchemaName, eventSchema);
    const jsonData = await csvtojson({ delimiter: "," }).fromFile(csvFilePath);
    const insertResult = await Event.insertMany(jsonData);
    console.log(`Successfully inserted ${insertResult.insertedCount} documents.`);
}

async function processEvent(event, lat, lon) {
    const city = event.city_name;
    const eventLatitude = event.latitude;
    // const eventLongitude = null;
    const eventLongitude = event.longitude;
    const eventName = event.event_name;
    const date = event.date;
    const URLdate = date.toISOString().substring(0, 10);

    const weatherURL = `https://gg-backend-assignment.azurewebsites.net/api/Weather`;
    const distanceURL = `https://gg-backend-assignment.azurewebsites.net/api/Distance`;

    const apiCalls = [
        {
            url: weatherURL,
            params: {
                code: process.env.weathercode,
                city: city,
                date: date
            }
        },
        {
            url: distanceURL,
            params: {
                code: process.env.distancecode,
                latitude1: lat,
                longitude1: lon,
                latitude2: eventLatitude,
                longitude2: eventLongitude
            }
        }];

    const promises = apiCalls.map(async (apiObj) => {
        try {
            const response = await axios.get(apiObj.url, { params: apiObj.params });
            if (response.status !== 200) {
                throw new Error(
                    `API call to ${url} failed with status ${response.status}`
                );
            }
            return response.data;
        } catch (error) {
            console.warn(`Skipping failed API call to ${apiObj.url}:`, error);
            return null;
        }
    });

    const results = await Promise.all(promises);
    const result = results.reduce((acc, item) => {
        return { ...acc, ...item };
    }, {});

    const combEvent = {
        event_name: eventName,
        city_name: city,
        date: URLdate,
        weather: result?.weather ?? "No weather data available",
        distance_km: result?.distance ?? "No data available",
    };
    return combEvent;
}

async function getCombinedData(lat, lon, date) {
    const Event = mongoose.model(mongooseSchemaName, eventSchema);
    const filter = getFilter(date);
    const data = await Event.find(filter).sort(sort);
    const processedData = await Promise.all(
        data.map((event) => processEvent(event, lat, lon))
    );
    return processedData;
}

function getPaginatedEvents(eventsData, pageNumber, pageSize) {
    const totalPages = Math.ceil(eventsData.length / pageSize);
    pageNumber = Math.min(Math.max(1, pageNumber), totalPages);
    const startIndex = (pageNumber - 1) * pageSize;
    const paginatedEvents = eventsData.slice(startIndex, startIndex + pageSize);
    return {
        events: paginatedEvents,
        page: pageNumber,
        pageSize,
        totalEvents: eventsData.length,
        totalPages,
    };
}

const getFilter = (date) => {
    const currDate = new Date(date);
    const NoOfDays = 15;
    const newDate = new Date(currDate.getTime() + NoOfDays * 24 * 60 * 60 * 1000);
    return {
        date: {
            $gte: currDate,
            $lt: newDate,
        },
    };
};

const sort = {
    date: 1,
    time: 1,
};
const app = express();

app.get("/add", async (req, res) => {
    await importCSVToMongo();
    res.status(200).send("Success");
});

app.get("/events/find", async (req, res) => {
    const userLatitude = req.query.userLatitude;
    const userLongitude = req.query.userLongitude;
    const searchDate = req.query.searchDate;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    getCombinedData(userLatitude, userLongitude, searchDate)
        .then((data) => {
            res.status(200).send(getPaginatedEvents(data, page, pageSize));
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error Retriving Events");
        });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
