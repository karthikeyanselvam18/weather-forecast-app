import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import CityList from "./components/CityList";
import WeatherDetails from "./components/WeatherDetails";

function App() {
  return (
    <div className="App flex flex-col items-center relative w-full">
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={CityList} />
          <Route
            path="/weather/:lat/:lon/:cityName"
            Component={WeatherDetails}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
