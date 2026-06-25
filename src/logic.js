import { ref, reactive, onBeforeUnmount, onMounted } from "vue";

// Videos
const Cloudy = 'https://github.com/AR1Ablock/weather_media/raw/refs/heads/main/videos/Cloudy.mp4';
const Stormy = 'https://github.com/AR1Ablock/weather_media/raw/refs/heads/main/videos/Storm.mp4';
const Rainy ='https://github.com/AR1Ablock/weather_media/raw/refs/heads/main/videos/Rain.mp4';
const Foggy = 'https://github.com/AR1Ablock/weather_media/raw/refs/heads/main/videos/Foggy.mp4';
const Snow ='https://github.com/AR1Ablock/weather_media/raw/refs/heads/main/videos/Snow.mp4';
const Sunny = 'https://github.com/AR1Ablock/weather_media/raw/refs/heads/main/videos/Sunny.mp4';
const Clear = 'https://github.com/AR1Ablock/weather_media/raw/refs/heads/main/videos/Clear.mp4';
const Overcast = 'https://github.com/AR1Ablock/weather_media/raw/refs/heads/main/videos/Overcast.mp4';
const Night = 'https://github.com/AR1Ablock/weather_media/raw/refs/heads/main/videos/Night.mp4';
const SandDust = 'https://github.com/AR1Ablock/weather_media/raw/refs/heads/main/videos/Sand_Dust_storm.mp4';

// icons
import Sunny_ico from './assets/condtions/sunny.png';
import Cloudy_ico from './assets/condtions/cloudy.png';
import Storm_ico from './assets/condtions/storm.png';
import Sand_ico from './assets/condtions/sand.png';
import Dust_ico from './assets/condtions/dust.png';
import Hurricane_ico from './assets/condtions/hurricane.png';
import Rainy_ico from './assets/condtions/rainy.png';
import Overcast_ico from './assets/condtions/overcast.png';
import MostlyCloudy_ico from './assets/condtions/mostlyCloudy.png';
import PartlySunny_ico from './assets/condtions/partlySunny.png';
import Hmfs_ico from './assets/condtions/hmfs.png';
import Snow_ico from './assets/condtions/snow.png';
import Cold_ico from './assets/condtions/cold.png';
import Default_ico from './assets/condtions/Default_PartlyCloudy.png';

let latitude = ref();
let longitude = ref();
export let setinput = ref('');
export let CuttentTemp = ref('');
export let CuttentPressure = ref('');
export let CuttentHumidity = ref('');
export let CuttentVisibility = ref('');
export let CuttentFeelsLike = ref('');
export let CuttentWindSpeed = ref('');
export let CuttentConditionMessage = ref('');
export let hourlyTempArray = ref([]);
export let WeekyDaysTempArray = ref([]);
export let LocationNameKey = ref();
export let currenDate = ref('');
export let currenWeekDay = ref('');
export let currenMonth = ref('');
export let CityLocation = ref('');
export let Province = ref('');
export let Country = ref('');
export let SunRise = ref('');
export let SunSet = ref('');
export let AirQuality = ref({});
let WeatherConditionCheckArray = ref([]);
let PerDayTempAverage = ref(0);
let ObjForWeeklyTempArray = ref({});
export let MultipleCountries = ref([]);
let SRSSCT = ref({});
let weatherRainChances = ref([]);
let IsCountriesListShowing = ref(false);
export let Locating_Names = ref(false);
export let Starting_Overlay = ref(false);
export let Network_Error = ref(false);
export let locating = ref(false);
export const toast = reactive({
    show: false,
    message: "",
    type: "info", // "info" | "error"
});

let toastTimer = null;


