import { useState, useEffect } from "react";
import "./index.css";

const KEY = "9ed25195e11d4859947102643242211";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
      },
      (err) => {
        console.error("Geolocation error", err.message);
        setError("Geolocation error");
      }
    );
  }, []);

  useEffect(() => {
    if (!city.trim() && !coords) {
      setWeatherData(null);
      setError(null);
      return;
    }
    const getData = async () => {
      setLoading(true);
      try {
        const query=city.trim()?city:`${coords.latitude},${coords.longitude}`
        const res = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=${KEY}&q=${query}`
        );
        if (!res.ok)
          throw new Error(
            `Not valid city name ${res.status} ${res.statusText}`
          );
        const data = await res.json();
        setError(null);
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [city,coords]);
  return (
    <div className="app">
      <div className="widget-container">
        <div className="weather-card-container">
          <h1 className="app-title">Weather Widget</h1>
          <div className="search-container">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              type="text"
              placeholder="Enter city name"
              className="search-input"
            />
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) :  (
          <div className="weather-card">
            <h2>{`${weatherData?.location?.name ?? ""} ${
              weatherData?.location?.country ?? ""
            }`}</h2>
            <img
              src={weatherData?.current?.condition?.icon ?? ""}
              alt="icon"
              className="weather-icon"
            />
            <p className="temperature">
              {weatherData?.current?.temp_c ?? ""}°C
            </p>
            <p className="condition">
              {weatherData?.current?.condition?.text ?? ""}
            </p>
            <div className="weather-details">
              <p>{`Humidity: ${weatherData?.current?.humidity ?? ""}%`}</p>
              <p>{`Wind: ${weatherData?.current?.wind_kph ?? ""} km/h`}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
