<template>
  <!-- Loading Screen -->
  <div class="loading_overlay" v-if="Starting_Overlay">
    <div class="loading_container">
      <div class="loadingdiv overlay_loadingdiv_size"></div>
      <h2>Locating...</h2>
    </div>
  </div>

  <!-- Network Error Screen -->
  <div class="loading_overlay" v-if="Network_Error">
    <div class="loading_container">
      <h1>Network offline, Try Again later.</h1>
      <button @click="defaultLocation">Retry</button>
    </div>
  </div>

  <!-- Main Container -->
  <div class="container">

    <div class="hero_section">


      <video autoplay oncanplay="this.playbackRate = 0.7;" loop muted class="bgvideo" :src="ChangeBackgroundVideo()">
      </video>

      <div class="start">
        <p class="cityname"> <span> <img src="./assets/icons/location.png" alt=""> </span> {{ CityLocation }}</p>
        <div class="input_Search_Country_list_Container">
          <input type="text" @keydown.enter="MultipleCountries.length ? SelectCountry() : GetName()" required
            :disabled="Locating_Names" placeholder="Location..." name="search" class="SearchInput"
            v-model.trim="setinput">
          <div class="showhide" v-if="MultipleCountries">
            <div class="locationslist" :class="{ 'hoveredItem': index == selected }"
              v-for="(item, index) in MultipleCountries" :key="index"
              @click="GettingCoordFromLocations(item.lat, item.lon, item.CountryName, item.ProviceName, item.CityName, index)">
              <p>{{ item.CountryName }}, {{ item.ProviceName }}, {{ item.CityName }}</p>
            </div>
          </div>

          <button class="SearchBtn" @click="GetName()" :disabled="Locating_Names">
            <div v-if="Locating_Names" class="loadingdiv search_btn_loadingdiv_size"></div>
            <span v-else>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none"
                aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" stroke-width="2.4" />
                <path d="M15.6 15.6L20 20" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
              </svg>
            </span>
          </button>
        </div>

        <div class="LocationBtnContainer">
          <button class="LocationBtn" :disabled="locating" @click.stop="GettingCurrentLocation()">
            <span v-if="!locating">⦿</span>
            <div v-else class="loadingdiv location_btn_loadingdiv_size"></div>
          </button>
        </div>


      </div>

      <div class="weatherDetails">
        <div>
          <span class="bgtemp"> {{ CuttentTemp }}° </span>
          <span class="bgcondition"> {{ CuttentConditionMessage }} </span>
        </div>

        <div class="hourlytime">

          <div v-for="(item, index) in hourlyTempArray" :key="index">
            <p>{{ item.time }}</p>
            <div class="img">
              <img :src="ChangeImage(item.summary, item.unixtime)" alt="">
            </div>
            <p>{{ item.temp }}°C</p>
          </div>

        </div>

      </div>

    </div>


    <div class="wrapper"> <!-- Wrapper Start -->

      <div class="smallPanel"> <!-- Small Panel Start -->

        <div class="smallPanel_1">
          <h2>Now</h2>

          <div class="temprature">
            <h1> {{ CuttentTemp }}°C </h1>
            <div class="current_temp_img_container">
              <img :src="ChangeImage(CuttentConditionMessage, undefined)" alt="">
            </div>
          </div>

          <div class="date_location">

            <div class="Small_Panel_Date_Container">
              <div class="date_location_img_container"> <img src="./assets/icons/calendar.png" alt=""> </div>
              <p> {{ currenMonth }} {{ currenWeekDay }} {{ currenDate }} </p>
            </div>

            <div class="Small_Panel_Location_Container">
              <div class="date_location_img_container"> <img src="./assets/icons/location.png" alt=""> </div>
              <p> {{ Country }}, {{ Province }}, {{ CityLocation }}</p>
            </div>

          </div>

        </div>

        <div class="Small_Panel_Container">
          <h3 class="SmallPanelHeading">Weekly Forcast</h3>




          <div class="smallPanel_2">
            <h3 class="SmallPanelHeading_inside">Weekly Forcast</h3>

            <div class="weekly_days">

              <div class="day" v-for="(item, index) in WeekyDaysTempArray" :key="index">

                <div class="weekly_left">
                  <p class="rain_chances">{{ item.rainChances }}%</p>
                  <div class="weather_icon_container"> <img :src="ChangeImage(item.Condition, undefined)" alt="">
                  </div>
                  <p> {{ item.temp }}°C</p>
                </div>


                <p class="WeekDate">{{ item.Date }} {{ item.Month }}</p>
                <p class="WeekDay">{{ item.Day }}</p>

              </div>

            </div>

          </div>




        </div>

      </div> <!-- Small Panel End -->


      <div class="SecondLastBigPanel"> <!-- Big Panel Start -->

        <h1 class="BigPanelHeading">Today Highlights</h1>

        <div class="Wind_Sun_Humi_Pressure">


          <div class="WHSP_Parts_1"> <!-- Piece 1 -->

            <div class="airindex">
              <p>Air Index Quality</p>
              <p class="good" :class="AirQualityIndexColor()">{{ AirQualityIndex() }}</p>
            </div>

            <div class="airindex_info">
              <span><img src="./assets/icons/wind.png" alt=""></span>
              <div class="AQI_Units">
                <p>SO₂</p>
                <h1 @click="ShowUnit = !ShowUnit">{{ AirQuality.SO2 }}<span v-if="ShowUnit">µg/m³</span></h1>
              </div>
              <div class="AQI_Units">
                <p>NO₂</p>
                <h1 @click="ShowUnit = !ShowUnit">{{ AirQuality.NO2 }}<span v-if="ShowUnit">µg/m³</span></h1>
              </div>
              <div class="AQI_Units">
                <p>O₃</p>
                <h1 @click="ShowUnit = !ShowUnit">{{ AirQuality.O3 }}<span v-if="ShowUnit">µg/m³</span></h1>
              </div>
            </div>

          </div>


          <div class="WHSP_Parts_2"> <!-- Piece 2 -->

            <div class="SunRise">

              <p>SunRise</p>
              <h1><img src="./assets/icons/sunrise.png" alt="">{{ SunRise }}</h1>
            </div>

            <div class="SunSet">
              <p>SunSet</p>
              <h1><img src="./assets/icons/sunset.png" alt="">{{ SunSet }}</h1>
            </div>

          </div>


          <div class="WHSP_Parts"> <!-- Piece 3 -->

            <div>
              <p>Humidity</p>
              <div>
                <h1> <img src="./assets/icons/humidity.png" alt=""> {{ CuttentHumidity }} %</h1>
              </div>
            </div>

            <div>
              <p>Pressure</p>
              <div>
                <h1> <img src="./assets/icons/AirPressure.png" alt=""> {{ CuttentPressure }} hPa </h1>
              </div>
            </div>

          </div>


          <div class="WHSP_Parts" style="background-color: cornflowerblue;"> <!-- Piece 4 -->

            <div>
              <p>Visibility</p>
              <div>

                <h1><img src="./assets/icons/visibility.png" alt=""> {{ CuttentVisibility }} km</h1>
              </div>
            </div>

            <div>
              <p>Feels Like</p>
              <div>
                <h1> <img src="./assets/icons/feelsLike.png" alt=""> {{ CuttentFeelsLike }}°C</h1>
              </div>
            </div>

          </div>


        </div>

        <div>

          <h2 class="TimesHeading">Wind Speed</h2>

          <div class="times"> <!-- Times Start -->

            <div class="timesPart3 relocate_1st_Part"> <!-- Piece 7 -->

              <div class="windDiv">
                <p>Today</p>
                <div class="img">
                  <img src="./assets/icons/WindDirection.png" alt="">
                </div>
                <p>{{ CuttentWindSpeed }} km</p>
              </div>

              <div v-for="(item, index) in WeekyDaysTempArray" :key="index" class="windDiv">
                <p>{{ item.Day }}</p>
                <div class="img">
                  <img src="./assets/icons/WindDirection.png" alt="">
                </div>
                <p>{{ item.Wind }} km</p>
              </div>

            </div>

          </div> <!-- times end -->

        </div>

      </div> <!-- Second BigPanel End -->

    </div> <!-- Wrapper end -->
  </div>

  <!-- Toast message -->

  <Transition name="toast">
    <div v-if="toast.show" class="weather-toast" :class="`weather-toast--${toast.type}`" role="status"
      aria-live="polite">
      <div class="weather-toast__icon" aria-hidden="true">
        <svg v-if="toast.type === 'info'" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.2" />
          <path d="M12 10.5V16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
          <circle cx="12" cy="7.4" r="1.2" fill="currentColor" />
        </svg>

        <svg v-else viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.2" />
          <path d="M12 7V13" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
          <circle cx="12" cy="16.6" r="1.2" fill="currentColor" />
        </svg>
      </div>

      <p class="weather-toast__message">{{ toast.message }}</p>

      <button class="weather-toast__close" type="button" aria-label="Close notification" @click="closeNotify">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
        </svg>
      </button>

      <div class="weather-toast__timer"></div>
    </div>
  </Transition>

</template>

<style scoped>
@import url(./style.css);
</style>

<script setup>
import { ref } from 'vue';
let ShowUnit = ref(false);
import { setinput, GetName, hourlyTempArray, ChangeImage, CuttentConditionMessage, CuttentFeelsLike, CuttentHumidity, CuttentPressure, CuttentTemp, CuttentVisibility, CuttentWindSpeed, currenDate, currenWeekDay, currenMonth, CityLocation, Province, Country, SunRise, SunSet, WeekyDaysTempArray, AirQuality, AirQualityIndex, AirQualityIndexColor, GettingCurrentLocation, ChangeBackgroundVideo, MultipleCountries, GettingCoordFromLocations, selected, Starting_Overlay, Network_Error, defaultLocation, toast, closeNotify, Locating_Names, locating, SelectCountry } from './logic';
</script>