// for get things time related things.
function gettingCurrentDTMY(string, date, week, month, time, Hours) {
    try {
        if (string != undefined) {
            let rawdate = new Date(string * 1000);
            let weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });
            let currenDate = rawdate.getDate();
            let currenWeekDay = weekdays[rawdate.getDay()];
            let currenMonth = monthFormatter.format(rawdate);
            // SunSR
            let hours = rawdate.getHours();
            let minutes = rawdate.getMinutes();
            let period = hours >= 12 ? 'PM' : 'AM';
            let formattedHours = hours % 12 === 0 ? 12 : hours % 12;
            let formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
            if (date == 1) {
                return currenDate;
            }
            if (week == 1) {
                return currenWeekDay;
            }
            if (month == 1) {
                return currenMonth;
            }
            if (Hours == 1) {
                let dayminutes = hours * 60 + minutes;
                return dayminutes;
            }
            if (time == 1) {
                return `${formattedHours}:${formattedMinutes} ${period}`;
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}




// for checking conditions from array and return on priority.
function determineDayWeatherCondition(weatherConditionsArray) {
    try {
        const weatherConditionsOrder = [
            'Rainy',
            'Rain',
            'Raining',
            'Rainy shower',
            'Showers',
            'Shower',
            'Drizzle',
            'Hurricane',
            'Stormy',
            'Storm',
            'Thunderstorm',
            'Thunder storm',
            'Tropical Storm',
            'Tropical storm',
            'Sandstorm',
            'Sand storm',
            'Sand',
            'Dust',
            'Duststorm',
            'Dust storm',
            'Haze',
            'Fog',
            'Mist',
            'Smoke',
            'Overcast',
            'Cloudy',
            'Clouds',
            'Cloud',
            'Mostly cloudy',
            'Mostly clouds',
            'Partly cloudy',
            'Partly clouds',
            'Sunny',
            'Mostly Sunny',
            'Partly Sunny',
            'Hot',
            'Cold',
            'Snow',
            'Snowing',
            'Snow fall',
            'Snow falling',
            'Sleet',
            'Hail',
            'Blizzard',
            'Clear',
            'Mostly clear',
            'Partly clear',
        ];

        for (const condition of weatherConditionsOrder) {
            if (weatherConditionsArray.some(weather => weather === condition)) {
                return condition;
            }
        }
        return 'Cloudy'; // If no match is found        
    } catch (error) {
        console.log(error.message);
    }
}




// function to change background video based on current conditon not whole day condition.
export function ChangeBackgroundVideo() {
    try {
        let CheckingCondition = CuttentConditionMessage.value;
        if ((gettingCurrentDTMY(SRSSCT.value.cT, 0, 0, 0, 0, 1) >= gettingCurrentDTMY(SRSSCT.value.ss, 0, 0, 0, 0, 1) || gettingCurrentDTMY(SRSSCT.value.cT, 0, 0, 0, 0, 1) <= gettingCurrentDTMY(SRSSCT.value.sr, 0, 0, 0, 0, 1)) && (CuttentConditionMessage.value == 'Clear' || CuttentConditionMessage.value == 'Mostly clear' || CuttentConditionMessage.value == 'clear' || CuttentConditionMessage.value == 'Sunny' || CuttentConditionMessage.value == 'Mostly sunny')) {
            return Night;
        }
        else {
            switch (CheckingCondition) {
                case 'Clear':
                case 'clear':
                case 'Mostly clear':
                    return Clear;
                case 'Sunny':
                case 'Mostly sunny':
                    return Sunny;
                case 'Partly clear':
                case 'Cloudy':
                case 'Cloud':
                case 'Clouds':
                case 'Mostly cloudy':
                case 'Mostly clouds':
                case 'Partly cloudy':
                case 'Partly sunny':
                    return Cloudy;
                case 'Thunderstorm':
                case 'Thunder storm':
                case 'Thunder Storm':
                case 'Thunderstorm':
                case 'Tropical storm':
                case 'Storm':
                case 'Stormy':
                    return Stormy;
                case 'Sandstorm':
                case 'Sand storm':
                case 'Sand':
                case 'Dust':
                case 'Duststorm':
                case 'Dust storm':
                    return SandDust;
                case 'Rain shower':
                case 'Rain':
                case 'Rainy':
                case 'Rainy shower':
                case 'Raining':
                case 'Drizzle':
                case 'Showers':
                case 'Shower':
                case 'Hurricane':
                    return Rainy;
                case 'Haze':
                case 'Mist':
                case 'Fog':
                case 'Smoke':
                    return Foggy;
                case 'Overcast':
                    return Overcast;
                case 'Snow':
                case 'Snowing':
                case 'Snow fall':
                case 'Snow falling':
                case 'Sleet':
                case 'Hail':
                case 'Blizzard':
                    return Snow;
                default:
                    return Cloudy;
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}




// return image based on conditions and time to show it.
export function ChangeImage(summary, time) {
    try {
        if ((gettingCurrentDTMY(time, 0, 0, 0, 0, 1) >= gettingCurrentDTMY(SRSSCT.value.ss, 0, 0, 0, 0, 1) || gettingCurrentDTMY(time, 0, 0, 0, 0, 1) <= gettingCurrentDTMY(SRSSCT.value.sr, 0, 0, 0, 0, 1)) && (summary == 'Clear' || summary == 'Mostly clear' || summary == 'clear' || summary == 'Sunny' || summary == 'Mostly sunny')) {
            return 'https://cdn-icons-png.flaticon.com/128/3982/3982176.png';
        }

        else {
            switch (summary) {
                case 'Clear':
                case 'clear':
                case 'Mostly clear':
                case 'Sunny':
                case 'Mostly sunny':
                    return Sunny_ico;
                case 'Partly clear':
                case 'Partly cloudy':
                case 'Partly clouds':
                case 'Partly sunny':
                case 'Cloudy':
                case 'Cloud':
                case 'Clouds':
                    return Cloudy_ico;
                case 'Thunderstorm':
                case 'Thunder Storm':
                case 'Thunder storm':
                case 'Storm':
                case 'Stormy':
                case 'Tropical storm':
                    return Storm_ico;
                case 'Sandstorm':
                case 'Sand storm':
                case 'Sand':
                    return Sand_ico;
                case 'Dust':
                case 'Duststorm':
                case 'Dust storm':
                    return Dust_ico;
                case 'Rain shower':
                case 'Rain':
                case 'Raining':
                case 'Rainy':
                case 'Rainy shower':
                case 'Drizzle':
                case 'Showers':
                case 'Shower':
                    return Rainy_ico;
                case 'Hurricane':
                    return Hurricane_ico
                case 'Overcast':
                    return Overcast_ico;
                case 'Mostly cloudy':
                case 'Mostly clouds':
                    return MostlyCloudy_ico;
                case 'Partly sunny':
                    return PartlySunny_ico;
                case 'Haze':
                case 'Mist':
                case 'Fog':
                case 'Smoke':
                    return Hmfs_ico;
                case 'Snow':
                case 'Snowing':
                case 'Snow fall':
                case 'Snow falling':
                case 'Sleet':
                case 'Hail':
                case 'Blizzard':
                    return Snow_ico;
                case 'Cold':
                    return Cold_ico;
                default:
                    return Default_ico;
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}




// return air quality text.
export function AirQualityIndex() {
    let AQI = AirQuality.value.AQI;
    try {
        switch (AQI) {
            case 1:
                return 'Great';
            case 2:
                return 'Good';
            case 3:
                return 'Moderate';
            case 4:
                return 'Sensitive';
            case 5:
                return 'Unhealthy';
            default: if (AQI > 5)
                return 'Dangerous'
            else
                return 'Checking';
        }
    } catch (error) {
        console.log(error.message);
    }
}




// return class name so color get applied.
export function AirQualityIndexColor() {
    let AQI = AirQuality.value.AQI;
    try {
        switch (AQI) {
            case 1:
                return 'Great';
            case 2:
                return 'Good';
            case 3:
                return 'Moderate';
            case 4:
                return 'Sensitive';
            case 5:
                return 'Unhealthy';
            default: if (AQI > 5)
                return 'Dangerous'
            else
                return 'Checking';
        }
    } catch (error) {
        console.log(error.message);
    }
}




function RainChancesPercentage(condition) {
    try {
        let isRain = 0;
        let matchConditions = ['Rain shower', 'Rain', 'Raining', 'Rainy', 'Rainy shower', 'Drizzle', 'Showers', 'Shower', 'Hurricane'];
        condition.forEach(element => {
            if (matchConditions.includes(element)) {
                isRain += 1;
            }
        });
        let result = (isRain / 8 * 100).toFixed(0);
        return result;
    } catch (error) {
        console.log(error.message);
    }
}




// main function to fetch Hourly  and weekly of 5 days data.
async function GettingHourlyAndWeeklyWeather() {
    try {
        const url1 = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude.value}&lon=${longitude.value}&appid=ca69ed71e3e9415e36b49cc4683189f6`;
        let rawdata = await fetch(url1);
        let data = await rawdata.json();
        for (let i = 1; i <= 8; i++) {
            let hourlyData = {
                temp: (data.list[i].main.temp - 273.15).toFixed(0),
                time: gettingCurrentDTMY(data.list[i].dt, 0, 0, 0, 1, 0),
                unixtime: data.list[i].dt,
                summary: data.list[i].weather[0].main,
            }
            hourlyTempArray.value.push(hourlyData);
        }
        // Weekly data
        for (let j = 0; j <= 39; j++) {
            PerDayTempAverage.value += data.list[j].main.temp - 273.15;
            WeatherConditionCheckArray.value.push(data.list[j].weather[0].main);
            weatherRainChances.value.push(data.list[j].weather[0].main);

            if (j == 7 || j == 15 || j == 23 || j == 31 || j == 39) {

                if (j == 7) {
                    ObjForWeeklyTempArray.value = {
                        temp: (PerDayTempAverage.value / 8).toFixed(0),
                        Condition: determineDayWeatherCondition(WeatherConditionCheckArray.value),
                        Day: gettingCurrentDTMY(data.list[j - 3].dt, 0, 1, 0, 0, 0),
                        Date: gettingCurrentDTMY(data.list[j - 3].dt, 1, 0, 0, 0, 0),
                        Month: gettingCurrentDTMY(data.list[j - 3].dt, 0, 0, 1, 0, 0),
                        Wind: data.list[j - 3].wind.speed,
                        rainChances: RainChancesPercentage(weatherRainChances.value)
                    }
                    WeekyDaysTempArray.value.push(ObjForWeeklyTempArray.value);
                    PerDayTempAverage.value = 0;
                    WeatherConditionCheckArray.value.splice(0, WeatherConditionCheckArray.value.length);
                    weatherRainChances.value.splice(0, weatherRainChances.value.length);
                }

                if (j == 15) {
                    ObjForWeeklyTempArray.value = {
                        temp: (PerDayTempAverage.value / 8).toFixed(0),
                        Condition: determineDayWeatherCondition(WeatherConditionCheckArray.value),
                        Day: gettingCurrentDTMY(data.list[j - 3].dt, 0, 1, 0, 0, 0),
                        Date: gettingCurrentDTMY(data.list[j - 3].dt, 1, 0, 0, 0, 0),
                        Month: gettingCurrentDTMY(data.list[j - 3].dt, 0, 0, 1, 0, 0),
                        Wind: data.list[j - 3].wind.speed,
                        rainChances: RainChancesPercentage(weatherRainChances.value)
                    }
                    WeekyDaysTempArray.value.push(ObjForWeeklyTempArray.value);
                    PerDayTempAverage.value = 0;
                    WeatherConditionCheckArray.value.splice(0, WeatherConditionCheckArray.value.length);
                    weatherRainChances.value.splice(0, weatherRainChances.value.length);
                }

                if (j == 23) {
                    ObjForWeeklyTempArray.value = {
                        temp: (PerDayTempAverage.value / 8).toFixed(0),
                        Condition: determineDayWeatherCondition(WeatherConditionCheckArray.value),
                        Day: gettingCurrentDTMY(data.list[j - 3].dt, 0, 1, 0, 0, 0),
                        Date: gettingCurrentDTMY(data.list[j - 3].dt, 1, 0, 0, 0, 0),
                        Month: gettingCurrentDTMY(data.list[j - 3].dt, 0, 0, 1, 0, 0),
                        Wind: data.list[j - 3].wind.speed,
                        rainChances: RainChancesPercentage(weatherRainChances.value)
                    }
                    WeekyDaysTempArray.value.push(ObjForWeeklyTempArray.value);
                    PerDayTempAverage.value = 0;
                    WeatherConditionCheckArray.value.splice(0, WeatherConditionCheckArray.value.length);
                    weatherRainChances.value.splice(0, weatherRainChances.value.length);
                }

                if (j == 31) {
                    ObjForWeeklyTempArray.value = {
                        temp: (PerDayTempAverage.value / 8).toFixed(0),
                        Condition: determineDayWeatherCondition(WeatherConditionCheckArray.value),
                        Day: gettingCurrentDTMY(data.list[j - 3].dt, 0, 1, 0, 0, 0),
                        Date: gettingCurrentDTMY(data.list[j - 3].dt, 1, 0, 0, 0, 0),
                        Month: gettingCurrentDTMY(data.list[j - 3].dt, 0, 0, 1, 0, 0),
                        Wind: data.list[j - 3].wind.speed,
                        rainChances: RainChancesPercentage(weatherRainChances.value)
                    }
                    WeekyDaysTempArray.value.push(ObjForWeeklyTempArray.value);
                    PerDayTempAverage.value = 0;
                    WeatherConditionCheckArray.value.splice(0, WeatherConditionCheckArray.value.length);
                    weatherRainChances.value.splice(0, weatherRainChances.value.length);
                }

                if (j == 39) {
                    ObjForWeeklyTempArray.value = {
                        temp: (PerDayTempAverage.value / 8).toFixed(0),
                        Condition: determineDayWeatherCondition(WeatherConditionCheckArray.value),
                        Day: gettingCurrentDTMY(data.list[j - 3].dt, 0, 1, 0, 0, 0),
                        Date: gettingCurrentDTMY(data.list[j - 3].dt, 1, 0, 0, 0, 0),
                        Month: gettingCurrentDTMY(data.list[j - 3].dt, 0, 0, 1, 0, 0),
                        Wind: data.list[j - 3].wind.speed,
                        rainChances: RainChancesPercentage(weatherRainChances.value)
                    }
                    WeekyDaysTempArray.value.push(ObjForWeeklyTempArray.value);
                    PerDayTempAverage.value = 0;
                    WeatherConditionCheckArray.value.splice(0, WeatherConditionCheckArray.value.length);
                    weatherRainChances.value.splice(0, weatherRainChances.value.length);
                }
            }
        }
        setTimeout(() => {
            Starting_Overlay.value = false;
            document.body.style.overflow = "auto";
            closeNotify();
            setinput.value = '';
        }, 1000);
    } catch (error) {
        console.log(error.message);
    }
}




// return air quality.
export async function GettingCurrentWeatherAirDetails() {
    try {
        const url3 = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude.value}&lon=${latitude.value}&appid=ca69ed71e3e9415e36b49cc4683189f6`;
        let rawdata = await fetch(url3);
        let data = await rawdata.json();
        AirQuality.value = {
            SO2: data.list[0].components.so2,
            NO2: data.list[0].components.no2,
            O3: data.list[0].components.o3,
            AQI: data.list[0].main.aqi,
        }
    } catch (error) {
        console.log(error.message);
    }
};




// main function to fetching all current data.
async function GettingCurrentFullWeather() {
    try {
        let url4 = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude.value}&lon=${longitude.value}&appid=ca69ed71e3e9415e36b49cc4683189f6`;
        let rawdata = await fetch(url4);
        let data = await rawdata.json();
        SRSSCT.value = {
            ss: data.sys.sunset,
            sr: data.sys.sunrise,
            cT: data.dt
        }
        SunSet.value = gettingCurrentDTMY(data.sys.sunset, 0, 0, 0, 1, 0);
        SunRise.value = gettingCurrentDTMY(data.sys.sunrise, 0, 0, 0, 1, 0);
        CuttentConditionMessage.value = data.weather[0].main;
        CuttentTemp.value = ((data.main.temp - 273.15).toFixed(0));
        CuttentPressure.value = data.main.pressure;
        CuttentHumidity.value = data.main.humidity;
        CuttentFeelsLike.value = (data.main.feels_like - 273.15).toFixed(0);
        CuttentWindSpeed.value = data.wind.speed;
        CuttentVisibility.value = (data.visibility / 1000).toFixed(0);
        let unixdate = data.dt;
        currenDate.value = gettingCurrentDTMY(unixdate, 1, 0, 0, 0, 0);
        currenWeekDay.value = gettingCurrentDTMY(unixdate, 0, 1, 0, 0, 0);
        currenMonth.value = gettingCurrentDTMY(unixdate, 0, 0, 1, 0, 0);
    } catch (error) {
        console.log(error.message);
    }
};



// function attached with location btn.
export function GettingCurrentLocation() {
    if (locating.value) return;
    if (!navigator.onLine) {
        Network_Error_Occured();
        return;
    }
    locating.value = true;
    closeNotify();
    try {
        if ('geolocation' in navigator) {
            navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
                if (result.state === 'granted') {
                    // geolocation access is granted
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            latitude.value = position.coords.latitude;
                            longitude.value = position.coords.longitude;
                            if (latitude.value !== undefined && longitude.value !== undefined) {
                                console.log('Current Location\n\n', 'latitude = ', latitude.value, 'longitude = ', longitude.value);
                                RunAllFUnctions();
                                ReverseGeoCoding_NamesFromCordLatLon();
                                locating.value = false;
                            }
                            else {
                                locating.value = false;
                                notify('location Coordinates Not Found', 'info');
                                return;
                            }
                        }, (error) => notify(error.message, 'error'));

                } else if (result.state === 'prompt') {
                    notify('Ask Location Permission', 'info');

                } else if (result.state === 'denied') {
                    locating.value = false;
                    notify('location Accessing Permission Denied', 'info');
                    return;
                }
            });

        } else {
            console.log('geolocation not available in this browser');
            return;
        }
    } catch (error) {
        console.log(error.message)
    }
    finally {
        locating.value = false;
    }
}




// function attached execute with above one.
async function ReverseGeoCoding_NamesFromCordLatLon() {
    try {
        let url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude.value}&lon=${longitude.value}&limit=1&appid=ca69ed71e3e9415e36b49cc4683189f6`;
        let rawdata = await fetch(url);
        let data = await rawdata.json();;
        CityLocation.value = data[0].name;
        Province.value = data[0].state;
        Country.value = data[0].country;
        saveLastLocation({ lat: latitude.value, lon: longitude.value, CountryName: data[0].country, ProvinceName: data[0].state, CityName: data[0].name });
    } catch (error) {
        console.log(error.message);
    }
}




// function attach with returned multiple locations and get parameters from choosed one.
export function GettingCoordFromLocations(lat, lon, CountryName, ProvinceName, CityName, Index) {
    try {
        latitude.value = lat;
        longitude.value = lon;
        CityLocation.value = CityName;
        Country.value = CountryName;
        Province.value = ProvinceName;
        RunAllFUnctions();
        MultipleCountries.value.splice(0, MultipleCountries.value.length);
        IsCountriesListShowing.value = false;
        saveLastLocation({ lat, lon, CountryName, ProvinceName, CityName });

    } catch (error) {
        console.log(error.message);
    }
}


const LAST_LOCATION_KEY = 'weather_last_location';

function saveLastLocation(location) {
    try {
        if (!location || location.lat == null || location.lon == null) return;
        localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(location));
    } catch (error) {
        console.log(error.message);
    }
}

function loadLastLocation() {
    try {
        const saved = localStorage.getItem(LAST_LOCATION_KEY);
        if (!saved) return null;
        return JSON.parse(saved);
    } catch (error) {
        console.log(error.message);
        return null;
    }
}

// function attached with search btn and enter key. 

let countryKeyListenerAdded = false;

export async function GetName() {
    try {
        if (Locating_Names.value) return;
        if (!navigator.onLine) {
            Network_Error_Occured();
            return;
        }

        Locating_Names.value = true;
        closeNotify();

        MultipleCountries.value.splice(0, MultipleCountries.value.length);

        let url = `https://api.openweathermap.org/geo/1.0/direct?q=${setinput.value}&limit=5&appid=ca69ed71e3e9415e36b49cc4683189f6`;

        if (setinput.value.trim() !== '') {
            let rawdata = await fetch(url);
            let data = await rawdata.json();
            if (Array.isArray(data) && data.length > 0) {
                data.forEach(element => {
                    let SingleCountryObject = {
                        CityName: element.name,
                        ProviceName: element.state,
                        CountryName: element.country,
                        lat: element.lat,
                        lon: element.lon
                    }
                    MultipleCountries.value.push(SingleCountryObject);
                });

                selected.value = 0;
                IsCountriesListShowing.value = true;


                    window.addEventListener('keydown', SelectCountry);

            }
            else {
                notify('Not a valid location name', 'error');
                Locating_Names.value = false;
            }
        }
        else {
            notify('Enter a location name', 'info');
        }
    }
    catch (error) {
        console.log(error.message);
    }
    finally {
        Locating_Names.value = false;
    }
}




// main functoin to execute functions.
let justRunOneTime = false;
function RunAllFUnctions() {
    try {
        document.addEventListener('DOMContentLoaded', () => {
            Starting_Overlay.value = true;
            document.body.style.overflow = "hidden";
        });
        if (justRunOneTime) {
            Starting_Overlay.value = true;
            document.body.style.overflow = "hidden";
        }
        hourlyTempArray.value.splice(0, hourlyTempArray.value.length);
        WeekyDaysTempArray.value.splice(0, WeekyDaysTempArray.value.length);
        //// functions
        GettingCurrentFullWeather();
        GettingHourlyAndWeeklyWeather();
        GettingCurrentWeatherAirDetails();
        justRunOneTime = true;
    } catch (error) {
        console.log(error.message);
    }
}




// for set a default location when page load.
export function defaultLocation() {
    if (!navigator.onLine) {
        Network_Error_Occured();
        return;
    }
    const saved = loadLastLocation();
    if (saved && saved.lat != null && saved.lon != null) {
        GettingCoordFromLocations(
            saved.lat,
            saved.lon,
            saved.CountryName,
            saved.ProvinceName,
            saved.CityName,
            0
        );
        return;
    }

    GettingCoordFromLocations(30.15, 72.67, 'Pakistan', 'Punjab', 'Burewala', 0);
}

defaultLocation();


window.addEventListener('online', () => {
    Network_Error.value = false;
    Starting_Overlay.value = true;
    document.body.style.overflow = "hidden";
    defaultLocation();
});


function Network_Error_Occured() {
    Network_Error.value = true;
    document.body.style.overflow = "hidden";
}


function closeLocationSuggestions() {
    MultipleCountries.value.splice(0, MultipleCountries.value.length);
    IsCountriesListShowing.value = false;
    selected.value = -1;
    window.removeEventListener('keydown', SelectCountry);
}


// A functionality to hide Shown Countries List when tap on outside the box.
try {
    document.addEventListener('click', (event) => {
        const suggestions = document.querySelector('.showhide');
        if (IsCountriesListShowing.value && suggestions && !suggestions.contains(event.target)) {
            closeLocationSuggestions();
        }
    });
} catch (error) {
    console.log(error.message);
}



window.addEventListener('keydown', (e) => {
    const searchInput = document.querySelector('.SearchInput');
    const isSearchFocused = searchInput === document.activeElement;

    if (!isSearchFocused) return;

    if (e.key === 'Delete') {
        e.preventDefault();
        setinput.value = '';
        return;
    }

    if (IsCountriesListShowing.value) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            SelectCountry(e);
            return;
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            SelectCountry(e);
            return;
        }
    }

    if (e.key === 'Enter') {
        e.preventDefault();
        GetName();
    }
});



// functionality to hover between list of countries and select one by enter key.
export let selected = ref(-1);

let SelectCountry = (e) => {
    try {
        if (!IsCountriesListShowing.value) return;

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                selected.value = selected.value > 0 ? selected.value - 1 : MultipleCountries.value.length - 1;
                break;

            case 'ArrowDown':
                e.preventDefault();
                selected.value = selected.value < MultipleCountries.value.length - 1 ? selected.value + 1 : 0;
                break;

            case 'Enter':
                e.preventDefault();
                e.stopPropagation();

                const index = selected.value >= 0 ? selected.value : 0;
                const item = MultipleCountries.value[index];

                if (item) {
                    GettingCoordFromLocations(
                        item.lat,
                        item.lon,
                        item.CountryName,
                        item.ProviceName,
                        item.CityName,
                        index
                    );
                } else {
                    GetName();
                }

                closeLocationSuggestions();
                break;
        }
    } catch (error) {
        console.log(error.message);
    }
}



export function closeNotify() {
    clearTimeout(toastTimer);
    toastTimer = null;
    toast.show = false;
}

function notify(message, type = "info") {
    const allowedTypes = ["info", "error"];

    toast.message = message;
    toast.type = allowedTypes.includes(type) ? type : "info";
    toast.show = true;

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        closeNotify();
    }, 5000);
}
