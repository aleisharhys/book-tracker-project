// Here will go the dictionary work

const dictionaryURL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
//This funtion will display the dictionary api data

function displayDictionary(event) {
  event.preventDefault();

  const button = document.querySelector(".dictionary-search-btn");
  const searchResult = document.querySelector(".search-result");

  button.addEventListener("click", () => {
    const inputValue = document.getElementById("dictionary-search").value;
    const wordResult = document.getElementById("word-result");

    wordResult.classList.remove("hidden");
    console.log(inputValue);
    //Api fetch : word, definition, pronunciation.
    fetch(`${dictionaryURL}${inputValue}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const example = data[0].meanings[0].definitions[0].example;

        searchResult.innerHTML = `<div class="word">
        <h2 class="sample">${inputValue} <span class="word-details">${data[0].meanings[0].partOfSpeech} ${data[0].phonetic}</span></h2>
        <div class="audio">
        <audio controls class="sound" onClick="soundOn"></audio>
        </div>
        </div>
        
        <p class="meaning">${data[0].meanings[0].definitions[0].definition}</p>
        <p class="example"></p>
        </div>`;
        //Will iterate through the array and find the exapmple avaible.
        for (i = 0; i < data[0].meanings[0].definitions.length; i++) {
          const exampleElement = data[0].meanings[0].definitions[i];

          if (exampleElement.example) {
            const exampleTxt = document.querySelector(".example");
            exampleTxt.innerHTML = exampleElement.example;
            break;
          }
        }

        for (i = 0; i < data[0].phonetics.length; i++) {
          const element = data[0].phonetics[i];

          if (element.audio !== "") {
            const sound = document.querySelector(".sound");
            sound.setAttribute("src", element.audio);
            break;
          }
        }
      });
    $("#dictionary-search").val("");
  });
}

//This function will trigger the audio in the dictionary

function soundOn() {
  sound.play();
}
const sound = document
  .getElementById("dictionary")
  .addEventListener("click", displayDictionary);

// Event listener on the search button to trigger a modal if there's no input value
// Claudio Redi's solution (edited by unknown user): https://stackoverflow.com/a/11404777
$("#dictionary-search-btn").on("click", function (e) {
  e.preventDefault();

  $("#noInputModalLabel").modal({ show: false });
  if ($("#dictionary-search").val() === "") {
    $("#noInputModalLabel").modal("show");
    return;
  }
});

// Here will the dictionary work
