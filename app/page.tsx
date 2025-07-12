'use client';

import { useState, useEffect } from 'react';
import { Coins, ShoppingBag } from 'lucide-react';
import WeatherMap from '../components/WeatherMap';
import BetControls from '../components/BetControls';
import GameResult from '../components/GameResult';
import PayoutModal from '../components/PayoutModal';
import BetLoadingWheel from '../components/BetLoadingWheel';
import CasinoShop from '../components/CasinoShop';
import UserAvatar from '../components/UserAvatar';

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  lat: number;
  lng: number;
  weatherCode: number;
}

interface GameResult {
  weather: WeatherData;
  payout: number;
  multiplier: number;
  isWin: boolean;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

// Weather rarity and payout system - WORST WEATHER WINS!
const getWeatherRarity = (code: number, temp: number, betAmount: number): { rarity: GameResult['rarity'], multiplier: number } => {
  // Extreme conditions (Legendary) - BIG WINS!
  if (code >= 95 || temp <= -10 || temp >= 110) {
    return { rarity: 'legendary', multiplier: 25 };
  }
  // Snow/Severe weather (Epic) - GOOD WINS!
  if (code >= 71 && code <= 75 || code >= 96) {
    return { rarity: 'epic', multiplier: 10 };
  }
  // Heavy rain/storms (Rare) - DECENT WINS!
  if (code >= 61 && code <= 65 || code >= 80) {
    return { rarity: 'rare', multiplier: 5 };
  }
  // Light rain/drizzle (Uncommon) - SMALL LOSS
  if (code >= 51 && code <= 55 || code >= 45) {
    return { rarity: 'uncommon', multiplier: 0.5 };
  }
  // Clear/cloudy (Common) - TOTAL LOSS! (lose everything)
  return { rarity: 'common', multiplier: 0 };
};

export default function WeatherWheel() {
  const [credits, setCredits] = useState(1000);
  const [betAmount, setBetAmount] = useState(50);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [pendingBet, setPendingBet] = useState(0);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPayoutTable, setShowPayoutTable] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [bettingInProgress, setBettingInProgress] = useState(false);
  const [locationName, setLocationName] = useState<string>('');
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [showShop, setShowShop] = useState(false);
  const [ownedHats, setOwnedHats] = useState<string[]>([]);

  // Load credits and owned hats from localStorage on mount
  useEffect(() => {
    const savedCredits = localStorage.getItem('credits');
    const savedHats = localStorage.getItem('ownedHats');
    
    if (savedCredits) {
      setCredits(parseInt(savedCredits));
    }
    if (savedHats) {
      setOwnedHats(JSON.parse(savedHats));
    }
  }, []);

