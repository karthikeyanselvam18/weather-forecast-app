import React, { useEffect, useState } from "react";

interface City {
  geoname_id: string;
  name: string;
  cou_name_en: string;
  timezone: string;
}

function App() {
  const [cities, setCities] = useState<City[]>([]);
  const [perPage, setPerPage] = useState<number>(20);
  const [currentPageNo, setCurrentPageNo] = useState<number>(1);
  useEffect(() => {
    console.log(
      `${currentPageNo - 1}  ${perPage}  ${(currentPageNo - 1) * perPage}`
    );

    fetch(
      `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?order_by=name&limit=${perPage}&start=${
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
            })),
          ]);
        }
      });

    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } =
          document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
          setCurrentPageNo((prev) => prev + 1);
        }
      }, 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentPageNo]);

  return (
    <div className="App flex justify-center m-10">
      <table className="border-separate border-spacing-1 border border-slate-500">
        <thead>
          <tr>
            <th className="border border-slate-600">No.</th>
            <th className="border border-slate-600">Name</th>
            <th className="border border-slate-600">Country</th>
            <th className="border border-slate-600">Time zone</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{city.name}</td>
              <td>{city.cou_name_en}</td>
              <td>{city.timezone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
