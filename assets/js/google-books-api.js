// Variables to reach various DOM elements.
const searchHeadline = $('#book-search-h1');
const searchInput = $('#book-search');
const searchBtn = $('#search-btn');
const searchNav = $('#search');
const searchDiv = $('#book-search-form');
const resultsDiv = $('#results-div');
const resultsTable = $('#results')
const myBooksNav = $('#my-books');
const myBooksDiv = $('#my-books-div');
const myBooksTable = $('#my-books-list');
const dictionaryNav = $('#dictionary');
const dictionaryDiv = $('#dictionary-div');
const container = $('#container');

// Variables to store and retrieve data by using the local storage.
let collection = [];
let readStates = {};

//This function controls the menu sections in the navbar. It decides what to show and what to hide once a section is clicked.
function showNavbarContent() {
    dictionaryNav.on('click', function () {
        container.removeClass('container-alt').addClass('container');
        dictionaryDiv.removeClass('hidden');
        searchDiv.addClass('hidden');
        resultsDiv.addClass('hidden');
        myBooksDiv.addClass('hidden');
    })

    searchNav.on('click', function () {
        searchInput.val('');

        container.removeClass('container-alt').addClass('container');
        searchDiv.removeClass('book-search-results').addClass('book-search');
        searchBtn.removeClass('book-search-btn-results').addClass('book-search-btn');
        searchInput.removeClass('book-search-input-reults').addClass('input');
        searchDiv.removeClass('hidden');
        searchHeadline.removeClass('hidden');
        dictionaryDiv.addClass('hidden');
        resultsDiv.addClass('hidden');
        myBooksDiv.addClass('hidden');
    })

    myBooksNav.on('click', function () {
        loadMyBooks();
        saveReadState();
        loadReadState();

        container.removeClass('container').addClass('container-alt');
        myBooksDiv.removeClass('hidden');
        dictionaryDiv.addClass('hidden');
        searchDiv.addClass('hidden');
        resultsDiv.addClass('hidden');
    })
}

showNavbarContent();

