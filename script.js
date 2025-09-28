// ================= CONFIG =================
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w780";

let content = document.getElementById("content");
let myList = JSON.parse(localStorage.getItem("myList")) || [];
let downloads = JSON.parse(localStorage.getItem("downloads")) || [];
let bannerMovie = null;

// ============== Fetch & Render Movies ==============
async function fetchMovies(endpoint, title) {
    // Create section once with skeletons
    const section = document.createElement("section");
    section.className = "row";
    section.innerHTML = `<h2>${title}</h2><div class="row-posters"></div>`;
    const rowDiv = section.querySelector(".row-posters");
    for (let i = 0; i < 6; i++) { rowDiv.innerHTML += `<div class="skeleton skeleton-card"></div>`; }
    content.appendChild(section);

    try {
        const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=en-US&page=1&include_adult=false`);
        const data = await res.json();
        rowDiv.innerHTML = "";
        appendMoviesToRow(rowDiv, data.results || []);
    } catch (err) {
        console.error("Error fetching", title, err);
        rowDiv.innerHTML = "<p style='padding:10px;color:gray'>No results</p>";
    }
}

// ============== Append Cards ==============
function appendMoviesToRow(rowDiv, movies) {
    movies.forEach(m => {
        let img = m.backdrop_path ? IMG_URL + m.backdrop_path
            : (m.poster_path ? IMG_URL + m.poster_path : null);
        if (!img) return;
        const name = m.title || m.name || "Untitled";

        const inList = myList.some(x => x.id === m.id);
        const inDownloads = downloads.some(x => x.id === m.id);

        const card = document.createElement("div");
        card.className = "poster-card";
        card.innerHTML = `
      <img src="${img}" alt="${name}">
      <div class="hover-detail icons">
        <i class="fas fa-plus action-add ${inList ? 'active' : ''}"></i>
        <i class="fas fa-circle-info action-info"></i>
        <i class="fas fa-download action-download ${inDownloads ? 'active' : ''}"></i>
      </div>
      <p class="poster-title">${name}</p>`;

        // ✅ Clicking whole card opens modal
        card.onclick = () => openModal(m);

        // ✅ Stop propagation for icons so they don’t also trigger modal
        card.querySelector(".action-add").onclick = (e) => {
            e.stopPropagation();
            toggleMyList(m, card);
        };
        card.querySelector(".action-download").onclick = (e) => {
            e.stopPropagation();
            toggleDownload(m, card);
        };
        // Info button also works, but redundant as clicking poster already opens modal
        card.querySelector(".action-info").onclick = (e) => {
            e.stopPropagation();
            openModal(m);
        };

        rowDiv.appendChild(card);
    });
}

// ============== Banner ==============
async function loadBanner() {
    try {
        const res = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US&page=1`);
        const data = await res.json();
        bannerMovie = data.results[Math.floor(Math.random() * data.results.length)];
        const backdrop = bannerMovie.backdrop_path ? IMG_URL + bannerMovie.backdrop_path : (bannerMovie.poster_path ? IMG_URL + bannerMovie.poster_path : null);

        const bannerEl = document.getElementById("banner");
        if (backdrop) bannerEl.style.backgroundImage = `url(${backdrop})`;
        document.getElementById("banner-title").innerText = bannerMovie.title || bannerMovie.name;
        document.getElementById("banner-desc").innerText = bannerMovie.overview || "";

        // After 5s delay: show trailer if available
        setTimeout(async () => {
            try {
                const trailerRes = await fetch(`${BASE_URL}/${bannerMovie.media_type || "movie"}/${bannerMovie.id}/videos?api_key=${API_KEY}`);
                const vids = await trailerRes.json();
                const trailer = vids.results.find(v => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"));
                if (trailer) {
                    bannerEl.style.backgroundImage = "none";
                    const iframe = document.createElement("iframe");
                    iframe.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&loop=1&controls=0&playlist=${trailer.key}`;
                    iframe.width = "100%"; iframe.height = "100%";
                    iframe.style.position = "absolute"; iframe.style.top = 0; iframe.style.left = 0; iframe.style.zIndex = -1;
                    iframe.allow = "autoplay";
                    bannerEl.appendChild(iframe);
                }
            } catch (err2) { console.error("Banner trailer error", err2); }
        }, 5000);
    } catch (err) { console.error("Banner error", err); }
}

// ============== Modal ==============
async function openModal(movie) {
    document.getElementById("modal").classList.remove("hidden");
    document.getElementById("modal-title").innerText = movie.title || movie.name;
    document.getElementById("modal-desc").innerText = movie.overview || "";
    const trailerDiv = document.getElementById("modal-trailer");
    trailerDiv.innerHTML = "Loading trailer...";

    try {
        const res = await fetch(`${BASE_URL}/${movie.media_type || "movie"}/${movie.id}/videos?api_key=${API_KEY}`);
        const data = await res.json();
        const video = data.results.find(v => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"));
        if (video) {
            trailerDiv.innerHTML = `<iframe width="100%" height="300"
        src="https://www.youtube.com/embed/${video.key}?autoplay=1&mute=0&controls=1"
        allow="autoplay; fullscreen"></iframe>`;
        } else {
            let img = movie.backdrop_path ? IMG_URL + movie.backdrop_path : (movie.poster_path ? IMG_URL + movie.poster_path : null);
            trailerDiv.innerHTML = img ? `<img src="${img}" style="width:100%">` : "No preview available";
        }
    } catch (err) {
        console.error("Modal trailer error", err);
        trailerDiv.innerText = "Trailer not available";
    }
}
document.getElementById("modal-close").onclick = () => {
    document.getElementById("modal").classList.add("hidden");
    document.getElementById("modal-trailer").innerHTML = "";
};

// ============== My List ==============
function toggleMyList(movie, card) {
    const exists = myList.find(x => x.id === movie.id);
    if (exists) myList = myList.filter(x => x.id !== movie.id);
    else myList.push(movie);
    localStorage.setItem("myList", JSON.stringify(myList));
    if (card) card.querySelector(".action-add").classList.toggle("active");
}
function renderMyList() {
    if (myList.length === 0) { content.innerHTML = "<h2>My List</h2><p>No movies saved.</p>"; return; }
    const section = document.createElement("section");
    section.className = "row";
    section.innerHTML = `<h2>My List</h2><div class="row-posters"></div>`;
    const rowDiv = section.querySelector(".row-posters");
    appendMoviesToRow(rowDiv, myList);
    content.innerHTML = ""; content.appendChild(section);
}

// ============== Downloads ==============
function toggleDownload(movie, card) {
    const exists = downloads.find(x => x.id === movie.id);
    if (exists) downloads = downloads.filter(x => x.id !== movie.id);
    else downloads.push(movie);
    localStorage.setItem("downloads", JSON.stringify(downloads));
    if (card) card.querySelector(".action-download").classList.toggle("active");
}
function renderDownloads() {
    if (downloads.length === 0) { content.innerHTML = "<h2>My Downloads</h2><p>No downloads yet.</p>"; return; }
    const section = document.createElement("section");
    section.className = "row";
    section.innerHTML = `<h2>My Downloads</h2><div class="row-posters"></div>`;
    const rowDiv = section.querySelector(".row-posters");
    appendMoviesToRow(rowDiv, downloads);
    content.innerHTML = ""; content.appendChild(section);
}

// ============== Search ==============
const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("keyup", async e => {
        if (e.key === "Enter") {
            const term = searchInput.value.trim();
            if (term.length < 2) return;
            content.innerHTML = `<h2>Results for "${term}"</h2><div class="row-posters" id="search-results"></div>`;
            try {
                const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(term)}&page=1&include_adult=false`);
                const data = await res.json();
                const resultsRow = document.getElementById("search-results");
                resultsRow.innerHTML = "";
                appendMoviesToRow(resultsRow, data.results || []);
            } catch (err) {
                console.error("Search error", err);
                content.innerHTML = "<p>Error searching.</p>";
            }
        }
    });
}