  // Save credits to localStorage whenever credits change
  useEffect(() => {
    localStorage.setItem('credits', credits.toString());
  }, [credits]);
  
  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setGameResult(null);
    setShowResult(false);
    setError(null);
  };
  
  const handlePlayAgain = () => {
    setSelectedLocation(null);
    setGameResult(null);
    setShowResult(false);
    setError(null);
    setPendingBet(0);
    setLoading(false);
    setBettingInProgress(false);
    setLocationName('');
  };

  const handleHatPurchase = (hatId: string) => {
    setOwnedHats(prev => [...prev, hatId]);
  };

  const handleSecretCredits = () => {
    setCredits(prev => prev + 100);
  };

  // Robust geocoding with multiple fallbacks
  const getLocationName = async (lat: number, lng: number): Promise<string> => {
    const fallbackName = `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
    
    // Primary: BigDataCloud
    try {
      setLoadingStage('🌍 Finding your location...');
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
        { timeout: 3000 } as any
      );
      if (response.ok) {
        const data = await response.json();
        return data.city || data.locality || data.countryName || fallbackName;
      }
    } catch (err) {
      console.log('BigDataCloud failed, trying fallback...');
    }
    
    // Fallback 1: Nominatim (OpenStreetMap)
    try {
      setLoadingStage('🗺️ Trying backup location service...');
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`,
        { timeout: 3000 } as any
      );
      if (response.ok) {
        const data = await response.json();
        return data.display_name?.split(',')[0] || fallbackName;
      }
    } catch (err) {
      console.log('Nominatim failed, using coordinates...');
    }
    
    return fallbackName;
  };

  // Robust weather data with multiple fallbacks
  const getWeatherData = async (lat: number, lng: number): Promise<any> => {
    let lastError = null;
    
    // Primary: Open-Meteo
    try {
      setLoadingStage('🌤️ Checking weather conditions...');
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=relativehumidity_2m&timezone=auto&temperature_unit=fahrenheit`,
        { timeout: 5000 } as any
      );
      if (response.ok) {
        const data = await response.json();
        if (data.current_weather) return data;
      }
    } catch (err) {
      lastError = err;
      console.log('Open-Meteo failed, trying OpenWeatherMap...');
    }
    
    // Fallback 1: OpenWeatherMap (requires API key, but has free tier)
    try {
      setLoadingStage('⛅ Trying alternative weather service...');
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=imperial&appid=demo`, // Using demo key
        { timeout: 5000 } as any
      );
      if (response.ok) {
        const data = await response.json();
        // Convert OpenWeatherMap format to Open-Meteo format
                 return {
           current_weather: {
             temperature: data.main.temp,
             weathercode: convertOpenWeatherToCode(data.weather[0].id),
             windspeed: data.wind.speed,
             is_day: 1
           },
           hourly: {
             relativehumidity_2m: [data.main.humidity]
           }
         };
      }
    } catch (err) {
      lastError = err;
      console.log('OpenWeatherMap failed, trying WeatherAPI...');
    }
    
    // Fallback 2: WeatherAPI (also has free tier)
    try {
      setLoadingStage('🌦️ Accessing weather database...');
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=demo&q=${lat},${lng}`, // Using demo key
        { timeout: 5000 } as any
      );
      if (response.ok) {
        const data = await response.json();
        // Convert WeatherAPI format to Open-Meteo format
                 return {
           current_weather: {
             temperature: data.current.temp_f,
             weathercode: convertWeatherAPIToCode(data.current.condition.code),
             windspeed: data.current.wind_mph,
             is_day: data.current.is_day
           },
           hourly: {
             relativehumidity_2m: [data.current.humidity]
           }
         };
      }
    } catch (err) {
      lastError = err;
      console.log('WeatherAPI failed, generating synthetic data...');
    }
    
    // Ultimate Fallback: Generate realistic synthetic weather data
    setLoadingStage('🎰 Casino weather generator activated...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
    
         return generateSyntheticWeather(lat, lng);
  };

  // Convert OpenWeatherMap weather IDs to Open-Meteo weather codes
  const convertOpenWeatherToCode = (id: number): number => {
    if (id >= 200 && id <= 299) return 95; // Thunderstorm
    if (id >= 300 && id <= 399) return 51; // Drizzle
    if (id >= 500 && id <= 599) return 61; // Rain
    if (id >= 600 && id <= 699) return 71; // Snow
    if (id >= 700 && id <= 799) return 45; // Fog/Mist
    if (id === 800) return 0; // Clear
    if (id > 800) return 2; // Clouds
    return 1; // Default
  };

  // Convert WeatherAPI condition codes to Open-Meteo weather codes
  const convertWeatherAPIToCode = (code: number): number => {
    const codeMap: { [key: number]: number } = {
      1000: 0,   // Sunny/Clear
      1003: 1,   // Partly cloudy
      1006: 2,   // Cloudy
      1009: 3,   // Overcast
      1030: 45,  // Mist
      1135: 45,  // Fog
      1150: 51,  // Light drizzle
      1153: 53,  // Drizzle
      1180: 61,  // Light rain
      1183: 63,  // Moderate rain
      1186: 65,  // Heavy rain
      1210: 71,  // Light snow
      1213: 73,  // Moderate snow
      1216: 75,  // Heavy snow
      1276: 95,  // Thunderstorm
    };
    return codeMap[code] || 1;
  };

  // Generate synthetic weather data as ultimate fallback
  const generateSyntheticWeather = (lat: number, lng: number) => {
    // Generate realistic weather based on location and season
    const season = Math.floor((new Date().getMonth() + 1) / 3);
    const isNorthern = lat > 0;
    
    // Weather probabilities based on season and location
    const weatherTypes = [
      { code: 0, weight: 30 },   // Clear
      { code: 1, weight: 25 },   // Mainly clear
      { code: 2, weight: 20 },   // Partly cloudy
      { code: 3, weight: 15 },   // Overcast
      { code: 61, weight: 5 },   // Rain
      { code: 71, weight: 3 },   // Snow (higher in winter)
      { code: 95, weight: 2 }    // Thunderstorm
    ];
    
    // Adjust for season (winter = more snow/rain, summer = more clear)
    if (season === 0 || season === 3) { // Winter
      weatherTypes[5].weight = isNorthern ? 15 : 5; // More snow in north
      weatherTypes[4].weight = 10; // More rain
      weatherTypes[0].weight = 20; // Less clear
    }
    
    // Random selection based on weights
    const totalWeight = weatherTypes.reduce((sum, w) => sum + w.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedWeather = weatherTypes[0];
    
    for (const weather of weatherTypes) {
      random -= weather.weight;
      if (random <= 0) {
        selectedWeather = weather;
        break;
      }
    }
    
    // Generate realistic temperature
    const baseTemp = 70 + (lat > 0 ? -lat/2 : lat/2); // Colder as you go north
    const seasonAdjust = season === 1 || season === 2 ? 15 : -15; // Summer/winter
    const randomVariation = (Math.random() - 0.5) * 20;
    const temperature = Math.round(baseTemp + seasonAdjust + randomVariation);
    
    return {
      current_weather: {
        temperature,
        weathercode: selectedWeather.code,
        windspeed: Math.random() * 15 + 5, // 5-20 mph
        is_day: new Date().getHours() > 6 && new Date().getHours() < 20 ? 1 : 0
      },
      hourly: {
        relativehumidity_2m: [Math.round(Math.random() * 40 + 30)] // 30-70%
      }
    };
  };
  
  const handlePlaceBet = async () => {
    if (!selectedLocation || credits < betAmount || pendingBet > 0) return;
    
    // Start betting process
    setBettingInProgress(true);
    setCredits(prev => prev - betAmount);
    setPendingBet(betAmount);
    setLoading(true);
    setError(null);
    setLoadingStage('🎲 Initializing bet...');
    
    // Start the minimum delay timer
    const startTime = Date.now();
    const minimumDelay = 8000; // 8 seconds for more stages
    
    try {
      // Get location name with fallbacks
      const tempLocationName = await getLocationName(selectedLocation.lat, selectedLocation.lng);
      setLocationName(tempLocationName);
      
      // Get weather data with multiple fallbacks
      setLoadingStage('📡 Connecting to weather satellites...');
      const data = await getWeatherData(selectedLocation.lat, selectedLocation.lng);
      const current = data.current_weather;
      
      setLoadingStage('🧮 Calculating odds and payouts...');
      
      // Weather descriptions
      const getWeatherDescription = (code: number) => {
        const weatherCodes: { [key: number]: string } = {
          0: 'Clear Sky',
          1: 'Mainly Clear',
          2: 'Partly Cloudy',
          3: 'Overcast',
          45: 'Fog',
          48: 'Depositing Rime Fog',
          51: 'Light Drizzle',
          53: 'Moderate Drizzle',
          55: 'Dense Drizzle',
          61: 'Slight Rain',
          63: 'Moderate Rain',
          65: 'Heavy Rain',
          71: 'Slight Snow',
          73: 'Moderate Snow',
          75: 'Heavy Snow',
          80: 'Slight Rain Showers',
          81: 'Moderate Rain Showers',
          82: 'Violent Rain Showers',
          95: 'Thunderstorm',
          96: 'Thunderstorm with Hail',
          99: 'Thunderstorm with Heavy Hail'
        };
        return weatherCodes[code] || 'Mysterious Weather';
      };
      
      // Weather icons
      const getWeatherIcon = (code: number, isDay: boolean) => {
        const suffix = isDay ? 'd' : 'n';
        if (code === 0) return `01${suffix}`;
        if (code <= 3) return `02${suffix}`;
        if (code <= 48) return `50${suffix}`;
        if (code <= 55) return `09${suffix}`;
        if (code <= 65) return `10${suffix}`;
        if (code <= 75) return `13${suffix}`;
        if (code <= 82) return `09${suffix}`;
        if (code >= 95) return `11${suffix}`;
        return `01${suffix}`;
      };
      
      const weatherData: WeatherData = {
        location: tempLocationName,
        temperature: Math.round(current.temperature),
        description: getWeatherDescription(current.weathercode),
        humidity: data.hourly.relativehumidity_2m[0] || Math.round(Math.random() * 40 + 30),
        windSpeed: current.windspeed,
        icon: getWeatherIcon(current.weathercode, current.is_day === 1),
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        weatherCode: current.weathercode
      };
      
      setLoadingStage('💰 Processing your winnings...');
      
      // Calculate payout
      const { rarity, multiplier } = getWeatherRarity(current.weathercode, current.temperature, betAmount);
      const isWin = multiplier > 1;
      const payout = Math.round(betAmount * multiplier);
      
      const result: GameResult = {
        weather: weatherData,
        payout,
        multiplier,
        isWin,
        rarity
      };
      
      setLoadingStage('🎉 Finalizing results...');
      
      // Ensure minimum delay
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minimumDelay - elapsedTime);
      
      setTimeout(() => {
        setGameResult(result);
        setShowResult(true);
        setBettingInProgress(false);
        
        // Handle winnings - add payout to credits
        setCredits(prev => prev + payout);
        
        // Clear pending bet
        setPendingBet(0);
        setLoading(false);
        setLoadingStage('');
      }, remainingTime);
      
    } catch (err) {
      console.error('Unexpected error in betting process:', err);
      // This should never happen now with our fallbacks
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minimumDelay - elapsedTime);
      
      setTimeout(() => {
        setError('An unexpected error occurred. Your bet has been refunded.');
        setBettingInProgress(false);
        // Refund the bet
        setCredits(prev => prev + betAmount);
        setPendingBet(0);
        setLoading(false);
        setLoadingStage('');
      }, remainingTime);
    }
  };
  
  // Determine if map should be visible
  const shouldShowMap = !bettingInProgress && !gameResult;
  
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url('/background.webp')",
        backgroundAttachment: 'fixed'
      }}
    >
      {/* User Avatar - Always visible */}
      <UserAvatar ownedHats={ownedHats} />

      {/* Dark overlay for better contrast */}
      <div className="min-h-screen bg-black/40 backdrop-blur-sm">
        
        {/* Casino Header */}
        <div 
          className="relative bg-cover bg-center border-b-4 border-yellow-400 shadow-2xl"
          style={{
            backgroundImage: "url('/header-texture.webp')"
          }}
        >
          <div className="bg-gradient-to-r from-black/80 via-black/60 to-black/80 px-4 py-6 pr-20 md:pr-4">
            <div className="max-w-7xl mx-auto">
              
              {/* Mobile Layout - Stacked */}
              <div className="block md:hidden">
                <div className="text-center mb-4">
                  <h1 className="font-bungee text-3xl text-yellow-400 mb-2 drop-shadow-lg">
                    WEATHER CASINO
                  </h1>
                  <p className="text-yellow-300 text-sm font-bungee tracking-wide">
                    benefit from disasters!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  {/* Credits Display */}
                  <div className="bg-black/60 backdrop-blur-sm rounded-xl border-2 border-yellow-400 px-4 py-2 shadow-xl">
                    <div className="flex items-center gap-2">
                      <Coins className="text-yellow-400 w-5 h-5" />
                      <div className="text-center">
                        <div className="text-xs text-yellow-300 font-bungee">CREDITS</div>
                        <div className="text-lg font-bungee text-yellow-400">
                          {credits.toLocaleString()}
                        </div>
                      </div>
                      {pendingBet > 0 && (
                        <div className="ml-3 pl-3 border-l border-yellow-400/50">
                          <div className="text-xs text-orange-300 font-bungee">PENDING</div>
                          <div className="text-sm font-bungee text-orange-400">
                            -{pendingBet.toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shop Button */}
                  <button
                    onClick={() => setShowShop(true)}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-xl font-bungee flex items-center gap-2 transition-all duration-200 transform hover:scale-105 border-2 border-purple-500 shadow-lg"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>SHOP</span>
                  </button>
                </div>
              </div>

              {/* Desktop Layout - Side by Side */}
              <div className="hidden md:flex flex-row justify-between items-center">
                <div className="text-center flex-1">
                  <h1 className="font-bungee text-4xl lg:text-6xl xl:text-7xl text-yellow-400 mb-2 drop-shadow-lg">
                    WEATHER CASINO
                  </h1>
                  <p className="text-yellow-300 text-lg lg:text-xl font-bungee tracking-wide">
                    be the one person to benefit from disasters!
                  </p>
                </div>
                
                {/* Right Side - Credits and Shop */}
                <div className="flex flex-row gap-4 items-center ml-6">
                  {/* Credits Display */}
                  <div className="bg-black/60 backdrop-blur-sm rounded-2xl border-2 border-yellow-400 px-6 py-3 shadow-xl">
                    <div className="flex items-center gap-3">
                      <Coins className="text-yellow-400 w-8 h-8" />
                      <div>
                        <div className="text-sm text-yellow-300 font-bungee">CREDITS</div>
                        <div className="text-2xl font-bungee text-yellow-400">
                          {credits.toLocaleString()}
                        </div>
                      </div>
                      {pendingBet > 0 && (
                        <div className="ml-4 pl-4 border-l border-yellow-400/50">
                          <div className="text-sm text-orange-300 font-bungee">PENDING BET</div>
                          <div className="text-xl font-bungee text-orange-400">
                            -{pendingBet.toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shop Button */}
                  <button
                    onClick={() => setShowShop(true)}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-2xl font-bungee flex items-center gap-3 transition-all duration-200 transform hover:scale-105 border-2 border-purple-500 shadow-lg"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>SHOP</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Map Section - Bigger on desktop */}
            <div className="flex-1 lg:flex-[2]">
              {shouldShowMap && (
                <WeatherMap
                  selectedLocation={selectedLocation}
                  onLocationSelect={handleLocationSelect}
                />
              )}
              
              {/* Placeholder for map area when hidden */}
              {!shouldShowMap && (
                <div className="bg-black/60 backdrop-blur-sm rounded-2xl border-2 border-yellow-400/50 p-8 lg:p-12 text-center shadow-xl">
                  <div className="text-6xl lg:text-8xl mb-6">🎰</div>
                  <h3 className="font-bungee text-2xl lg:text-3xl text-yellow-400 mb-4">
                    {bettingInProgress ? 'SPINNING THE WHEEL...' : 'RESULTS ARE IN!'}
                  </h3>
                  <p className="text-gray-300 text-lg">
                    {bettingInProgress 
                      ? 'Map will return after results are displayed' 
                      : 'Click "Play Again" to select a new location'
                    }
                  </p>
                </div>
              )}
            </div>
            
            {/* Controls Section - Responsive sidebar */}
            <div className="lg:w-96 space-y-6">
              
              {/* Show betting controls only when not betting and no result */}
              {!bettingInProgress && !gameResult && (
                <BetControls
                  betAmount={betAmount}
                  setBetAmount={setBetAmount}
                  credits={credits}
                  selectedLocation={selectedLocation}
                  pendingBet={pendingBet}
                  onPlaceBet={handlePlaceBet}
                  loading={loading}
                  setShowPayoutTable={setShowPayoutTable}
                />
              )}
              
              {/* Show loading wheel during betting */}
              {bettingInProgress && (
                <BetLoadingWheel
                  betAmount={betAmount}
                  location={locationName}
                  loadingStage={loadingStage}
                />
              )}
              
              {/* Error Display */}
              {error && (
                <div className="bg-red-900/80 backdrop-blur-sm border-2 border-red-500 rounded-2xl p-6 text-center shadow-xl">
                  <div className="text-5xl mb-4">❌</div>
                  <p className="text-white font-bungee text-lg">{error}</p>
                </div>
              )}
              
              {/* Game Result */}
              {gameResult && showResult && (
                <GameResult 
                  gameResult={gameResult} 
                  showResult={showResult} 
                  onPlayAgain={handlePlayAgain}
                  credits={credits}
                />
              )}
              
            </div>
          </div>
        </div>
        
        {/* Modals */}
        <PayoutModal 
          showPayoutTable={showPayoutTable}
          setShowPayoutTable={setShowPayoutTable}
        />
        
        <CasinoShop
          showShop={showShop}
          setShowShop={setShowShop}
          credits={credits}
          setCredits={setCredits}
          onPurchase={handleHatPurchase}
        />
        
        {/* Secret Credit Button - Bottom Left (Only when broke) */}
        {credits === 0 && (
          <button
            onClick={handleSecretCredits}
            className="fixed bottom-4 left-4 w-6 h-6 opacity-20 hover:opacity-100 transition-opacity duration-200 text-yellow-400 hover:text-yellow-300"
            title="Secret credits"
          >
            <Coins className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
