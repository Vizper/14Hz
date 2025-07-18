import fetch from "node-fetch";
import fs from "fs/promises"; // pakai promise-based fs

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
    const readme = await fs.readFile("README.md", "utf8");
    const updated = readme.replace(
        /### 🎧 Last Played Tracks\n\n([\s\S]*?)\n(?=###|$)/,
        content
    );
    await fs.writeFile("README.md", updated);
}

getRecentTracks()
    .then(updateReadme)
    .catch(console.error);
