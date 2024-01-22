//Here will go the dictionary work

const dictionaryURL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

function displayDictionary(event) {
  event.preventDefault();

  // add class hide-search to hide the html content
  const hidden = document.querySelector(".book-search");
  hidden.classList.add("hide-search");

  // add a class display so we can display the dictionary
  const display = document.querySelector(".dictionary-search");
  display.classList.remove("hide-search"); // Use remove instead of add
  display.classList.add("display-dictionary");

  const button = document.querySelector(".dictionary-search-btn");
  const wordSound = document.querySelector(".sound");
  const searchResult = document.querySelector(".search-result");

  button.addEventListener("click", () => {
    const inputValue = document.getElementById("dictionary-search").value;
    console.log(inputValue);

    fetch(`${dictionaryURL}${inputValue}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        searchResult.innerHTML = `<div class="word">
                    <h2 class="sample">${inputValue}</h2>
                    <button class="sound"><i class="fa-solid fa-volume-high"></i></button>
                </div>
                <div class="word-details">
                <p class="meaning">${data[0].meanings[0].definitions[0].definition}</p>
                <p>
                </div>`;
      });
  });
}

document
  .getElementById("dictionary")
  .addEventListener("click", displayDictionary);

// Here will the  dictionary work
