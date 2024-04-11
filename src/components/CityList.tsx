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
import { log } from "console";

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
  const [perPage] = useState<number>(18);
  const [currentPageNo, setCurrentPageNo] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("");
  const [searchCountryTerm, setSearchCountryTerm] = useState<string>("");
  const [searchTimezoneTerm, setSearchTimezoneTerm] = useState<string>("");
  const [searchCityTerm, setSearchCityTerm] = useState<string>("");
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  function fetchData() {
    setCurrentPageNo((prev) => prev + 1);
    fetch(
      `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?order_by=${sortBy}&limit=${perPage}&start=${
        (currentPageNo - 1) * perPage
      }${searchCountryTerm}${searchTimezoneTerm}${searchCityTerm}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.results) {
          if (data.results.length < perPage) {
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
            setHasMore(false);
          } else {
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
            setHasMore(true);
          }
        }
      });
    console.log(searchCityTerm);
  }

  useEffect(() => {
    fetchData();
  }, [sortBy, searchCountryTerm, searchTimezoneTerm, searchCityTerm]);

  const [isDescOrder, setIsDescOrder] = useState<boolean>(false);
  const handleNameSort = () => {
    setCurrentPageNo(1);
    setCities([]);
    isDescOrder ? setSortBy("name desc") : setSortBy("name");
    setIsDescOrder((prev) => !prev);
  };
  const handleCountrySort = () => {
    setCurrentPageNo(1);
    setCities([]);
    isDescOrder ? setSortBy("cou_name_en desc") : setSortBy("cou_name_en");
    setIsDescOrder((prev) => !prev);
  };
  const handleTimezoneSort = () => {
    setCurrentPageNo(1);
    setCities([]);
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

  function handleCountrySelect(
    option: { value: string; label: string } | null,
  ) {
    setCurrentPageNo(1);
    setCities([]);
    setSearchCountryTerm(
      option ? `&where=cou_name_en%20%3D%20%22${option.value}%22` : "",
    );
  }

  function loadTimezoneOptions(
    inputValue: string,
    callback: (options: any[]) => void,
  ) {
    fetch(
      `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?where=search(timezone%2C%22${inputValue}%22)&group_by=timezone&limit=10`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.results) {
          const options = data.results.map((country: { timezone: string }) => ({
            value: country.timezone,
            label: country.timezone,
          }));
          callback(options);
        }
      });
  }

  function handleTimezoneSelect(
    option: { value: string; label: string } | null,
  ) {
    setCurrentPageNo(1);
    setCities([]);
    setSearchTimezoneTerm(
      option ? `&where=timezone%20%3D%20%22${option.value}%22` : "",
    );
    console.log(option ? option.value : "");
  }

  function handleCitySearch(string: string, results: any) {
    setCurrentPageNo(1);
    setCities([]);
    setSearchCityTerm(
      string != "" ? `&where=search(name%2C%20%22${string}%22)` : "",
    );
    console.log(string, results);
  }

  return (
    <>
      <HeaderCityList setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen}/>
      <div className="mt-3 flex w-full justify-between md:mt-0">
        <div
          className={`fixed left-0 top-[72px] sm:top-[76px] md:top-auto z-20 min-h-screen w-3/4 bg-cyan-500 bg-opacity-90 sm:w-1/2 md:relative md:block md:w-3/12 transform transition-transform duration-300 md:transform-none ${isMenuOpen ? "translate-x-0" :"-translate-x-full"}`}
        >
          <div
          className="px-2.5 flex flex-col gap-5 mt-10 md:fixed md:left-0 md:top-1/2  md:mt-0 md:w-3/12 md:-translate-y-1/2">
            
              <div className=" md:w-full ">
                <ReactSearchAutocomplete
                  items={[]}
                  onSearch={handleCitySearch}
                  onSelect={() => {}}
                  placeholder="Search city..."
                  showNoResults={false}
                />
              </div>
              <div><span className="mb-1.5 block">Country filter:</span>
              <AsyncSelect
                loadOptions={loadCountryOptions}
                onChange={handleCountrySelect}
                isClearable={true}
                defaultOptions
              /></div>
            
            <div>
              <span className="mb-1.5 block">Timezone filter:</span>
              <AsyncSelect
                loadOptions={loadTimezoneOptions}
                onChange={handleTimezoneSelect}
                isClearable={true}
                defaultOptions
              />
            </div>
          </div>
        </div>

        <div className="mx-auto w-11/12 rounded border-x-2 border-b-2 border-slate-600 md:mx-0 md:w-9/12   ">
          <div className="sticky top-[72px] grid w-full grid-cols-12 divide-x-2 divide-slate-600 rounded border-y-2 border-slate-600 bg-cyan-500 text-center font-semibold sm:top-[76px] md:top-[76px]">
            <h1 className="col-span-2 py-2">No.</h1>
            <h1
              className="col-span-4 cursor-pointer py-2"
              onClick={handleNameSort}
            >
              Name{" "}
              {sortBy === "name" && <FontAwesomeIcon icon={faArrowDownAZ} />}
              {sortBy === "name desc" && (
                <FontAwesomeIcon icon={faArrowDownZA} />
              )}
            </h1>
            <h1
              className="col-span-3 cursor-pointer py-2"
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
              {sortBy === "timezone" && (
                <FontAwesomeIcon icon={faArrowDownAZ} />
              )}
              {sortBy === "timezone desc" && (
                <FontAwesomeIcon icon={faArrowDownZA} />
              )}
            </h1>
          </div>
          <InfiniteScroll
            dataLength={cities.length}
            next={fetchData}
            hasMore={hasMore}
            loader={
              <div
                role="status"
                className="fixed left-1/2 top-1/2 z-30 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden"
              >
                <svg
                  aria-hidden="true"
                  className=" size-[50px] animate-spin fill-cyan-500 text-gray-200 md:size-[50px] dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            }
            endMessage={<p>No more cities to load</p>}
          >
            {cities.map((city: City, index: number) => (
              <div
                key={index}
                className="grid grid-cols-12 divide-x-2 divide-slate-600 border-b border-slate-600
              bg-gray-300 odd:bg-slate-200 "
              >
                <span className="col-span-2  py-1 ps-2">
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
                <span className="col-span-3 break-words py-1 ps-2">
                  {city.cou_name_en}
                </span>
                <span className="col-span-3 break-words py-1 ps-2">
                  {city.timezone}
                </span>
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
}

export default CityList;
