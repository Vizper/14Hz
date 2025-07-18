const fetch = require("node-fetch");
const fs = require("fs");

const LASTFM_API_KEY = "dde7b0ddef68c3c0bf0455ca0450b40a";
const LASTFM_USERNAME = "Haze-path";
const TRACK_LIMIT = 5;

async function getRecentTracks() {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=${TRACK_LIMIT}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.recenttracks.track.map((track, index) => {
        const artist = track.artist["#text"];
        const title = track.name;
        return `${index + 1}. ${artist} - ${title}`;
    });
}

async function updateReadme(tracks) {
    const content = `### 🎧 Last Played Tracks\n\n${tracks.join("\n")}\n`;
    const readme = fs.readFileSync("README.md", "utf8");
    const updated = readme.replace(
        /### 🎧 Last Played Tracks\n\n([\s\S]*?)(?=\n###|$)/,
        content
    );
    fs.writeFileSync("README.md", updated);
    console.log("README.md updated!");
}

getRecentTracks()
    .then((tracks) => {
        console.log("Fetched tracks:", tracks);
        updateReadme(tracks);
    })
    .catch((err) => console.error("Error fetching tracks:", err));
