

var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var command = process.argv[2];
var item = process.argv.slice(3);

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

switch (command) {
    case "my-tweets":
        twitter(item);
        break;

    case "spotify-this-song":
        spotifySearch(item);
        break;

    case "movie-this":
        omdbMovie(item);
        break;

    case "do-what-it-says":
        justDoIt(item);
        break;
}

function twitter(item) {
    console.log(item);
    var params = { screen_name: item, count: 20 };
    
    client.get("statuses/user_timeline", params, function (err, tweets, response) {
        if (err) {
            console.log(err);
        } else {
            for (i = 0; i < tweets.length; i++) {
                console.log("Tweet: " + tweets[i].text + "\nCreated At:" + tweets[i].created_at);
            }
        }
    })
}

function spotifySearch(item) {
    console.log("called", item);

    spotify.search({ type: "track", query: item }, function (err, data) {
        if (err) {
            return console.log("An error occurred" + err);
        } else {
            console.log(data);
        }
    })

}

function omdbMovie(item) {
    var queryURL = "http://www.omdbapi.com/?t=" + item + "&apikey=f738c64f"

    request(queryURL, function (err, response, body) {
        if (!item) {
            input = "Mr. Nobody";
        } else if (err) {
            console.log("An error occured" + err)
        } if (!err && response.statusCode === 200) {
            console.log(JSON.parse(body));
            console.log(response);
        }
    })
}

function justDoIt(item) {

    fs.readFile("random.txt", "utf8", function (err, data) {
        var dataArr = data.split(",");
        var item = dataArr[1].slice(1, -1);
        console.log(dataArr);
        console.log(item);

        if (dataArr[0] === "my-tweets") {
            twitter(item)

        } else if (dataArr[0] === "spotify-this-song") {
            spotify(item);

        } else if (dataArr[0] === "movie-this") {
            omdbMovie(item);

        }

        if (err) {
            return console.log(err)
        }
        console.log(data);
    })
}