# Campus Bops

##  Introduction

Campus Bops is an online platform for college students to discover what songs are going viral around campus. Each school has a tier list of songs based on categories such as "Pregame Anthem", "After A Bad Breakup", and "Guilty Pleasure". By creating an account, students can search songs, using Spotify's API, and cast their votes on what songs should belong in each category. Each week, the songs in each category are placed in a NCAA tournament-style bracket. At the end of each day, the songs with the most votes moves onto the next round until one song remains and is crowned most worthy of its respective category. Its a fun and interactive place for students to discover new music and see if their chosen song can attain the top ranks of college campus hits.   

##  Wireframe and ERD's
<img width="625" alt="wireframe" src="/public/img/campus-bops-wireframe.png">
<img width="625" alt="erd" src="/public/img/campus-bops-erd.png">

##  RESTful Routes

| Method | Path | Location | Purpose |
| ------ | ---------------- | -------------- | ------------------- |
| GET | / | server.js | Homepage |
| GET | /profile | server.js | User profile |
| GET | /auth/login | auth.js | Login form |
| GET | /auth/signup | auth.js | Signup form |
| POST | /auth/login | auth.js | Login user |
| POST | /auth/signup | auth.js | Creates User |
| GET | /auth/logout | auth.js | Removes session info |
| GET | /categories | category.js | View All Categories |
| GET | /categories/new | category.js | Create Category |
| GET | /categories/edit/:id | category.js | Edit Category |
| GET | /categories/:id | category.js | View Category by id |
| POST | /categories | category.js | Create Category |
| PUT | /categories/:id | category.js | Edit Category by id |
| DELETE | /categories/:id | category.js | Delete Category by id |
| GET | /schools | school.js | View All Schools |
| GET | /schools/new | school.js | Add School |
| GET | /schools/edit/:abbv | school.js | Edit School by abbreviation |
| GET | /schools/:abbv | school.js | View School by abbreviation |
| POST | /schools/ | school.js | Add School |
| PUT | /schools/:id | school.js | Edit School by id |
| DELETE | /:id | school.js | Remove School |
| GET | /songs/search | school.js | Search Song using Spotify API |
| GET | /songs/new | school.js | Add Song |
| GET | /songs/edit/:id | school.js | Edit Song info by id |
| GET | /songs/:id | school.js | View Song by id |
| POST | /songs/new | school.js | Add Song |
| PUT | /songs/:id | school.js | Edit Song by id |
| DELETE | /songs/:id | school.js | Remove Song |


##  Code Snippets
RESTful routes are conducted using separate controllers for each model (User, School, Category, Song). A typical route use Promises (`then()`...`catch()`) to handle Javascript errors. Each controller has an associated Views template to render the data. 

###  1. Calling Spotify API
To make an API call to Spotify, a Spotify Developers account must be created to obtain authorization. Once created, a unique 'CLIENT_ID' and 'CLIENT_SECRET' is given to retrieve a token from the API.   

```js
const axios = require('axios');
const querystring = require('querystring');
let buff = new Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);
let authKey = buff.toString('base64');
let headers = {
    Authorization: `Basic ${authKey}`
}
```
The GET route requests the token using the 'CLIENT_ID' and 'CLIENT_SECRET'. Once authorized, the token value is retrieved using the Axios node module. To search for a song, another GET route is executed to the address ```https://api.spotify.com/v1/search?q=${track}&type=track&offset=0&limit=5```. The ```${track}``` in the address is the song title searched by the user in the ```search.ejs``` file. The response data is an array of song data objects that is then copied into a new array of objects in order to render the information, such as the song title, artist, and songId, back to the  `search.ejs`.  
```js
// SEARCH BY SONG
router.get('/', function (req, res) {
    // Make a AXIOS call (POST) to submit CLIENT_ID and CLIENT_SECRET
    axios.post('https://accounts.spotify.com/api/token',
        querystring.stringify({ grant_type: 'client_credentials' }),
        {
            headers: headers
        })
        .then(function (response) {
            token = response.data.access_token
            console.log('TOKEN', token);
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

            // Define song variable using value from song search bar
            let track = req.query.song; 

            // Make another axios (GET) to retrieve song data 
            axios.get(`https://api.spotify.com/v1/search?q=${track}&type=track&offset=0&limit=5`, config)
                .then(response => {
                    let items = response.data.tracks.items; // Array of songs data
                    let songArray = []; // Array of obj containing songs data

                    // Encapsulate each song data into an object and push into songArray
                    for (const item of items) {
                        let song = {};
                        const songTitle = item.name;
                        const artists = item.artists.map(artist => artist.name);    // Map artist array to obtain all artists in song 
                        const albumName = item.album.name;
                        const songPlayerId = item.id;   // For embedded player
                        song.title = songTitle;
                        song.artist = artists;
                        song.album = albumName;
                        song.songPlayerId = songPlayerId;
                        songArray.push(song);
                    }
                    // Render songs into search.ejs file
                    res.render('search', { songs: songArray });
                })
                .catch(err => {
                    console.log('ERROR', err);
                });

        })
        .catch(function (err) {
            console.log("ERROR", err.message)
        })
});
```

###  2. Adding Songs from Spotify to Category
The `search.ejs` template below is for the user to search a song, show the first 5 results, and enable them to add to their category. An embedded player is included so the user can preview each song as well. When a user clicks "Add to Category", a POST request is made and sends the song data to the Category controller.    

```html
<div>
    <!-- Search Bar -->
    <form action="/search" method="GET">
        <label for="song">Song</label>
        <input id="song" type="text" name="song" required>

        <input type="submit" value="Search by Song">
    </form>

    <!-- List song results from Spotify   -->
    <% for (let i in songs) { %>
        <form method="POST" action="/songs/new">
            <h1>SONG:
                <%= songs[i].title; %>
            </h1>
            <h2>ARTIST:
                <%= songs[i].artist; %>
            </h2>
            <h3>ALBUM:
                <%= songs[i].album; %>
            </h3>
            <h4>MINI PLAYER:
                <iframe src="https://open.spotify.com/embed/track/<%= songs[i].songPlayerId.replace(/[" ]+/g, '' ) %>"
                    width="300"
                    height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
            </h4>

            <!-- ** Sends song info to ROUTES as hidden ** -->
            <input type="text" name="title" value="<%= songs[i].title %>" hidden />
            <input type="text" name="artist" value="<%= songs[i].artist %>" hidden />
            <input type="text" name="album" value="<%= songs[i].album %>" hidden />
            <input type="text" name="songPlayerId" value="<%= songs[i].songPlayerId %>" hidden />
            <input type="submit" value="Add To Category">
        </form>
        <% } %>
</div>
```