// ============== Section Loader ==============
async function loadSection(section) {
    content.innerHTML = "";
    if (section === "Home") {
        fetchMovies("/trending/movie/week", "Trending Now");
        fetchMovies("/movie/top_rated", "Top Rated");
        fetchMovies("/discover/movie?with_genres=28", "Action");
        fetchMovies("/discover/movie?with_genres=35", "Comedy");
    }
    else if (section === "TV") {
        fetchMovies("/discover/tv?sort_by=popularity.desc", "Popular TV Shows");
        fetchMovies("/tv/top_rated", "Top Rated TV");
    }
    else if (section === "Movies") {
        fetchMovies("/discover/movie?sort_by=popularity.desc", "Popular Movies");
        fetchMovies("/movie/upcoming", "Upcoming Movies");
    }
    else if (section === "New") {
        fetchMovies("/movie/now_playing", "Now Playing");
        fetchMovies("/movie/upcoming", "Coming Soon");
    }
    else if (section === "MyList") {
        renderMyList();
    }
    else if (section === "Downloads") {
        renderDownloads();
    }
}
document.querySelectorAll("nav a").forEach(link => {
    link.onclick = (e) => { e.preventDefault(); loadSection(link.dataset.section); };
});

// INIT
loadSection("Home");
loadBanner();