const searchBtn = $('#search-btn');

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
            console.log(data)
        })
}