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

const APILINK = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=41ee980e4b5f05f6693fda00eb7c4fd4&page=1';
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=41ee980e4b5f05f6693fda00eb7c4fd4&query=";

const carousel = document.getElementById('carousel');
const watchlistButton = document.querySelector('.watchlist-button');
const watchNowButton = document.querySelector('.watch-now-button');

// ftching data

fetch(APILINK)
    .then(response => response.json())
    .then(data => {       
        const movies = data.results.slice(0, 10); 
        console.log(movies);
        populateCarousel(movies);

    })
    .catch(error => console.error('Oops, i jaydee something went wrong:', error));

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
    image.src = IMG_PATH + movie.backdrop_path;
    image.alt = movie.title;

    const info = document.createElement('div');
    info.classList.add('movie-info');
    info.textContent = movie.title;

    slide.appendChild(image);
    slide.appendChild(info);

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

function generateStars(number) {
    const roundedNumber = Math.round(number / 2);

    for (let i = 0; i < 5; i++) {
      const starDiv1 = document.createElement('div');
      starDiv1.className = i < roundedNumber ? 'full-star' : 'empty-star';
      starsDiv.appendChild(starDiv1);
    }

    //   if (number < 1)
  }

const API_SERIES_LINK = 'https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=41ee980e4b5f05f6693fda00eb7c4fd4&page=1'

const cover_Div = document.querySelector('.cover');

fetch(API_SERIES_LINK)
    .then(response => response.json())
    .then(data => {
        const movies = data.results.slice(0, 3); // Limiting to 3 movies for simplicity
        populateCover(movies);
        console.log(movies);
    })
    .catch(error => {
        aler('error');
        console.error('Error fetching data:', error);
    });



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
    titleHeading.textContent = movie.original_name;

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

const no1 = document.getElementById('no1');
const allThumnail = document.querySelectorAll('.all-thumbnail');

function slsl() {  
    allThumnail.style.marginLeft = `-180px`;
    allThumnail.style.transition = `1s ease-in-out`;
    no1.style.opacity = '0';
}

const nexts_3 = document.getElementById('nexts-3');
const ending_3 = document.getElementById('ending-3');
const end_3 =  document.querySelector('.end-3');

nexts_3.addEventListener('click', () => {
    ending_3.style.marginLeft = '-180px';
    end_3.style.opacity = '0';
    nexts_4.classList.remove('d-ll');
})

const nexts_4 = document.getElementById('nexts-4');

nexts_4.addEventListener('click', () => {
    ending_3.style.marginLeft = '0px';
    ending_3.style.transition = '0.2s ease-out';
    end_3.style.opacity = '1';
    nexts_4.classList.add('d-ll');
})

// const tiny = document.getElementById('tiny');

// const tile = tiny.textContent;

// console.log(tile)

// for(i=0; i < tile.length; i + 2) {
//    tiny.innerHTML = tile[i].style.color = 'red';
// }

// for(i=1; i < ti.length; i + 2) {
//    tiny.innerHTML = tile[i].style.color = 'grey';
// }





// my number 079 4920 938

// let sidebar = document.querySelector('.sidebar');
// let menuBtn = document.querySelector('.menu-btn');
// let m_btn = document.getElementById('m-btn');

// m_btn.addEventListener('click', () => {
//     console.log('hey');
//     sidebar.style.transform = 'translatex(0%)';
//     menuBtn.style.transform = 'translatex(150px)';
//     m_btn.innerHTML = '<';
//     menuBtn.style.transition = '1s';
// })

// const m_btn = document.getElementById('m_btn');
// const sidebar = document.getElementById('sidebar');
// const menuBtn = document.getElementById('menuBtn');

// let isExpanded = false;

// m_btn.addEventListener('click', () => {
//     isExpanded = !isExpanded; // Toggle the value of isExpanded

//     if (isExpanded) {
//         // Apply styles for expanding sidebar
//         sidebar.style.transform = 'translatex(0%)';
//         menuBtn.style.transform = 'translatex(150px)';
//         m_btn.innerHTML = '<';
//     } else {
//         // Apply styles for collapsing sidebar
//         sidebar.style.transform = 'translatex(-100%)'; // Example value for collapsing sidebar
//         menuBtn.style.transform = 'translatex(0)';
//         m_btn.innerHTML = '>'; // Example text for button when sidebar is collapsed
//     }

//     menuBtn.style.transition = '1s';
// });


    // far right sidebar

const watchBtn = document.getElementById('watch-btn');
const imgae = document.getElementById('imgae');

watchBtn.addEventListener('click', () => {
    imgae.classList.add('full-screen');
    imgae.style.width = `${screen.width}px`;
    imgae.style.height = `${screen.height}px`;
    console.log('it is working')
})

watchBtn.addEventListener('blur', () => {
    imgae.classList.remove('full-screen');
    imgae.style.width = '45px'
    imgae.style.height = '50px'
    console.log('it is working')
})

const dropBtn = document.getElementById('drop-btn');
const cont = document.querySelector('.cont');

dropBtn.addEventListener('click', () => {
    cont.classList.add('droping');
})

dropBtn.addEventListener('blur', () => {
    cont.classList.remove('droping');
})

const closed = document.getElementById('close');
const errors = document.querySelector('.errors');

closed.addEventListener('click', () => {
        errors.style.display = 'none';
})