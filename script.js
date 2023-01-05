function get(ele) {return document.querySelector(ele)};

let currentTemperature = 0;

// replace config.api_key with your own Open Weather Map API key to make app run;
const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?appid=${config.api_key}`;
const searchForm = document.querySelector('form');
const cityInput = document.querySelector('input');
// -----------------------------------------

// ES6 Then Catch

// const weatherPromise = fetch(weatherAPI);

// weatherPromise
//   .then( result =>  result.json() )
//   .then( result => {
//     console.log(result.main.temp);
//     currentTemperature = result.main.temp;
//     displayTemp();
//   })
//   .catch((error) => {
//   console.log(error)
// });

// -----------------------------------------

// ES7 Async/Await
async function getWeatherByCity (city) {
  try {
    const weatherPromise = await fetch(weatherAPI+'q='+city);
    const result = await weatherPromise.json();
    console.log(result);
    const weatherDescription = result.weather[0].description.charAt(0).toUpperCase() + result.weather[0].description.slice(1);
    get('#output').innerHTML += 
      `<div>
        <h3 class='location'>${result.name + ' ' + result.sys.country}</h3>
        <h4 class='description'>${weatherDescription}</h4>
       </div>`;
    currentTemperature = result.main.temp;
    displayTemp();
  }
  catch(error) {
    console.log(error);
  }
}

async function getWeatherByCoords (coords) {
  try {
    const weatherPromise = await fetch(weatherAPI +'lat='+coords.latitude+'&lon=' + coords.longitude);
   // const weatherPromise = await fetch(weatherAPI +'lat='+ coords.latitude +'&lon='+ coords.longtitude);
    const result = await weatherPromise.json();
    const weatherDescription = result.weather[0].description.charAt(0).toUpperCase() + result.weather[0].description.slice(1);
    console.log(result);
    get('#output').innerHTML += 
      `<div>
        <h3 class='location'>${result.name + ' ' + result.sys.country}</h3>
        <h4 class='description'>${weatherDescription}</h4>
       </div>`;
    currentTemperature = result.main.temp;
    displayTemp();
  }
  catch(error) {
    console.log(error);
  }
}

// -----------------------------------------
function displayTemp() {
  // C = K - 273.15
  let c = currentTemperature - 273.15;
  // uncomment to test whether background image changes according to temperature;
   // c = -2;
   // c = 10;
   // c = 22;
  
  // F = K * (9 / 5) - 459.67;
  const f = currentTemperature * (9 / 5) - 459.67;
  
  get('#output').innerHTML += `<div class='temp'>Temp C = ${c.toFixed(1)}C</div>`;
  get('#output').innerHTML += `<div class='temp'>Temp F = ${f.toFixed(1)}F</div>`;
  
  if (c < 0) {
    get('body').style.backgroundImage = "url('https://cissystar.github.io/images/Snow.webp')";
  } else if (c < 20) {
    get('body').style.backgroundImage = "url('https://cissystar.github.io/images/Sunnny.jpeg')";
  } else if (c >= 20){
    get('body').style.backgroundImage = "url('https://cissystar.github.io/images/Beach.jpg')";
  } 
}


function submit(event) {
  event.preventDefault();
  const city = cityInput.value;
  get('#output').innerHTML = '';
  getWeatherByCity(city);
  cityInput.value = '';
} 

searchForm.addEventListener('submit', submit);

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
  getWeatherByCoords(pos.coords);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);