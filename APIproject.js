const APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const form = document.getElementById("form");
const search = document.getElementById("search");
const startVoteAverageInput = document.getElementById("startVoteAverage");
const endVoteAverageInput = document.getElementById("endVoteAverage");
const main = document.getElementById("main");
const exactMatchCheckbox = document.getElementById("exactMatch");
const startYear = document.getElementById("startYear");
const endYear = document.getElementById("endYear");


async function getMovies(url) {
  const resp = await fetch(url);
  const respData = await resp.json();
  showMovies(respData.results);
}


function showMovies(movies) {
  main.innerHTML = "";
  movies.forEach((movie, index) => {
    if (index % 2 === 0) {
      const row = document.createElement("div");
      row.classList.add("row");
      main.appendChild(row);
    }
    const { title, poster_path, vote_average, overview, release_date } = movie;
    const startVoteAverage = parseFloat(startVoteAverageInput.value) || 0;
    const endVoteAverage = parseFloat(endVoteAverageInput.value) || 10;
    const startYearValue = parseInt(startYear.value) || 0;
    const endYearValue = parseInt(endYear.value) || new Date().getFullYear();
    const searchValue = search.value.toLowerCase();
    const isChecked = exactMatchCheckbox.checked;
    const year = parseInt(release_date.split("-")[0]);

    if ((vote_average >= startVoteAverage && vote_average <= endVoteAverage && year >= startYearValue && year <= endYearValue)) {
      if ((isChecked && title.toLowerCase() === searchValue) || (!isChecked && title.toLowerCase().includes(searchValue))) {
        const row = main.lastChild;
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie");
        movieElement.innerHTML = `
          <div class="movie-info">
            <img src="${IMGPATH + poster_path}" alt="${title}">
            <div class="moviediv">
              <h3>${title}</h3>
              <p>${year}</p>
              <div class="green">Rating: ${vote_average}</div>
              <p class="overview">${overview}</p>
              <span class="show-more"></span>
              <span class="show-less" style="display: none;"></span>
            </div>
          </div>`;
        row.appendChild(movieElement);
      }
    }
  });


  document.querySelectorAll(".movie-info").forEach((movie) => {
    const overview = movie.querySelector(".overview");
    const showMoreText = movie.querySelector(".show-more");
    const showLessText = movie.querySelector(".show-less");

    showMoreText.addEventListener("click", () => {
      overview.classList.add("expanded");
      overview.style.display = "block";
      overview.style.webkitLineClamp = "unset";
      overview.style.overflow = "visible";
      showMoreText.style.display = "none";
      showLessText.style.display = "inline";
    });

    showLessText.addEventListener("click", () => {
      overview.classList.add("expanded");
      overview.style.display = "-webkit-box";
      overview.style.webkitLineClamp = 3;
      overview.style.overflow = "hidden";
      showMoreText.style.display = "inline";
      showLessText.style.display = "none";
    });

    if (overview.scrollHeight > overview.clientHeight) {
      showMoreText.style.display = "inline";
    }
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (search.value) {
    getMovies(SEARCHAPI + search.value);
  } else {
    getMovies(APIURL);
  }
});
getMovies(APIURL);