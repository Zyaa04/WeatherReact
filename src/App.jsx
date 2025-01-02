import { useState, useEffect } from 'react';
import './App.css';
import wall1 from './assets/wall1.jpg';
import wall2 from './assets/wall2.jpg';
import wall3 from './assets/wall3.jpg';
import wall4 from './assets/wall4.jpg';
import wall5 from './assets/wall5.jpg';
import wall6 from './assets/wall6.jpg';

function App() {
  const [location, setLocation] = useState('Fetching location...');
  const [weather, setWeather] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [clock, setClock] = useState(new Date().toLocaleTimeString());

  const images = [wall1, wall2, wall3, wall4, wall5, wall6];
  const API_KEY = '8489e9f46e194b79759dd73fba658fe0'; 

  const fetchLocation = async () => {
    try {
      const response = await fetch('https://ipinfo.io?token=0191141a87e834');
      const data = await response.json();
      const { city, region, country } = data;
      setLocation(`You are in ${city}, ${region}, ${country}`);

      // Fetch weather based on city
      fetchWeather(city);
    } catch (error) {
      setLocation('Unable to fetch location.');
      console.error(error);
    }
  };

  const fetchWeather = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();

      if (data.weather) {
        const { description } = data.weather[0];
        const { temp } = data.main;
        setWeather(`Weather: ${description}, Temperature: ${temp}°C`);
      } else {
        setWeather('Unable to fetch weather data.');
      }
    } catch (error) {
      setWeather('Unable to fetch weather data.');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLocation();

    // Set a random background image
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setBackgroundImage(randomImage);

    // Update clock every second
    const clockInterval = setInterval(() => {
      setClock(new Date().toLocaleTimeString());
    }, 1000);

    // Refresh weather every 10 minutes
    const weatherInterval = setInterval(() => {
      fetchLocation();
    }, 10 * 60 * 1000); 

    return () => {
      clearInterval(clockInterval);
      clearInterval(weatherInterval);
    };
  }, []);

  return (
    <div
      className="app"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'gray',
      }}
    >
      <div
        className="flex justify-center items-center h-screen"
        style={{
          backgroundColor: 'rgba(255,255,255,0.7)',
          height: '100%',
        }}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{clock}</h1>
          <h2 className="text-3xl font-bold">{location}</h2>
          <h3 className="text-2xl mt-4">{weather}</h3>
        </div>
      </div>
    </div>
  );
}

export default App;
