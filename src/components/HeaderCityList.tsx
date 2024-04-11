import { faSmog, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
interface City {
  coordinates: any;
  geoname_id: string;
  name: string;
  lat: number;
  lon: number;
}
export interface IHeaderCityListProps {setIsMenuOpen:any;isMenuOpen:boolean}

export default function HeaderCityList(props: IHeaderCityListProps) {
  const [cities, setCities] = useState<City[]>([]);
  // const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  function fetchData(searchTerm: string) {
    fetch(
      `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?select=geoname_id%2C%20name%2C%20coordinates&where=search(name%2C%20%22${searchTerm}%22)&limit=20`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.results) {
          setCities(
            data.results.map((city: City) => ({
              id: city.geoname_id,
              name: city.name,
              lat: city.coordinates.lat,
              lon: city.coordinates.lon,
            })),
          );
        }
      });
  }

  function handleOnSearch(string: string, results: any) {
    // setSearchTerm(string);
    fetchData(string);
    
  }

  function handleOnSelect(item: City) {
    navigate(`/weather/${item.lat}/${item.lon}/${item.name}`);
  }

  // useEffect(() => {
  //   fetchData();
  // }, [searchTerm]);

  return (
    <header className="flex justify-between items-center sticky left-0 top-0 z-30 w-full bg-cyan-600 p-5  md:gap-0 ">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Weather Forecast
        </h1>
        <FontAwesomeIcon
          icon={faSmog}
          className="text-2xl text-white sm:text-4xl"
        />
      </div>
      <div className="md:hidden flex justify-center items-center me-5 cursor-pointer" 
      onClick={()=>props.setIsMenuOpen((prev: boolean)=> !prev)}>
        <FontAwesomeIcon icon={props.isMenuOpen? faXmark :faBars} className="text-2xl font-bold text-white sm:text-4xl"/>
      </div>
    </header>
  );
}
