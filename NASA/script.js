const apiKey = "RecdWdLn8zOWMREwmO4qemUuZwbDRQBtnHfGBMrE";
const currentDate = new Date().toISOString().split("T")[0];

document.addEventListener("DOMContentLoaded", () => {
    getCurrentImageOfTheDay(); // This function is called so that the image of current date can be displayed.
    loadSearchHistory(); // This function is called so that the data of previously searched date can be render.


    // This event triggern when seach btn is clicked.
    document.getElementById("search-form").addEventListener("submit", function(event) {
        event.preventDefault();
        const date = document.getElementById("search-input").value;
        getImageOfTheDay(date); 
    });


    // This event triggern when seach btn is clicked.
    document.getElementById("search-history").addEventListener("click", function(event) {
        if (event.target.tagName === 'LI') {
            const date = event.target.textContent;
            getImageOfTheDay(date);
        }
    });
});


// This function fetch data of current date pass it to function displayImage.
function getCurrentImageOfTheDay() {
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${currentDate}`)
        .then(response => response.json())
        .then(data => {
            displayImage(data);
        })
        .catch(error => console.error("Error fetching current image:", error));
}


// This function fetch data of current date and pass it to function displayImage.
function getImageOfTheDay(date) {
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`)
        .then(response => response.json())
        .then(data => {
            displayImage(data);
            saveSearch(date);
            addSearchToHistory(date);
        })
        .catch(error => console.error("Error fetching image:", error));
}


// This function render the recieved data to display.
function displayImage(data) {
    const container = document.getElementById("current-image-container");
    container.innerHTML = `
        <h2>${data.title}</h2>
        <p>${data.date}</p>
        <img src="${data.url}" alt="${data.title}">
        <p>${data.explanation}</p>
    `;
}


// This saves a search date to local storage if it is not already saved.
function saveSearch(date) {
    let searches = JSON.parse(localStorage.getItem("searches")) || [];
    if (!searches.includes(date)) {
        searches.push(date);
        localStorage.setItem("searches", JSON.stringify(searches));
    }
}


// This function loads the search history from local storage and displays it on the page.
function loadSearchHistory() {
    const searches = JSON.parse(localStorage.getItem("searches")) || [];
    searches.forEach(date => {
        addSearchToHistory(date);
    });
}


// This function adds a date to the search history list in the UI if it is not present.
function addSearchToHistory(date) {
    // Get the search history list element
    const searchHistory = document.getElementById("search-history");
    
    // Create a flag to check if the date is already in the list
    let dateExists = false;

    // Loop through the children of the search history list
    for (let i = 0; i < searchHistory.children.length; i++) {
        // If the text content of a list item matches the date, set the flag to true
        if (searchHistory.children[i].textContent === date) {
            dateExists = true;
            break;
        }
    }

    // If the date is not in the list, add it
    if (!dateExists) {
        const listItem = document.createElement("li");
        listItem.textContent = date;
        searchHistory.appendChild(listItem);
    }
}

