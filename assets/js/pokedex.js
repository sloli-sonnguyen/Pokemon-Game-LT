// Color type
const colors = {
  grass: '#9ecca4',
  fire: '#ffab73',
  water: '#8ac4d0',
  bug: '#00917c',
  normal: '#f9f3f3',
  poison: '#9fb8ad',
  electric: '#ffefa1',
  ground: '#c2b092',
  fairy: '#ebd8b7',
  fighting: '#b67171',
  rock: '#d3e0dc',
  ice: '#aee1e1',
  psychic: '#845ec2',
  ghost: '#276678',
};

const pokedexContainer = document.getElementById('pokedex-container');
const normalBtn = document.getElementById('normal-btn');
const slideBtn = document.getElementById('slide-btn');
const pokemonDatas = [];

// Fetch Pokemon (get all pokemon from api)
const fetchPokemons = async () => {
  for (let i = 1; i <= 100; i++) {
    let pokemon = await getPokemon(i);
    pokemonDatas.push(pokemon);
  }
};

// Get a pokemon from API
const getPokemon = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const response = await fetch(url);
  const pokemon = await response.json();
  return pokemon;
};

// Render pokedex container
const pokedexNormalRender = (pokemonDatas) => {
  const innerNormal = pokemonDatas
    .map((item, index) => {
      const { id, name } = item;
      const type = item.types[0].type.name;
      return `
      <div class="pokedex-card cardScroll ${
        index < 12 && 'active'
      }" style="background-color: ${colors[type]};">
          <div class="pokedex-card__image">
            <img
                src="https://pokeres.bastionbot.org/images/pokemon/${id}.png"
                alt="poke"
            />
           </div>
           <h3 class="pokedex-card__name">${name}</h3>
           <h4 class="pokedex-card__id">#${id}</h4>
           <p class="pokedex-card__type">${type}</p>
      </div>
    `;
    })
    .join('');
  pokedexContainer.innerHTML = innerNormal;
};

// Scroll reveal
var revealerpoint = 150;
window.addEventListener('scroll', reveal);
reveal();

function reveal() {
  var revealers = document.querySelectorAll('.cardScroll');
  for (var i = 0; i < revealers.length; i++) {
    var windowheight = window.innerHeight;
    var revealertop = revealers[i].getBoundingClientRect().top;
    var revealerbottom = revealers[i].getBoundingClientRect().bottom;
    if (revealertop < windowheight - revealerpoint) {
      revealers[i].classList.add('active');
    } else {
      revealers[i].classList.remove('active');
    }
    if (revealerbottom < 0 + revealerpoint) {
      revealers[i].classList.remove('active');
    }
  }
}

// Slide Render
const pokedexSlideRender = (pokemonDatas) => {
  const innerSlide =
    pokemonDatas
      .map((item, index) => {
        const { id, name, height, weight } = item;
        const type = item.types[0].type.name;
        return `
      <div class="poke-slide" style="background-color: ${colors[type]};">
        <div class="poke-slide__left">
          <h3 class="poke-slide__id">#${id}</h3>
          <h2 class="poke-slide__name">${name}</h2>
          <h3 class="poke-slide__info">Height: ${height}m</h3>
          <h3 class="poke-slide__info">Weigth: ${weight}kg</h3>
          <img
            src="https://pokeres.bastionbot.org/images/pokemon/${id}.png"
            alt="poke"
          />
        </div>
        <div class="poke-slide__right">
          <div class="poke-slide__type">${type}</div>
          <h1 class="poke-slide-right__title">Base stats</h1>
          <div class="attribute-wrap">
            <div class="attribute-item">HP: ${item.stats[0].base_stat}</div>
            <div class="attribute-item">Attack:${item.stats[1].base_stat}</div>
            <div class="attribute-item">Defense:${item.stats[2].base_stat}</div>
            <div class="attribute-item">Special: ${item.stats[3].base_stat}</div>
            <div class="attribute-item">Speed: ${item.stats[4].base_stat}</div>
          </div>
        </div>
      </div>
      `;
      })
      .join('') +
    `<div class="slide-buttons">
            <button id="prev">Prev</button>
            <button id="next">Next</button>
          </div>`;
  pokedexContainer.innerHTML = innerSlide;
  createSlider();
};

// Slide setup
const createSlider = () => {
  const currentSlide = document.getElementsByClassName('poke-slide')[0];
  currentSlide.classList.add('current');
  console.log(currentSlide);

  const slides = document.querySelectorAll('.slide');
  const next = document.querySelector('#next');
  const prev = document.querySelector('#prev');
  const auto = false;
  const intervalTime = 5000;
  let slideInterval;

  const nextSlide = () => {
    const current = document.querySelector('.current');
    current.classList.remove('current');
    if (current.nextElementSibling) {
      current.nextElementSibling.classList.add('current');
    } else {
      slides[0].classList.add('current');
    }
    setTimeout(() => current.classList.remove('current'));
  };

  const prevSlide = () => {
    const current = document.querySelector('.current');
    current.classList.remove('current');
    if (current.previousElementSibling) {
      current.previousElementSibling.classList.add('current');
    } else {
      slides[slides.length - 1].classList.add('current');
    }
    setTimeout(() => current.classList.remove('current'));
  };

  next.addEventListener('click', (e) => {
    nextSlide();
    if (auto) {
      slideInterval = setInterval(nextSlide, intervalTime);
      clearInterval(slideInterval);
    }
  });

  prev.addEventListener('click', (e) => {
    prevSlide();
    if (auto) {
      slideInterval = setInterval(nextSlide, intervalTime);
      clearInterval(slideInterval);
    }
  });

  if (auto) {
    slideInterval = setInterval(nextSlide, intervalTime);
  }
};

// First run
fetchPokemons().then((res) => {
  pokedexNormalRender(pokemonDatas);
});

// Normal button and slide button click event
normalBtn.addEventListener('click', () => {
  pokedexNormalRender(pokemonDatas);
});

slideBtn.addEventListener('click', () => pokedexSlideRender(pokemonDatas));
