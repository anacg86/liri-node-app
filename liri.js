//read and set any environment variables with the dotenv package
require("dotenv").config();
//fs is a core Node package for reading and writing files
var fs = require("fs");
//incorporate axios npm package 
var axios = require("axios");

//define moment
var moment = require('moment');

//import info from keys.js
var keys = require("./assets/scripts/keys");
//import spotify api
var Spotify = require('node-spotify-api');
//initialize spotify
var spotify = new Spotify(keys.spotify);

//concert-this or spotify-this-song or movie-this or do-what-says
var command = process.argv[2];


function allcommands() {
   switch (command) {
      case "concert-this":
         let band = process.argv[3];
         concertThis(band);
         break;
      
      //to check the track 
      case "spotify-this-song":
         //user places the name of the song after the command
         let songName = process.argv[3];
         //if no song is provided then your program will default to "The Sign" by Ace of Base. 
         if (!songName) {
            spotify.request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE').then(function (song) {
               console.log(`ARTIST(S): ${song.artists[0].name}`);
               console.log(`SONG: ${song.name}`);
               console.log(`PREVIEW LINK: ${song.preview_url}`);
               console.log(`ALBUM: ${song.album.name}` + "\n");
            }).catch(function (err) {
               console.error('Error occurred: ' + err);
            });
         } else {
            spotifyThis(songName);
         }
         break;
     
      case "movie-this":
         let movie = process.argv[3];
         if (!movie)
            movie = "Mr Nobody";
         movieThis(movie);
         break;

      case "do-what-it-says":
         /* Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
      
         * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
      
         * Edit the text in random.txt to test out the feature for movie-this and concert-this.*/
         fs.readFile("random.txt", "utf8", function (error, data) {
            if (error) {
               return console.log(error);
            }

            var dataArr = data.split(",");
            var operator = dataArr[0];
            var parameter = dataArr[1];
            switch (operator) {
               case "spotify-this-song":
                  spotifyThis(parameter);
                  break;
               case "movie-this":
                  movieThis(parameter);
                  break;
            }
         });
         break;
   }
}
allcommands()

function spotifyThis(songName) {
   spotify.search({ type: 'track', query: songName },
      function (err, data) {
         if (err) {
            return console.log('Error occurred: ' + err);
         }
         //looks for the track inside the items and for each one, check album, song's name, url, and artist.
         data.tracks.items.forEach((song) => {
            console.log(`ARTIST(S): ${song.artists[0].name}`);
            console.log(`SONG: ${song.name}`);
            console.log(`PREVIEW LINK: ${song.preview_url}`);
            console.log(`ALBUM: ${song.album.name}` + "\n");
         })
         //to check how the tracks appear
         /*console.log(data.tracks.items);*/
      });
}

function movieThis(movieName) {
   axios.get('http://www.omdbapi.com/?apikey=trilogy&t=' + movieName).then(
      function (response) {
         console.log(`Title:  ${response.data.Title}`);
         console.log(`Year:  ${response.data.Year}`);
         console.log(`IMDB Rating:  ${response.data.imdbRating}`);
         console.log(`Rotten Tomatoes Rating:  ${response.data.Ratings[1].Value}`);
         console.log(`Country where it was produced:  ${response.data.Country}`);
         console.log(`Language:  ${response.data.Language}`);
         console.log(`Plot:  ${response.data.Plot}`);
         console.log(`Actors:  ${response.data.Actors}`);
      });
}

function concertThis(band) {
   axios.get("https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp").then(
            function (bands) {
               console.log(`Name of the venue:  ${bands.data[0].venue.name}`);
               console.log(`Venue location:  ${bands.data[0].venue.city}  ${bands.data[0].venue.country}`);
               //moment(response.datetime).format("MM/DD/YYYY"))
               console.log(`Date of the event: ${moment(bands.data[0].venue.datetime).format("MM/DD/YYYY")}`)
            }
         );
}