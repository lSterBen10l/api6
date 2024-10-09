const apiKey = 'c8f3e616'; // Sett inn din egen API-nøkkel her

// Funksjon for å hente filminformasjon basert på søkeord
function getMovieInfo(title) {
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Film ikke funnet.");
            }
            return response.json();
        })
        .then(data => {
            displayMovieInfo(data);
            getRecommendedMovies(data.Genre);
        })
        .catch(error => {
            console.error("Feil: ", error);
            alert("Noe gikk galt. Vennligst prøv igjen.");
        });
}

// Funksjon for å vise filminformasjon
function displayMovieInfo(data) {
    if (data.Response === "True") {
        document.getElementById('movie-title').textContent = data.Title;
        document.getElementById('movie-poster').src = data.Poster !== "N/A" ? data.Poster : '';
        document.getElementById('movie-year').textContent = data.Year;
        document.getElementById('movie-director').textContent = data.Director;
        document.getElementById('movie-genre').textContent = data.Genre;
        document.getElementById('movie-plot').textContent = data.Plot;
    } else {
        alert("Film ikke funnet.");
    }
}

// Funksjon for å hente anbefalte filmer basert på sjanger
function getRecommendedMovies(genre) {
    const genres = genre.split(',').map(g => g.trim());
    const recommendedTitles = genres.length > 0 ? genres : ["Action", "Drama", "Comedy"];

    const promises = recommendedTitles.map(title => {
        const url = `https://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=${apiKey}`;
        return fetch(url).then(response => response.json());
    });

    Promise.all(promises)
        .then(responses => {
            displayRecommendedMovies(responses);
        })
        .catch(error => console.error("Feil ved henting av anbefalte filmer: ", error));
}

// Funksjon for å vise anbefalte filmer
function displayRecommendedMovies(data) {
    const recommendedList = document.getElementById('recommended-list');
    recommendedList.innerHTML = '';

    data.forEach(item => {
        if (item.Response === "True" && item.Search.length > 0) {
            item.Search.slice(0, 3).forEach(movie => {
                const movieDiv = document.createElement('div');
                movieDiv.classList.add('recommended-movie');
                movieDiv.innerHTML = `<img src="${movie.Poster !== "N/A" ? movie.Poster : ''}" alt="${movie.Title}" />
                                      <span>${movie.Title} (${movie.Year})</span>`;
                recommendedList.appendChild(movieDiv);
            });
        }
    });
}

// Kall funksjonen ved søk
document.getElementById('search-button').addEventListener('click', () => {
    const title = document.getElementById('movie-input').value;
    if (title) {
        getMovieInfo(title);
    } else {
        alert("Vennligst skriv inn en filmtittel.");
    }
});

// Hent tilfeldige anbefalte filmer ved innlasting av siden
window.onload = function() {
    getRecommendedMovies("Action,Drama,Comedy"); // Kan justeres til ønskede sjangere
};
