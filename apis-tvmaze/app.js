//'esversion: 8';
//capturing input type button DOM element.
const button = document.querySelector('input[type="submit"]');
const text = document.querySelector('input[type="text"]');
const $gifArea = $('#gif-area');
//const title = text.innerText.value;


//adding event listener to the button.
button.addEventListener('click', async function(evt){
    evt.preventDefault();
    await getGif();

});






async function getGif() {
    const $searchInput = $('#search');
    let searchTerm = $searchInput.val(); //setting search term equal to the value in input box.

    $searchInput.val(""); //set the search input value as empty.

    try{
     const response = await axios.get("http://api.giphy.com/v1/gifs/search", {params: {
        q: searchTerm,
        api_key: "MhAodEJIJxQMxW9XqxKjyXfNYdLoOIym"     

     }
    });

    console.log(response);
    addGif(response.data); //pass in the response data into the addGif function

    }catch(error){
        console.log(error);
    
    }}

    function addGif(res){
        let numResults = res.data.length;
        if(numResults){
            let randomIdx = Math.floor(Math.random() * numResults); //setting a random index number from the number of results in data 
            let $newCol = $("<div>", {class: "col-md-4 col-12 mb-4" }); //setting jQuery variable to new div html tag with class named with bootstrap class name
            let $newGif = $("<img>", {
                src: res.data[randomIdx].images.original.url,
                class: "w-100"
            });
            $newCol.append($newGif);
            $gifArea.append($newCol);
        }
    }




    //removing gif

    $('#remove').on("click", function(e){
        e.preventDefault();
        $gifArea.empty();
    });