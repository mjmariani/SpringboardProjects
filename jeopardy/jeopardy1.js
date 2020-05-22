// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]
let categories = [];
let SIZE = 6;
/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */
async function getCategoryIdsAndPopulateCategoriesArray() {
    console.log(categories);
    let categoryIds = await axios.get("https://jservice.io/api/categories", {
        params: {
            count: 100
        }
    });
    let cats = [];
    //console.log(categoryIds);
    for (let category of categoryIds.data) {
        cats.push(category);
    }
    let shuffledCategories = _.shuffle(cats);
    let sampleCategories = _.sampleSize(shuffledCategories, 6); //gets a random sample of size 6 using the lodash library
    for (let sampleCategory of sampleCategories) {
        categories.push(sampleCategory);
    }
    let catID = [];
    for (let sampleCategory of sampleCategories) {
        catID.push(sampleCategory.id);
    }
    return catID;
}
/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */
async function getCategory(id) {
    let categoryObj = await axios.get("https://jservice.io/api/category", {
        params: {
            id: id
        }
    });
    let {
        title,
        clues
    } = categoryObj.data;
    let category = {
        title: title,
        clues: clues
    };
    return category;
}
async function getCluesAndAppendToCategories() {
    for (let category of categories) {
        let id = category.id;
        let categoryInfo = await getCategory(id);
        let clues = [];
        for (let clue of categoryInfo.clues) {
            let obj1 = {
                showing: null
            }; //creating the showing property
            $.extend(clue, obj1); //appending showing to clue object
            clues.push(clue);
        }
        let obj2 = {
            clue: clues
        }; //inserting the clues array into an object as a property
        let categoryClues = [];
        categoryClues.push(obj2); //pushing the obj2 array object into categoryClues array
        let obj3 = {
            clues: categoryClues
        }; //creating another obj in order to add obj2 as property
        $.extend(category, obj3); //adding obj3 into the category object
    }
    return categories;
}
/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */
async function fillTable() {
    $('thead').append('<tr>');
    for (let i = 0; i < SIZE; i++) {
        const categoryHeaders = $(`<td>${categories[i].title}</td>`);
        $('thead').append(categoryHeaders);
    }
    $('thead').append('</tr>');
    //const $newTableBody = $(`<tr> <td class="1"><span class="span">?</span></td> <td class="2"><span class="span">?</span></td> <td class="3"><span class="span">?</span></td> <td class="4"><span class="span">?</span></td> <td class="5"><span class="span">?</span></td> <td class="6"><span class="span">?</span></td> </tr>`);
    for (let i = 1; i < SIZE - 1; i++) {
        $('tbody').append('<tr>');
        for (let i = 1; i <= SIZE; i++) {
            const tableBody = $(`<td class="${i}"><span class="span">?</span></td>`);
            $('tbody').append(tableBody);
        }
        $('tbody').append('</tr>');
    }
    //for(let i=1; i<5; i++){
    // $newTableBody.clone().appendTo('#tbody'); //creating a deep copy of the newTableBody through jquery
    //}
    for (let y = 1, z = 0; y < 7, z < 6; y++, z++) {
        let x = 0;
        await $(`.${y}`).each(async function (x) {
            //console.log(x);
            $(this).data('clue', categories[z].clues[0].clue[x]);
            $(this).on("click", handleClick);
            x++;
        });
    }
}

async function createTable() {

    $('thead').append('<tr>');
    for (let i = 0; i < SIZE; i++) {
        const categoryHeaders = $(`<td id="${i}"></td>`);
        $('thead').append(categoryHeaders);

    }
    $('thead').append('</tr>');
    for (let i = 1; i < SIZE - 1; i++) {
        $('tbody').append('<tr>');
        for (let i = 1; i <= SIZE; i++) {
            const tableBody = $(`<td class="${i}"><span class="span">?</span></td>`);
            $('tbody').append(tableBody);
        }
        $('tbody').append('</tr>');
    }

}

async function emptyTable() {

    for (i = 0; i < 6; i++) {
        //if (!$(`#${i}`).is(':empty')) {
            $(`#${i}`).empty();

       // }

    }
   // $('tbody').empty().off("click");
    for (let y = 1; y < 7; y++) {

        $(`.${y}`).each(function () {
           // if (!$(this).is(':empty')) {
                $(this).empty().off("click");
                $(this).append(`<span class="span">?</span>`);
           // }
        });

    }
}
async function populateTable() {

    for (i = 0; i < 6; i++) {

        await $(`#${i}`).text(`${categories[i].title}`);

    }

    for (let y = 1, z = 0; y < 7, z < 6; y++, z++) {
        let x = 0;
        await $(`.${y}`).each(async function (x, y) {

            //console.log(x);
            $(this).data('clue', categories[z].clues[0].clue[x]);
            $(this).on("click", handleClick);
            x++;
        });
    }

}
/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */
function handleClick(evt) {
    let targetA = $(evt.target).find('.span').get(); //retrieves element that is matched by jquery object.
    let target1 = $(evt.target).data('clue');
    console.log(target1);
    console.log(targetA);
    //let target1 = jQuery.data(evt.target, "data-clue"); //clue array for specific column category
    event = evt;
    if (target1.showing == null) {
        console.log(targetA);
        $(evt.target).find('.span').remove(); // could also use toggleClass and split the texts in the cells based on classes.
        let d = target1.question;
        $(evt.target).closest("td").append(d);
        target1.showing = "question";
    } else if (target1.showing == "question") {
        $(evt.target).closest("td").empty();
        $(evt.target).closest("td").append(target1.answer);
        target1.showing = "answer";
    } else {
        $(evt.target).off();
    }
}
/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */
async function setupAndStart() {
    categoryIds = await getCategoryIdsAndPopulateCategoriesArray(); //gets random category IDs and also sets up the categories[]
    console.log(categoryIds);
    await getCluesAndAppendToCategories();
    await createTable();
    await populateTable();
}
async function restartGame() {
    categoryIds = await getCategoryIdsAndPopulateCategoriesArray(); //gets random category IDs and also sets up the categories[]
    console.log(categoryIds);
    await getCluesAndAppendToCategories();
    emptyTable();
    await populateTable();

}

/** On click of restart button, restart game. */
// TODO
/** On page load, setup and start & add event handler for clicking clues */
// TODO
async function init() {
    await setupAndStart();
    $("#restart").bind("click", async function () {
        categories = [];
        //$('thead').empty();
        //$('tbody').empty();
        //location.reload();
        await restartGame();
    });
}
$(document).ready(init);

//Some bugs include not being able to click directly on question mark symbol and get a response

// Notes:
// Loop through the header and table body to create them
// re-produce the original restart 
// remove lines
// random number for ids
// use a SIZE variable for i loop limit
// remove the ids for the tables

//when restart button is pressed, the categories are not brand new