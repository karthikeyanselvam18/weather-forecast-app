import {
  faCloud,
  faCloudBolt,
  faCloudMoon,
  faCloudMoonRain,
  faCloudRain,
  faCloudShowersHeavy,
  faCloudSun,
  faCloudSunRain,
  faSmog,
  faSnowflake,
  faTemperatureEmpty,
  faTemperatureHalf,
  faTemperatureQuarter,
  faWater,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

interface Weather {
  temp: number;
  desc: string;
  humidity: number;
  pressure: number;
  windSpeed: number;
  dt: Date;
}

export interface IWeatherDetailsProps {}

function WeatherDetails(props: IWeatherDetailsProps) {
  let { lat, lon, cityName } = useParams<{
    lat: string;
    lon: string;
    cityName: string;
  }>();

  const API_KEY = process.env.REACT_APP_OPEN_WEATHER_API;
  const [forecastData, setForecastData] = useState<any[]>([]);

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
    )
      .then((res) => res.json())
      .then((data) => {
        const fiveDaysForecast = extractFiveDaysForecast(data.list);
        setForecastData(fiveDaysForecast);
      });
  }, [cityName]);

  function extractFiveDaysForecast(list: any) {
    const dailyForecast: any[] = [];
    const uniqueDays: { [key: string]: boolean } = {};
    list.forEach((item: any) => {
      const date = item.dt_txt.split(" ")[0];
      if (!uniqueDays[date]) {
        uniqueDays[date] = true;
        dailyForecast.push(item);
      }
    });
    return dailyForecast.slice(0, 6);
  }

  const getWeatherDesc = (desc: string, icon: string) => {
    let descElement;
    if (icon == "01d" || icon == "01n")
      descElement = (
        <>
          {desc}{" "}
          <FontAwesomeIcon icon={icon == "01d" ? faCloudSun : faCloudMoon} />
        </>
      );
    if (icon == "02d" || icon == "02n")
      descElement = (
        <>
          {desc}{" "}
          <FontAwesomeIcon icon={icon == "02d" ? faCloudSun : faCloudMoon} />
        </>
      );
    if (icon == "03d" || icon == "03n")
      descElement = (
        <>
          {desc} <FontAwesomeIcon icon={faCloud} />
        </>
      );
    if (icon == "04d" || icon == "04n")
      descElement = (
        <>
          {desc} <FontAwesomeIcon icon={faCloud} />
        </>
      );
    if (icon == "09d" || icon == "09n")
      descElement = (
        <>
          {desc} <FontAwesomeIcon icon={faCloudShowersHeavy} />
        </>
      );
    if (icon == "10d" || icon == "10n")
      descElement = (
        <>
          {desc}{" "}
          <FontAwesomeIcon
            icon={icon == "10d" ? faCloudSunRain : faCloudMoonRain}
          />
        </>
      );
    if (icon == "11d" || icon == "11n")
      descElement = (
        <>
          {desc} <FontAwesomeIcon icon={faCloudBolt} />
        </>
      );
    if (icon == "13d" || icon == "13n")
      descElement = (
        <>
          {desc} <FontAwesomeIcon icon={faSnowflake} />
        </>
      );
    if (icon == "50d" || icon == "50n")
      descElement = (
        <>
          {desc} <FontAwesomeIcon icon={faSmog} />
        </>
      );
    return descElement;
  };

  const getTempIcon = (temp: number) => {
    let tempIcon = faTemperatureHalf;
    const tempInCelcius = (temp - 273.15).toFixed(2);
    if (temp <= -10) tempIcon = faTemperatureEmpty;
    if (temp > -10 && temp <= 10) tempIcon = faTemperatureQuarter;
    if (temp >= 10 && temp <= 30) tempIcon = faTemperatureHalf;
    return (
      <>
        {tempInCelcius}&deg;
        <FontAwesomeIcon icon={tempIcon} />
      </>
    );
  };

  return (
    <div className="flex h-dvh w-full items-center justify-center ">
      {forecastData.length > 0 && (
        <div className=" flex items-center w-10/12 md:w-auto mx-auto flex-col gap-10  rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-5 md:flex-row ">
          <div className="text-white flex flex-col gap-3  ">
            <div className="flex flex-col items-center">
              <h1 className="text-xl font-bold">{cityName}</h1>
              <span className="text-base">
                {getWeatherDesc(
                  forecastData[0].weather[0].description,
                  forecastData[0].weather[0].icon,
                )}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-5">
              <h1 className="text-5xl font-light">
                {getTempIcon(forecastData[0].main.temp)}
              </h1>
              <div className="grid grid-cols-2 gap-3">
               
                <div className="flex flex-col items-center">
                  <span className="text-lg font-normal">
                    {getTempIcon(forecastData[0].main.temp_min)}
                  </span>
                  <span className="text-center text-sm">Min. Temp.</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-normal">
                    {getTempIcon(forecastData[0].main.temp_max)}
                  </span>
                  <span className="text-center text-sm">Max. Temp.</span>
                </div>
                 <div className="flex flex-col items-center">
                  <span className="text-lg font-normal">
                    <FontAwesomeIcon icon={faWater} />{" "}
                    {forecastData[0].main.humidity}%
                  </span>
                  <span className="text-center text-sm">Humidity</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-normal">
                    <FontAwesomeIcon icon={faWind} />{" "}
                    {forecastData[0].wind.speed} km/h
                  </span>
                  <span className="text-center text-sm">Wind Speed</span>
                </div>
              </div>
            </div>
          </div>
          <div className=" grid items-center grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3">
            {forecastData.map((data, index) => {
              if (index != 0) {
                return (
                  <div
                    key={index}
                    className="flex size-full p-3 flex-col items-center justify-center bg-white bg-opacity-65 rounded shadow-md "
                  >
                    <span className="font-semibold">
                      {new Date(data.dt_txt)
                        .getDate()
                        .toString()
                        .padStart(2, "0")}
                      /
                      {(new Date(data.dt_txt).getMonth() + 1)
                        .toString()
                        .padStart(2, "0")}
                    </span>
                    <span className="text-xs">{data.weather[0].description}</span>
                    <span className="font-normal">
                      {getTempIcon(data.main.temp)}
                    </span>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherDetails;
