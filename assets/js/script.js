// Here will go the dictionary work

const dictionaryURL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

function displayDictionary(event) {
  event.preventDefault();

  // add a class display so we can display the dictionary
  const display = document.querySelector(".dictionary-search");
  display.classList.remove("hide-search"); // Use remove instead of add
  display.classList.add("display-dictionary");

  const button = document.querySelector(".dictionary-search-btn");
  const searchResult = document.querySelector(".search-result");

  button.addEventListener("click", () => {
    const inputValue = document.getElementById("dictionary-search").value;
    console.log(inputValue);
    //Api fetch : word, definition, pronunciation.
    fetch(`${dictionaryURL}${inputValue}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const example = data[0].meanings[0].definitions[0].example;

        searchResult.innerHTML = `<div class="word">
        <h2 class="sample">${inputValue} <span class="word-details">${
          data[0].meanings[0].partOfSpeech
        } ${data[0].phonetic}</span></h2>
        <div class="audio">
         <audio controls class="sound" onClick="soundOn"></audio>
        </div>
        </div>
        
        <p class="meaning">${data[0].meanings[0].definitions[0].definition}</p>
        <p class="example">${example ? example : "No example avaible!"}</p>
        </div>`;

        for (i = 0; i < data[0].phonetics.length; i++) {
          const element = data[0].phonetics[i];

          if (element.audio !== "") {
            const sound = document.querySelector(".sound");
            sound.setAttribute("src", element.audio);
            break;
          }
        }
      });
  });
}
function soundOn() {
  sound.play();
}
const sound = document
  .getElementById("dictionary")
  .addEventListener("click", displayDictionary);

// Here will the dictionary work
