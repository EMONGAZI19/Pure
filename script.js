document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const noResultMessage = document.getElementById('noResultMessage');

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  function createMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');

    const link = document.createElement('a');
    link.href = movie.link || "#";
    link.target = "_blank";

    const movieImage = document.createElement('img');
    movieImage.src = movie.image;
    movieImage.alt = movie.title;

    const movieTitle = document.createElement('h3');
    movieTitle.textContent = movie.title;

    link.appendChild(movieImage);
    link.appendChild(movieTitle);
    movieCard.appendChild(link);

    return movieCard;
  }

  function loadMovies(category, showAll = false) {
    const movieContainer = document.getElementById(category);
    movieContainer.innerHTML = '';

    const moviesCategory = movies[category];
    const limit = showAll ? moviesCategory.length : 12;

    for (let i = 0; i < limit && i < moviesCategory.length; i++) {
      const movie = moviesCategory[i];
      const movieCard = createMovieCard(movie);
      movieContainer.appendChild(movieCard);
    }

    const button = document.querySelector(`button[data-category="${category}"]`);
    if (button) {
      button.textContent = showAll ? 'Show Less' : 'See All';
      button.setAttribute('data-showing-all', showAll);
    }
  }

  window.toggleShow = function (category) {
    const button = document.querySelector(`button[data-category="${category}"]`);
    const isShowingAll = button.getAttribute('data-showing-all') === 'true';
    loadMovies(category, !isShowingAll);
  }

  window.searchMovie = function () {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const movieCards = document.querySelectorAll('.movie-card');

    let found = false;

    movieCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      if (title.includes(searchQuery)) {
        card.style.display = '';
        found = true;
      } else {
        card.style.display = 'none';
      }
    });

    if (!found && searchQuery !== "") {
      noResultMessage.style.display = 'block';
    } else {
      noResultMessage.style.display = 'none';
    }
  }

  const categories = [
    'latestMovies',
    'banglaMovies',
    'hindiDubbedMovies',
    'hollywoodMovies',
    'banglaDubbedMovies',
    'animeMovies'
  ];

  categories.forEach(category => loadMovies(category));
});
