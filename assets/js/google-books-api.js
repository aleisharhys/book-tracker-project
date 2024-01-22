const searchBtn = $('#search-btn');
const bookSearchForm = $('#book-search-form');

searchBtn.on('click', function (e) {
    e.preventDefault();

    const searchTerm = $('#book-search').val().trim();
    const queryURL = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`;

    searchBook(queryURL);
})

function searchBook(url) {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const results = [data.items[0], data.items[1], data.items[2], data.items[3], data.items[5]];
            console.log(results)
            bookSearchForm.addClass('hidden');
            const tableEl = $('#results');

            results.forEach(result => {
                const rowEl = $('<tr>');
                const coverCell = $('<td>');
                const coverImg = $('<img>').attr('src', result.volumeInfo.imageLinks.smallThumbnail);
                const authorAndTitleCell = $('<td>').text(`${result.volumeInfo.authors[0]} - ${result.volumeInfo.title}`);
                const descriptionCell = $('<td>').text(result.volumeInfo.description);
                const addButtonCell = $('<td>');
                const addButton = $('<button>').text('Add to my collection');

                coverCell.append(coverImg);
                addButtonCell.append(addButton);
                rowEl.append(coverCell, authorAndTitleCell, descriptionCell, addButtonCell);
                tableEl.append(rowEl);
            })
        })
}