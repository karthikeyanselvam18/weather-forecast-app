import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface City {
  coordinates: any;
  geoname_id: string;
  name: string;
  cou_name_en: string;
  timezone: string;
  lat: number;
  lon: number;
}

export interface ICityListProps {
  setLat: any;
  setLon: any;
}

function CityList(props: ICityListProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [perPage, setPerPage] = useState<number>(20);
  const [currentPageNo, setCurrentPageNo] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("");

  function fetchData() {
    fetch(
      `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?order_by=${sortBy}&limit=${perPage}&start=${
        (currentPageNo - 1) * perPage
      }`
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
    fetchData();
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } =
          document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
          setCurrentPageNo((prev) => prev + 1);
        }
      }, 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentPageNo]);

  useEffect(() => {
    setCities([]);
    setTimeout(() => {
      fetchData();
    }, 200);
  }, [sortBy]);

  return (
    <>
      <table className="w-full md:w-4/6 border-collapse border border-slate-500 table-auto">
        <thead>
          <tr className="bg-gray-400">
            <th className="border border-slate-600 px-1 py-1">No.</th>
            <th
              className="border border-slate-600 px-1 py-1"
              onClick={() => setSortBy("name")}
            >
              Name
            </th>
            <th
              className="border border-slate-600 px-1 py-1"
              onClick={() => setSortBy("")}
            >
              Country
            </th>
            <th
              className="border border-slate-600 px-1 py-1"
              onClick={() => setSortBy("timezone")}
            >
              Time zone
            </th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city: City, index: number) => (
            <tr key={index}>
              <td className="border border-slate-600 px-1 py-1">{index + 1}</td>
              <td className="border border-slate-600 px-1 py-1">
                {" "}
                <Link
                  onClick={() => {
                    props.setLat(city.lat);
                    props.setLon(city.lon);
                  }}
                  to={`weather/${city.name}`}
                >
                  {city.name}
                </Link>
              </td>
              <td className="border border-slate-600 px-1 py-1">
                {city.cou_name_en}
              </td>
              <td className="border border-slate-600 px-1 py-1">
                {city.timezone}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default CityList;
