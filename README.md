# 🎬 Netflix Clone (HTML, CSS & JavaScript)
A sleek **Netflix UI clone** built with pure **HTML, CSS, and JavaScript**, powered by the **TMDB (The Movie Database) API** for live movie/TV data.
This project mimics Netflix’s interface with dynamic content, user interactions, and polished styling — a great showcase of front‑end development skills.
<br>

## ✨ Features
- **Dynamic Banner:** Displays a trending/random movie or TV show from TMDB, complete with backdrop image and optional trailers.
- **Movie & TV Sections:** Fetches live data for trending movies, top rated, genre‑based titles, and more, displayed in scrollable rows.
- **Skeleton Loading:** Attractive shimmering placeholders displayed while data loads.
- **Modal Popups:** Click on a movie card to see details, description, and trailer/preview inside a modal.
- **Search Functionality:** Search for movies, TV shows, or actors directly using TMDB’s search API.
- **My List & Downloads:** Bookmark items with “Add to My List” and “Download” buttons — stored persistently using `localStorage`.
- **Responsive Design:** Works seamlessly across desktop and mobile layouts.
- **Authentic Styling:** Hover animations, gradient banners, scroll controls, Netflix fonts/colors, and font‑awesome icons.


## 🛠️ Tech Stack
- **HTML5**
- **CSS3** (Flexbox, Grid, Animations, Responsive Design)
- **Vanilla JavaScript (ES6+)**
  - `fetch()` API for network requests
  - DOM manipulation and event listeners
  - `localStorage` for saving My List / Downloads
- TMDB API for live dynamic movie & TV data

## ⚙️ Setup & Installation
### 1. Clone the repository
```
git clone https://github.com/AaravGupta-Coder/Netflixify.git
cd Netflixify
```
### 2.  Run the project
Simply open `index.html` in your browser — no server needed!
(If you host this repo with GitHub Pages, you’ll just need to add your config.js locally for it to work.)

## 🚀 Deployment
- Static hosting works fine (e.g., GitHub Pages, Netlify, Vercel).
- Remember: `config.js` is ignored in git. Each user must create their own `config.js` with their TMDB key.

## 📚 Learning Goals
This project is great practice for:
- Working with 3rd‑party REST APIs (`fetch` / async/await)
- DOM manipulation and dynamic HTML generation
- State persistence with localStorage
- Responsive UI layout and polish
- Clean project structuring for GitHub

## 🙌 Acknowledgements
- [TMDB API](https://www.themoviedb.org/documentation/api) for movie and TV data
- [Font Awesome](https://fontawesome.com/) for icons
- Netflix UI as design inspiration

## 👩‍💻 Author
- Aarav Gupta — Frontend Developer & Netflix‑style binge‑coder 🍿
- GitHub: [@AaravGupta-Coder](https://github.com/AaravGupta-Coder/)
