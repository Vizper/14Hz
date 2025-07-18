const fetch = require("node-fetch");

const LASTFM_API_KEY = "dde7b0ddef68c3c0bf0455ca0450b40a";
const USERNAME = "Haze-path";

async function getTopTracks() {
  const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=5`);
  const data = await res.json();

  const tracks = data.recenttracks.track;
  console.log("Top 5 Last Played:");
  tracks.forEach((track, index) => {
    console.log(`${index + 1}. ${track.artist['#text']} - ${track.name}`);
  });
}

getTopTracks();
