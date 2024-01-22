const searchBtn = $('#search-btn');
const searchNav = $('#search');
const searchDiv = $('#book-search-form');
const resultsDiv = $('#results-div');
const myBooksNav = $('#my-books');
const myBooksDiv = $('#my-books-div');
const myBooksTable = $('#my-books-list');
const dictionaryNav = $('#dictionary');
const dictionaryDiv = $('#dictionary-div');

let collection = [];
//let storedCollection = JSON.parse(localStorage.getItem('collection'));

// Event listener on the search button.
searchBtn.on('click', function (e) {
    e.preventDefault();

    searchDiv.addClass('hidden');
    resultsDiv.removeClass('hidden');
    const searchTerm = $('#book-search').val().trim();
    const queryURL = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`;

    searchBook(queryURL);
})

// This function gets an URL as a parameter and then uses the fetch API method on the given URL.
// It stores the first 5 results in an array, then creates a table from the array element with the relevant information.
// Also adding an event listener to all 'Add to my collection' button, so once any of them clicked, the book will be added
// to an array called 'collection' which also will be stored in the localStorage.
function searchBook(url) {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const results = [data.items[0], data.items[1], data.items[2], data.items[3], data.items[5]];
            const tableEl = $('#results');

            results.forEach(result => {
                const rowEl = $('<tr>');
                const coverCell = $('<td>');
                const coverImg = $('<img>').attr('src', result.volumeInfo.imageLinks.smallThumbnail);
                const authorAndTitleCell = $('<td>').text(`${result.volumeInfo.authors.join(' & ')} - ${result.volumeInfo.title}`);
                const descriptionCell = $('<td>').text(result.volumeInfo.description);
                const addButtonCell = $('<td>');
                const addButton = $('<button>').text('Add to my collection').addClass('add-collection');

                addButton.on('click', function () {
                    collection.push(`${result.volumeInfo.authors.join(' & ')} - ${result.volumeInfo.title}`);
                    localStorage.setItem('collection', collection);
                })

                coverCell.append(coverImg);
                addButtonCell.append(addButton);
                rowEl.append(coverCell, authorAndTitleCell, descriptionCell, addButtonCell);
                tableEl.append(rowEl);
            })
        })
}

//This function controls the menu sections in the navbar. It decides what to show and what to hide once a section is clicked.
function showNavbarContent() {
    dictionaryNav.on('click', function () {
        dictionaryDiv.removeClass('hidden');
        searchDiv.addClass('hidden');
        resultsDiv.addClass('hidden');
        myBooksDiv.addClass('hidden');
    })

    searchNav.on('click', function () {
        searchDiv.removeClass('hidden');
        dictionaryDiv.addClass('hidden');
        resultsDiv.addClass('hidden');
        myBooksDiv.addClass('hidden');
    })

    myBooksNav.on('click', function () {
        myBooksDiv.removeClass('hidden');
        dictionaryDiv.addClass('hidden');
        searchDiv.addClass('hidden');
        resultsDiv.addClass('hidden');
    })
}

showNavbarContent();