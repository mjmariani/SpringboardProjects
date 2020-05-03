/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  let query1 = query;
  const showInfo = await axios.get('http://api.tvmaze.com/search/shows', {params: {
    q: query1
  }
}); 
  let showInfoArr = showInfo.data;
  let showsArr = [];
  //console.log(showInfoArr);
  for(let show of showInfoArr){
    
   let {id, name, summary, image } = show.show;
   let data1 = {id, name, summary, image }; //may be violating DRY principle (do not repeat yourself)
   showsArr.push(data1);
  }
  //console.log(showsArr);
  
  return showsArr;
}
//How can I break up the above functions into separate functions? Or is it not necessary.



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}"> 
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <img class="card-img-top" src="${show.image.original}" onerror="this.onerror=null;this.src='https://tinyurl.com/tv-missing';">
           </div>
         </div>
       </div>
      `);  //data- above is used to set data attributes; which in this case is adding the show id as a data attribute

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
  let $episodeButton = $(`<button type="button" class="btn btn-primary btn-lg btn-block" id="episodeButton">Show Episode List</button>`);

  $(".card-body").append($episodeButton);




});

//this button function ties the other 2 functions for episodes.

$("#shows-list").on("click", async function handleEpisodeClick(evt) {
  let showId = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  let episodes = response.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));

  return episodes;
}

function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
    
  for (let episode of episodes) {
    let $item = $(
      `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `);

    $episodesList.append($item);
  }

  $("#episodes-area").show();
}
