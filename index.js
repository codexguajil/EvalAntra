const Api = (() => {
  const url = 'http://localhost:4232/movies';

  const getMovies = async () => {
  const response = await fetch(url)
  if(response.ok) {
    const parsedData = response.json()
    return parsedData;
  } else {
    throw Error(response.statusText)
  }
}
    return { 
      getMovies 
    };

})();

const View = (() => {
  const strDom = {
    carousel: "#carousel1",
  };

  const render = (ele, movlist) => {
    ele.innerHTML = movlist;
  };

  const createCards = (arr) => {
    
    let card = '';
    arr.forEach((movie) => {
      card += `
      <div id=${movie.id} class="card">
        <img src=${movie.imgUrl} alt="movie poster">
        <h1 id=${movie.name}>${movie.name}</h1>
        <p id=${movie.outlineInfo}>${movie.outlineInfo}</p>
      </div>
      `;
    });
    return card;
  };

  return {
    render,
    createCards,
    strDom,
  }
})();

const Model = ((api, view) => {
  console.log('on')

  class State {
    #movies = [];

    get movielist() {
      return this.#movies;
    }

    set movielist(movies) {
      this.#movies = [...movies];

      const carousel = document.querySelector(view.strDom.carousel);
      console.log(carousel);
      const cards = view.createCards(this.#movies);
      view.render(carousel, cards);
    }
  }

  const {getMovies} = api;

  return {
    getMovies,
    State,
  }

})(Api, View);

const Controller = ((model, view) => {
  const state = new model.State();

  const init = () => {
    model.getMovies().then((movies) => {
      state.movielist = [...movies];
    })
  }

  const bootstrap = () => {
    init();
  };

  return { bootstrap };
})(Model, View);

Controller.bootstrap();

const scrollLeft = () => {
  console.log()
}

document.getElementById('left-arrow').addEventListener("click", (e) => {
  console.log(e.target)
  document.getElementById('carousel1').setAttribute('class', 'scroll-left')
})

document.getElementById('right-arrow').addEventListener("click", (e) => {
  console.log(e.target)
  document.getElementById('carousel1').setAttribute('class', 'scroll-right')
})