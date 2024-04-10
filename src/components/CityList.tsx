import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import HeaderCityList from "./HeaderCityList";
import AsyncSelect from "react-select/async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortUp,
  faSortDown,
  faArrowDownAZ,
  faArrowDownZA,
} from "@fortawesome/free-solid-svg-icons";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

interface City {
  coordinates: any;
  geoname_id: string;
  name: string;
  cou_name_en: string;
  timezone: string;
  lat: number;
  lon: number;
}

export interface ICityListProps {}

function CityList(props: ICityListProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [perPage, setPerPage] = useState<number>(50);
  const [currentPageNo, setCurrentPageNo] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("");
  const [isRightClicked, setIsRightClicked] = useState<boolean>(false);
  const [countries, setCountries] = useState<any>([]);
  const [searchCountryTerm, setSearchCountryterm] = useState<string>("");

  function fetchData() {
    fetch(
      `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?order_by=${sortBy}&limit=${perPage}&start=${
        (currentPageNo - 1) * perPage
      }${searchCountryTerm}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.results) {
          setCities((prev) => [
            ...prev,
            ...data.results.map((city: City) => ({
              geoname_id: city.geoname_id,
              name: city.name,
              cou_name_en: city.cou_name_en,
              timezone: city.timezone,
              lat: city.coordinates.lat,
              lon: city.coordinates.lon,
            })),
          ]);
        }
      });
  }

  useEffect(() => {
    setCities([]);
    fetchData();
  }, [sortBy, searchCountryTerm]);

  const [isDescOrder, setIsDescOrder] = useState<boolean>(false);
  const handleNameSort = () => {
    isDescOrder ? setSortBy("name desc") : setSortBy("name");
    setIsDescOrder((prev) => !prev);
  };
  const handleCountrySort = () => {
    isDescOrder ? setSortBy("cou_name_en desc") : setSortBy("cou_name_en");
    setIsDescOrder((prev) => !prev);
  };
  const handleTimezoneSort = () => {
    isDescOrder ? setSortBy("timezone desc") : setSortBy("timezone");
    setIsDescOrder((prev) => !prev);
  };

  function handleClick(item: City) {
    window.open(`/weather/${item.lat}/${item.lon}/${item.name}`, "blank");
  }

  function loadCountryOptions(
    inputValue: string,
    callback: (options: any[]) => void,
  ) {
    fetch(
      `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?where=search(cou_name_en%2C%22${inputValue}%22)&group_by=cou_name_en&limit=10`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.results) {
          const options = data.results.map(
            (country: { cou_name_en: string }) => ({
              value: country.cou_name_en,
              label: country.cou_name_en,
            }),
          );
          callback(options);
        }
      });
  }

  function handleCountrySelect(option: { value: string; label: string }) {
    setSearchCountryterm(`&where=cou_name_en%20%3D%20%22${option.value}%22`);
    console.log(option.value);
  }

  return (
    <>
      <HeaderCityList />

      <AsyncSelect
        loadOptions={loadCountryOptions}
        onChange={handleCountrySelect}
        defaultOptions
      />

      <div className="mx-auto my-4 w-5/6 rounded border-x-2 border-b-2 border-slate-600  bg-cyan-600 ">
        <div className="sticky top-[142px] grid w-full grid-cols-12 divide-x-2 divide-slate-600 rounded border-y-2 border-slate-600 bg-cyan-500 text-center font-semibold md:top-[86px]">
          <h1 className="col-span-1 py-2">No.</h1>
          <h1
            className="col-span-4 cursor-pointer py-2"
            onClick={handleNameSort}
          >
            Name {sortBy === "name" && <FontAwesomeIcon icon={faArrowDownAZ} />}
            {sortBy === "name desc" && <FontAwesomeIcon icon={faArrowDownZA} />}
          </h1>
          <h1
            className="col-span-4 cursor-pointer py-2"
            onClick={handleCountrySort}
          >
            Country{" "}
            {sortBy === "cou_name_en" && (
              <FontAwesomeIcon icon={faArrowDownAZ} />
            )}
            {sortBy === "cou_name_en desc" && (
              <FontAwesomeIcon icon={faArrowDownZA} />
            )}
          </h1>
          <h1
            className="col-span-3 cursor-pointer py-2"
            onClick={handleTimezoneSort}
          >
            Timezone{" "}
            {sortBy === "timezone" && <FontAwesomeIcon icon={faArrowDownAZ} />}
            {sortBy === "timezone desc" && (
              <FontAwesomeIcon icon={faArrowDownZA} />
            )}
          </h1>
        </div>
        <InfiniteScroll
          dataLength={cities.length}
          next={fetchData}
          hasMore={true}
          loader={<h4>Loading...</h4>}
          endMessage={<p>No more cities to load</p>}
        >
          {cities.map((city: City, index: number) => (
            <div
              key={index}
              className="grid grid-cols-12 divide-x-2 divide-slate-600 border-b border-slate-600
              bg-gray-300 odd:bg-slate-200 "
            >
              <span className="col-span-1 break-words py-1 ps-2">
                {index + 1}.
              </span>
              <span className="col-span-4 break-words py-1 ps-2">
                <Link
                  onContextMenu={() => handleClick(city)}
                  to={`weather/${city.lat}/${city.lon}/${city.name}`}
                >
                  {city.name}
                </Link>
              </span>
              <span className="col-span-4 break-words py-1 ps-2">
                {city.cou_name_en}
              </span>
              <span className="col-span-3 break-words py-1 ps-2">
                {city.timezone}
              </span>
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </>
  );
}

export default CityList;
