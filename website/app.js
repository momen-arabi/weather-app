/* Global Variables */
const apiKey = "5038a449711c8aed81df2e53445046d7"; // personal API Key

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+1+'.'+ d.getDate()+'.'+ d.getFullYear();

// CLick Genearte Action
document.getElementById('generate').addEventListener('click', () => {
  const zip = document.getElementById('zip').value; // getting value of entered ZIP code
  const content = document.getElementById('feelings').value; // getting value of entered content in the feeling textbox
  getTemp(apiKey, zip) // calling the getTemp async function to get the temperature from the API using ZIP code and API key
  .then((temperature) => {
    postTempData('/postData', {
      date: newDate,
      temp: temperature,
      content: content,
    });
  }) // calling the postTempData async function to post the date, temperature and feeling to the projectData object in the server side
  getTempData() // calling the getTempData async function to get all projectData values
  .then((allRequiredData) => {
    updateUI(allRequiredData);
  }); // calling the updateUI async function to update the UI (date, temperature and feeling)
});

// Fetch API for Temperature
const getTemp = async (apiKey,zip) => {
  const temp = await fetch(`http://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apiKey}&units=metric`); // fetching temperature data using API key and ZIP code
  if (!zip) {
    alert('Please add the ZIP code!');
    return false;
  } // getting alert message if ZIP code wasn't entered
  else {
    try {
      const tempData = await temp.json();
      return tempData.main.temp;
    } // returning the temperature to be used for the next promise (postTempData)
    catch(error) {
      console.log('Error:', error)
    } // catching error and logging it in case there is an error fetching the data
  }
}

// Post Tempdata
// posting all required data (temp, date and feeling) and using the postdata endpoint in the server side
const postTempData = async (url,data) => {
  const postRes = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {'Content-Type': 'application/json',},
    body: JSON.stringify(data),
  })
  try {
    const postData = await postRes.json(); // awaiting and changing post data to JSON form
  }
  catch(error) {
    console.log('Error:', error)
  }
}

// GET Tempdata
// getting all required data and adding it to the getdata endpoint
const getTempData = async () => {
  const getRes = await fetch('/getData', {
    credentials: 'same-origin',
  })
  try {
    const allTempData = await getRes.json();
    return allTempData;
  } // returning all requested temp data to be used for UI changes
  catch(error) {
    console.log('Error:', error)
  }
}

// Update UI
async function updateUI(allData) {
  const dateUI = await document.getElementById('date');
  dateUI.innerHTML = allData.date; // adding the date under the Most Recent Entry
  const tempUI = await document.getElementById('temp');
  tempUI.innerHTML = allData.temp + ` <sup>o</sup>C`; // adding the temperature in Celsius under the Most Recent Entry
  const contentUI = await document.getElementById('content');
  contentUI.innerHTML = allData.content; // adding the feeling under the Most Recent Entry
}
