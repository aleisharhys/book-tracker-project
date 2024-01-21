//Here will go the dictionary work

function displayDisctionary(event) {
  event.preventDefault();
  const hidden = document.getElementById("book-search");
  hidden.element.classList.add("hide-book-search");
}

document
  .getElementById("dictionaty")
  .addEventListener("click", displayDisctionary);
// Here will the  dictionary work
