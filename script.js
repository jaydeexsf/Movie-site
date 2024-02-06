const navLinks = document.querySelectorAll('nav a');
const home = document.querySelector('.active');

navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.classList.add('hovered');
    });

    link.addEventListener('mouseleave', () => {
        link.classList.remove('hovered');
    });

    link.addEventListener('focus', () => {
        link.classList.add('focused');
        home.classList.remove('active');
    });

     link.addEventListener('blur', () => {

         link.classList.add('focused');
     });
});

// movies sliding //

const API_LINK = 'https://api.themoviedb.org/3/movie/popular?api_key=0a75b7b77f453f2a8041e13b6e383224&language=en-US&page=1' 

const carousel = document.getElementById('carousel');
const watchlistButton = document.querySelector('.watchlist-button');
const watchNowButton = document.querySelector('.watch-now-button');

// Super junior developer's attempt at API integration
fetch(API_LINK)
    .then(response => response.json())
    .then(data => {
        const movies = data.results.slice(0, 10); // Limiting to 5 movies for simplicity
        populateCarousel(movies);
    })
    .catch(error => console.error('Oops, something went wrong:', error));

function populateCarousel(movies) {
    movies.forEach(movie => {
        const slide = createMovieSlide(movie);
        carousel.appendChild(slide);
    });
}


function createMovieSlide(movie) {
    const slide = document.createElement('div');
    slide.classList.add('movie-slide');

    const image = document.createElement('img');
    image.src = `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;
    image.alt = movie.title;

    const info = document.createElement('div');
    info.classList.add('movie-info');
    info.textContent = movie.title;

    slide.appendChild(image);
    slide.appendChild(info);

    generateStars(movie.ratings);

    return slide;
}

watchlistButton.addEventListener('click', () => {
    alert('Yay! Movie added to watchlist! 🍿');
});

watchNowButton.addEventListener('click', () => {
    alert('Hooray! Enjoy watching the movie! 🎬');
});

let currentIndex = 0;

function showSlide(index) {
    const newPosition = -index * 100 + '%';
    carousel.style.transform = 'translateX(' + newPosition + ')';
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % carousel.children.length;
    showSlide(currentIndex);
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + carousel.children.length) % carousel.children.length;
    showSlide(currentIndex);
}

setInterval(nextSlide, 10000);


const stars = document.querySelector('.stars');  

function generateStars(number) {
    const roundedNumber = Math.round(number / 2);

    for (let i = 0; i < 5; i++) {
      const starDiv = document.createElement('div');
      starDiv.className = i < roundedNumber ? 'full-star' : 'empty-star';
      stars.appendChild(starDiv);
    }

    //   if (number < 1)
  }

  generateStars

  // Example: Call the function with a number between 0 and 10
 

const cover_Div = document.querySelector('.cover');

lj
fetch(API_LINK)
    .then(response => response.json())
    .then(data => {
        const movies = data.results.slice(10, 13); // Limiting to 5 movies for simplicity
        populateCover(movies);
    })
    .catch(error => console.error('Error fetching data:', error));

function populateCover(movies) {
    movies.forEach(movie => {
        const movieElement = createMovieElement(movie);
        cover_Div.appendChild(movieElement);
    });
}

function createMovieElement(movie) {
    const wholeDiv = document.createElement('div');
    wholeDiv.classList.add('whole');

    const imageSmallDiv = document.createElement('div');
    imageSmallDiv.id = 'image-small';

    const image = document.createElement('img');
    image.src = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    image.alt = movie.title;
    image.classList.add('smlaa-r');

    const insideElementsDiv = document.createElement('div');
    insideElementsDiv.classList.add('inside-elements');

    const insDiv = document.createElement('div');
    insDiv.classList.add('ins');

    const titleHeading = document.createElement('h3');
    titleHeading.textContent = movie.title;

    const starsDiv = document.createElement('div');
    starsDiv.classList.add('stars');

    const epiCateDiv = document.createElement('div');
    epiCateDiv.classList.add('epi-cate');

    const episodeParagraph = document.createElement('p');
    episodeParagraph.classList.add('epi');
    episodeParagraph.textContent = `${movie.episode_count} episodes`;

    const categoryParagraph = document.createElement('p');
    categoryParagraph.classList.add('cate');
    categoryParagraph.textContent = movie.category;

    const btnsSmallDiv = document.createElement('div');
    btnsSmallDiv.classList.add('btns-small');

    const plusButton = document.createElement('button');
    plusButton.classList.add('p-btn');
    plusButton.textContent = '+';

    const watchButton = document.createElement('button');
    watchButton.classList.add('watch');
    watchButton.textContent = 'Watch';

    // Append elements to create the structure
    wholeDiv.appendChild(imageSmallDiv);
    imageSmallDiv.appendChild(image);
    wholeDiv.appendChild(insideElementsDiv);
    insideElementsDiv.appendChild(insDiv);
    insDiv.appendChild(titleHeading);
    insDiv.appendChild(starsDiv);
    insDiv.appendChild(epiCateDiv);
    epiCateDiv.appendChild(episodeParagraph);
    epiCateDiv.appendChild(categoryParagraph);
    insideElementsDiv.appendChild(btnsSmallDiv);
    btnsSmallDiv.appendChild(plusButton);
    btnsSmallDiv.appendChild(watchButton);

    return wholeDiv;
}

  