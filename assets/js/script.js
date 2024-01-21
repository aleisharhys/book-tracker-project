//Here will go the dictionary work

function displayDictionary(event) {
  event.preventDefault();
  const hidden = document.querySelector(".book-search");
  hidden.classList.add("hide-search");

  const display = document.querySelector(".dictionary-search");
  display.classList.add("display-dictionary");
}
document
  .getElementById("dictionary")
  .addEventListener("click", displayDictionary);

// Here will the  dictionary work
