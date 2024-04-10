import { faSmog } from "@fortawesome/free-solid-svg-icons";
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
export interface IHeaderCityListProps {
  setLat: any;
  setLon: any;
}

export default function HeaderCityList(props: IHeaderCityListProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  function fetchData() {
    fetch(
      `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?select=geoname_id%2C%20name%2C%20coordinates&where=search(name%2C%20%22${searchTerm}%22)&limit=20`
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
            }))
          );
        }
      });
  }

  function handleOnSearch(string: string, results: any) {
    setSearchTerm(string);
  }

  function handleOnSelect(item: City) {
    props.setLat(item.lat);
    props.setLon(item.lon);
    navigate(`/weather/${item.name}`);
  }

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  return (
    <header className="w-full flex flex-col md:flex-row items-center justify-between p-5 bg-cyan-600 gap-5 md:gap-0">
      <div className="flex gap-3 items-center">
        <h1 className="text-3xl font-bold text-white">Weather Forecast</h1>
        <FontAwesomeIcon icon={faSmog} className="text-4xl text-white" />
      </div>
      <div className="w-3/4 md:w-1/3 ">
        <ReactSearchAutocomplete
          items={cities}
          onSearch={handleOnSearch}
          onSelect={handleOnSelect}
          autoFocus
        />
      </div>
    </header>
  );
}
