import fetch from "node-fetch";
import fs from "fs";

const LASTFM_API_KEY = "c4e901f90da2a12ebb8b6d5cfa313b1f";
const LASTFM_USERNAME = "Haze-path";
const TRACK_LIMIT = 5;

async function getRecentTracks() {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=${TRACK_LIMIT}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.recenttracks || !data.recenttracks.track) {
        throw new Error("Failed to fetch recent tracks from Last.fm");
    }

    return data.recenttracks.track.map((track, index) => {
        const artist = track.artist["#text"];
        const title = track.name;
        return `${index + 1}. ${artist} - ${title}`;
    });
}

async function updateReadme(tracks) {
    const filePath = "README.md";
    const readme = fs.readFileSync(filePath, "utf8");

    const start = "<!-- LASTFM:START -->";
    const end = "<!-- LASTFM:END -->";
    const regex = new RegExp(`${start}[\\s\\S]*?${end}`, "g");

    const newContent = `${start}\n${tracks.join("\n")}\n${end}`;
    const updated = readme.replace(regex, newContent);

    fs.writeFileSync(filePath, updated, "utf8");
    console.log("README.md updated!");
}

getRecentTracks()
    .then(updateReadme)
    .catch((err) => console.error("Error:", err));
