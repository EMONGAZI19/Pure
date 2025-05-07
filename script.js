document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  // Toggle menu on menu icon click
  menuToggle.addEventListener('click', (event) => {
    navMenu.classList.toggle('active');
    event.stopPropagation(); // Prevent event from bubbling up
  });

  // Close menu if clicked outside
  document.addEventListener('mousedown', (event) => {
    if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
      navMenu.classList.remove('active');
    }
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
    const movieSections = document.querySelectorAll('.movie-section');

    let found = false;

    if (searchQuery.trim() === "") {
      movieSections.forEach(section => section.style.display = '');
      movieCards.forEach(card => card.style.display = '');
      document.getElementById('noResultMessage')?.remove();
      return;
    }

    movieSections.forEach(section => section.style.display = 'none');

    movieCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      if (title.includes(searchQuery)) {
        card.style.display = '';
        const section = card.closest('.movie-section');
        if (section) section.style.display = '';
        found = true;
      } else {
        card.style.display = 'none';
      }
    });

    let noResultMessage = document.getElementById('noResultMessage');
    if (!found) {
      if (!noResultMessage) {
        noResultMessage = document.createElement('div');
        noResultMessage.id = 'noResultMessage';
        noResultMessage.style.textAlign = 'center';
        noResultMessage.style.color = '#ff4444';
        noResultMessage.style.marginTop = '15px';
        noResultMessage.style.fontWeight = 'bold';
        noResultMessage.textContent = 'এই মুভি টি নেই, রিকুয়েস্ট বাটন থেকে রিকুয়েস্ট করুন';

        // search bar এর নিচে বসানো
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
          searchContainer.insertAdjacentElement('afterend', noResultMessage);
        } else {
          document.body.appendChild(noResultMessage); // fallback
        }
      }
    } else {
      noResultMessage?.remove();
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
