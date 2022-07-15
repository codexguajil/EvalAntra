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
    console.log(movlist);
    if(!document.getElementById('carousel1').classList.contains('scroll-right')) {
      let first = movlist.splice(0, 4).join('')
      ele.innerHTML = first;
    } else {
      ele.innerHTML = movlist.join('');
    }
  };

  const createCards = (arr) => {
    
    let card = [];
    arr.forEach((movie) => {
      card.push( `
      <div id=${movie.id} class="card">
        <img src=${movie.imgUrl} alt="movie poster">
        <h1 id=${movie.name}>${movie.name}</h1>
        <p id=${movie.outlineInfo}>${movie.outlineInfo}</p>
      </div>
      `);
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

  class State {
    #movies = [];

    get movielist() {
      return this.#movies;
    }

    set movielist(movies) {
      this.#movies = [...movies];

      const carousel = document.querySelector(view.strDom.carousel);
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

  document.getElementById('left-arrow').addEventListener("click", (e) => {
    document.getElementById('carousel1').setAttribute('class', 'scroll-left')
  })
  
  document.getElementById('right-arrow').addEventListener("click", (e) => {
    document.getElementById('carousel1').setAttribute('class', 'scroll-right')
    state.movielist = state.movielist
  })

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