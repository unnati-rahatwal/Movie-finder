const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const moviesContainer = document.getElementById("movies-container");
const resultHeading = document.getElementById("result-heading");
const errorContainer = document.getElementById("error-container");
const movieDetails = document.getElementById("movie-details");
const movieDetailsContent = document.querySelector(".movie-details-content");
const backBtn = document.getElementById("back-btn");

const BASE_URL = "https://api.tvmaze.com/search/shows?q=";
const SHOW_URL = "https://api.tvmaze.com/shows/";
const searchURL = (query) => `${BASE_URL}${query}`;


searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetch(searchURL(query))
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          resultHeading.textContent = `Search Results for "${query}"`;
          errorContainer.classList.add("hidden");
          moviesContainer.innerHTML = data
            .map(
              (item) => `
              <div class="movie">
                <img src="${item.show.image ? item.show.image.medium : "https://via.placeholder.com/210x295"}" alt="${item.show.name}" />
                <h3>${item.show.name}</h3>
                <button class="details-btn" data-id="${item.show.id}">View Details</button>
              </div>
            `
            )
            .join("");

          document.querySelectorAll(".details-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
              const showId = e.target.dataset.id;
              fetchShowDetails(showId);
            });
          });
        } else {
          resultHeading.textContent = `No Results Found for "${query}"`;
          errorContainer.classList.remove("hidden");
          moviesContainer.innerHTML = "";
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        errorContainer.classList.remove("hidden");
      });
  }
});


function fetchShowDetails(id) {
  fetch(`${SHOW_URL}${id}`)
    .then((response) => response.json())
    .then((show) => {
      displayShowDetails(show);
    })
    .catch((error) => {
      console.error("Error fetching details:", error);
    });
}

function displayShowDetails(show) {
  moviesContainer.classList.add("hidden");
  resultHeading.classList.add("hidden");

  movieDetails.classList.remove("hidden");
  movieDetailsContent.innerHTML = `
    <h2>${show.name}</h2>
    <img src="${show.image ? show.image.medium : "https://via.placeholder.com/210x295"}" alt="${show.name}" />
    <p><strong>Language:</strong> ${show.language || "N/A"}</p>
    <p><strong>Genres:</strong> ${show.genres.length ? show.genres.join(", ") : "N/A"}</p>
    <p><strong>Premiered:</strong> ${show.premiered || "N/A"}</p>
    <p><strong>Rating:</strong>⭐️${show.rating.average || "N/A"}</p>
    <p><strong>Summary:</strong> ${show.summary || "No description available."}</p>
    <a href="${show.officialSite || "#"}" target="_blank">Visit Official Site</a>
  `;
}

backBtn.addEventListener("click",() => {
  movieDetails.classList.add("hidden");
  moviesContainer.classList.remove("hidden");
  resultHeading.classList.remove("hidden");
});


