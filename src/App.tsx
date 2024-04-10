import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import CityList from "./components/CityList";
import WeatherDetails from "./components/WeatherDetails";

function App() {
  const [lat, setLat] = useState<number>(0);
  const [lon, setLon] = useState<number>(0);
  return (
    <div className="App flex flex-col items-center">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            Component={(props) => (
              <CityList {...props} setLat={setLat} setLon={setLon} />
            )}
          />
          <Route
            path="/weather/:cityName"
            Component={(props) => (
              <WeatherDetails {...props} lat={lat} lon={lon} />
            )}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