// Event listener on the search button.
searchBtn.on('click', function (e) {
    e.preventDefault();

    // Before displaying the current search results, previous results are getting cleared.
    resultsTable.text('');

    // Make results visible by removing the hidden class and moving the search form to the top in smaller size by changing classes to apply the relevant CSS rules.
    container.removeClass('container').addClass('container-alt');
    searchDiv.removeClass('book-search').addClass('book-search-results');
    searchHeadline.addClass('hidden');
    searchBtn.removeClass('book-search-btn').addClass('book-search-btn-results');
    searchInput.removeClass('input').addClass('book-search-input-reults');
    resultsDiv.removeClass('hidden');

    const searchTerm = $('#book-search').val().trim();
    const queryURL = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`;

    searchBook(queryURL);
})

// This function gets a URL as a parameter, then uses the fetch API method on the given URL.
// It stores the first 5 results in an array, then creates a table from the array elements with the relevant information.
// Also adds an event listener to all 'Add to my collection' button, so once any of them clicked, the book will be added
// to an array called 'collection'. It will be filtered from duplicates and the filtered data will be stored in the local storage.
function searchBook(url) {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const results = [data.items[0], data.items[1], data.items[2], data.items[3], data.items[5]];
            const tableEl = $('#results');

            // Rendering the search results to the screen.
            results.forEach(result => {
                const rowEl = $('<tr>');
                const coverCell = $('<td>');

                // If no cover picture available, it will be replaced by a placeholder by using Milos Rancic solution:
                // https://stackoverflow.com/a/55696135
                // The placeholder comes from Wikimedia Commons:
                // https://commons.wikimedia.org/wiki/File:No-Image-Placeholder.svg
                const coverImg = $('<img>').attr('src', result.volumeInfo.imageLinks === undefined ?
                    'assets/img/no-image-placeholder.png' : `${result.volumeInfo.imageLinks.smallThumbnail}`);
                const authorAndTitleCell = $('<td>').text(`${result.volumeInfo.authors.join(' & ')} - ${result.volumeInfo.title}`);

                // If no short description available, it will be replaced by the longer description. If the longer description also missing, a custom text will be displayed.
                const descriptionCell = $('<td>').html(result.searchInfo === undefined ?
                    `${(result.volumeInfo.description === undefined ? 'No description available' : result.volumeInfo.description)}` : `${result.searchInfo.textSnippet}`)
                    .addClass('description-cell');
                const addButtonCell = $('<td>');
                const addButton = $('<button>').text('Add to my collection').addClass('add-collection');

                // Adding an event listener to each "Add to my collection" button. Once one of those button is clicked, the associated data will be stored in the local storage.
                addButton.on('click', function () {
                    const authorAndTitle = `${result.volumeInfo.authors.join(' & ')} - ${result.volumeInfo.title}`;
                    const coverUrl = result.volumeInfo.imageLinks === undefined ?
                        'assets/img/no-image-placeholder.png' : `${result.volumeInfo.imageLinks.smallThumbnail}`
                    const bookObject = { 'authorAndTitle': authorAndTitle, 'coverUrl': coverUrl };
                    collection.push(bookObject);

                    // Filtering the collection array of objects from duplicates by using chickens' solution: 
                    // https://stackoverflow.com/a/56757215
                    let filteredCollection = collection.filter((v, i, a) => a.findIndex(v2 => (JSON.stringify(v2) === JSON.stringify(v))) === i)
                    localStorage.setItem('collection', JSON.stringify(filteredCollection));
                })

                coverCell.append(coverImg);
                addButtonCell.append(addButton);
                rowEl.append(coverCell, authorAndTitleCell, descriptionCell, addButtonCell);
                tableEl.append(rowEl);
            })
        })
}

// Retrieve data from the local storage and render the collection of books into a table,
// and adds a checkbox to each book to be able to mark if it's already been read.
function loadMyBooks() {
    myBooksTable.text('');
    let storedCollection = JSON.parse(localStorage.getItem('collection'));

    // If nothing is stored in the local storage, the value of storedCollection variable will be equal to an empty array.
    // If there are books already stored in the local storage, those books will be added to the collection array to keep our collection up to date.
    // Then we can push the new books to the up to date collection array which again will be stored in local storage by overwriting the old array there.
    if (storedCollection === null) {
        storedCollection = [];
    } else {
        storedCollection.forEach(book => {
            collection.push(book);
        })
    }

    // Rendering our collection of books to the screen
    const myBookList = document.getElementById('my-books-list');
    for (let i = 0; i < storedCollection.length; i++) {
        const rowEl = document.createElement('tr');
        const indexCell = document.createElement('td');
        indexCell.textContent = i + 1;
        const coverCell = document.createElement('td');
        const coverImg = document.createElement('img');
        coverImg.setAttribute('src', storedCollection[i].coverUrl)
        const authorAndTitleCell = document.createElement('td');
        authorAndTitleCell.textContent = storedCollection[i].authorAndTitle;
        const checkboxCell = document.createElement('td');
        checkboxCell.textContent = 'Read';
        const checkboxEl = document.createElement('input');
        checkboxEl.setAttribute('type', 'checkbox');
        checkboxEl.setAttribute('id', `ch${i + 1}`);
        checkboxEl.classList.add('read');

        coverCell.append(coverImg);
        checkboxCell.append(checkboxEl);
        rowEl.append(indexCell, coverCell, authorAndTitleCell, checkboxCell);
        myBookList.append(rowEl);
    }
}

// Function to allow save the state of checkboxes to local storage when displaying the 'My Books' section.
function saveReadState() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    for (let i = 0; i < checkboxes.length; i++) {
        const currentCheckbox = checkboxes[i];

        currentCheckbox.addEventListener('change', function () {
            readStates[currentCheckbox.id] = currentCheckbox.checked;

            localStorage.setItem('read', JSON.stringify(readStates));
        })
    }
}

// Function to load the state of checkboxes from the local storage when displaying the 'My Books' section.
function loadReadState() {
    const readStates = JSON.parse(localStorage.getItem('read'));
    if (readStates !== null) {
        for (let i in readStates) {
            document.getElementById(i).checked = readStates[i];
        };
    } else {
        localStorage.setItem('read', JSON.stringify({}));
    }
}