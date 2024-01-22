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
                    localStorage.setItem('collection', JSON.stringify(collection));
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

// Retrieve data from the local storage and render the collection of books into a table,
// and adds a checkbox to each book to be able to mark if it's already been read.
function loadMyBooks() {
    let storedCollection = JSON.parse(localStorage.getItem('collection'));
    const myBookList = document.getElementById('my-books-list');
    for (let i = 0; i < storedCollection.length; i++) {
        const rowEl = document.createElement('tr');
        const indexCell = document.createElement('td');
        indexCell.textContent = i + 1;
        const authorAndTitleCell = document.createElement('td');
        authorAndTitleCell.textContent = storedCollection[i];
        const checkboxCell = document.createElement('td');
        checkboxCell.textContent = 'Read';
        const checkboxEl = document.createElement('input');
        checkboxEl.setAttribute('type', 'checkbox');
        checkboxEl.setAttribute('id', `ch${i + 1}`);
        checkboxEl.classList.add('read');

        checkboxCell.append(checkboxEl);
        rowEl.append(indexCell, authorAndTitleCell, checkboxCell);
        myBookList.append(rowEl);
    }
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.setAttribute('id', 'saveBtn');
    myBooksDiv.append(saveBtn);
}

function saveReadState() {
    saveBtn.addEventListener('click', function () {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const read = [];

        for (let i = 0; i < checkboxes.length; i++) {
            read.push({ id: checkboxes[i].id, checked: checkboxes[i].checked });
        }

        localStorage.setItem('read', JSON.stringify(read));
    })
}

function loadReadState() {
    const readStates = JSON.parse(localStorage.getItem('read'));

    for (let i = 0; i < readStates.length; i++) {
        document.getElementById(readStates[i].id).checked = readStates[i].checked;
    };
}

loadMyBooks();
saveReadState();
loadReadState();