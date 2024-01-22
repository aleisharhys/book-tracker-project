//Here will go the dictionary work

const dictionaryURL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

function displayDictionary(event) {
  event.preventDefault();

  // add class hide-search to hide the html content
  const hidden = document.querySelector(".book-search");
  hidden.classList.add("hide-search");

  // add a class display so we can display the dictionary
  const display = document.querySelector(".dictionary-search");
  display.classList.add("display-dictionary");

  const button = document.querySelector(".dictionary-search-btn");

  button.addEventListener("click", () => {
    const inputValue = document.getElementById("dictionary-search").value;
    console.log(inputValue);

    fetch(`${dictionaryURL}${inputValue}`)
      .then((response) => response.json())
      .then((data) => console.log(data));
  });
}

document
  .getElementById("dictionary")
  .addEventListener("click", displayDictionary);

// Here will the  dictionary work
