// Ask for API key on first load
const API_KEY = prompt("Enter your YouTube API key:"); 
const CHANNEL_ID = "UCcYrdFJF7i1gO1j24r5LGVA"; // PrestonPlayz channel ID
let nextPageToken = "";

// DOM elements
const videosContainer = document.getElementById("videos");
const searchInput = document.getElementById("search");
const modal = document.getElementById("playerModal");
const ytPlayer = document.getElementById("ytPlayer");
const closeBtn = document.getElementById("closeBtn");

// Fetch videos from YouTube API
async function fetchVideos(query = "") {
  let url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&type=video&maxResults=8&pageToken=${nextPageToken}`;
  if (query) {
    url += `&q=${encodeURIComponent(query)}`;
  }

  const res = await fetch(url);
  const data = await res.json();
  nextPageToken = data.nextPageToken || "";

  data.items.forEach(video => {
    const vidId = video.id.videoId;
    const title = video.snippet.title;
    const thumb = video.snippet.thumbnails.medium.url;

    const div = document.createElement("div");
    div.className = "video";
    div.innerHTML = `
      <img src="${thumb}" alt="${title}" />
      <h3>${title}</h3>
    `;
    div.onclick = () => openPlayer(vidId);
    videosContainer.appendChild(div);
  });
}

// Open modal with YouTube embed
function openPlayer(id) {
  ytPlayer.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
  modal.style.display = "block";
}

// Close modal
closeBtn.onclick = () => {
  modal.style.display = "none";
  ytPlayer.src = "";
};

// Search handler
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    videosContainer.innerHTML = "";
    nextPageToken = "";
    fetchVideos(searchInput.value);
  }
});

// Infinite scroll
window.onscroll = () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    fetchVideos(searchInput.value);
  }
};

// Initial load
fetchVideos();
