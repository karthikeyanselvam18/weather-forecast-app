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

export interface IWeatherDetailsProps {
  lat: number;
  lon: number;
}

function WeatherDetails(props: IWeatherDetailsProps) {
  const { cityName } = useParams<{ cityName: string }>();
  const location = useLocation();
  const API_KEY = process.env.REACT_APP_OPEN_WEATHER_API;
  const [forecastData, setForecastData] = useState<any[]>([]);

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${props.lat}&lon=${props.lon}&appid=${API_KEY}`
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

  return (
    <div className="h-dvh flex justify-center items-center">
      {forecastData.length > 0 && (
        <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 flex flex-col gap-3 rounded-lg ">
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-bold">{cityName}</h1>
            <span className="text-base">
              {forecastData[0].weather[0].description}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-5xl font-light">
              {(forecastData[0].main.temp - 273.15).toFixed(1)}&deg;C
            </h1>
            <div className="flex justify-center items-center gap-5">
              <span className="text-lg font-normal">
                Pressure: {forecastData[0].main.pressure}
              </span>
              <span className="text-lg font-normal">
                Humidity:{" "}
                {(((forecastData[0].main.humidity - 32) * 5) / 9).toFixed(1)}
                &deg;C;
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center gap-5">
            {forecastData.map((data, index) => (
              <div
                key={index}
                className="flex flex-col justify-center items-center gap-2"
              >
                <span className="font-semibold">
                  {index === 0
                    ? "Now"
                    : `${new Date(data.dt_txt)
                        .getDate()
                        .toString()
                        .padStart(2, "0")}/${new Date(data.dt_txt)
                        .getMonth()
                        .toString()
                        .padStart(2, "0")}`}
                </span>
                <span className="font-semibold">
                  {(data.main.temp - 273.15).toFixed(1)}&deg;
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherDetails;
