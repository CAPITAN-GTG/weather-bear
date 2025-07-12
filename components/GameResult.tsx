import { RotateCcw, TrendingUp, TrendingDown, MapPin, Thermometer } from 'lucide-react';

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

interface GameResultProps {
  gameResult: GameResult;
  showResult: boolean;
  onPlayAgain: () => void;
  credits: number;
}

const rarityColors = {
  common: 'from-red-600 to-red-800',      // Bad weather = red (losses)
  uncommon: 'from-red-400 to-red-600',    // Light rain = red (losses)
  rare: 'from-blue-400 to-blue-600',      // Heavy rain = blue (wins)
  epic: 'from-purple-400 to-purple-600',  // Snow = purple (good wins)
  legendary: 'from-yellow-400 to-orange-600' // Extreme = gold (big wins)
};

const rarityBorders = {
  common: 'border-red-500',
  uncommon: 'border-red-400',
  rare: 'border-blue-400',
  epic: 'border-purple-400',
  legendary: 'border-yellow-400'
};

const rarityEmoji = {
  common: '☀️',     // Sunny = worst outcome
  uncommon: '🌧️',   // Light rain = small loss
  rare: '⛈️',      // Storms = decent win
  epic: '❄️',      // Snow = good win
  legendary: '🌪️'  // Extreme = jackpot
};

export default function GameResult({ gameResult, showResult, onPlayAgain, credits }: GameResultProps) {
  if (!gameResult) return null;
  
  return (
    <div className={`bg-black/60 backdrop-blur-sm rounded-2xl border-2 ${rarityBorders[gameResult.rarity]} p-6 shadow-2xl transition-all duration-500 ${
      showResult ? 'opacity-100 scale-100' : 'opacity-75 scale-95'
    }`}>
      
      {/* Result Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-4 mb-3">
          <img 
            src={`https://openweathermap.org/img/wn/${gameResult.weather.icon}@2x.png`}
            alt={gameResult.weather.description}
            className="w-16 h-16 rounded-full bg-white/20 p-2"
          />
          <div className={`text-5xl ${gameResult.isWin ? 'animate-bounce' : ''}`}>
            {rarityEmoji[gameResult.rarity]}
          </div>
        </div>
        
        <div className={`inline-block px-4 py-2 rounded-xl bg-gradient-to-r ${rarityColors[gameResult.rarity]} text-white font-bold text-sm uppercase tracking-wide mb-3 shadow-lg`}>
          {gameResult.rarity}
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-2">
          <MapPin className="text-yellow-400 w-5 h-5" />
          <h3 className="font-bungee text-xl text-yellow-400">
            {gameResult.weather.location}
          </h3>
        </div>
        <p className="text-gray-300 text-lg font-semibold mb-1">
          {gameResult.weather.description}
        </p>
        <p className="text-gray-400 text-sm">
          {gameResult.weather.lat.toFixed(2)}, {gameResult.weather.lng.toFixed(2)}
        </p>
      </div>
      
      {/* Weather Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30">
          <div className="flex items-center gap-2 mb-2">
            <Thermometer className="text-blue-400 w-4 h-4" />
            <div className="text-xs text-blue-300 font-medium">TEMPERATURE</div>
          </div>
          <div className="text-2xl font-bold text-blue-400">
            {gameResult.weather.temperature}°F
          </div>
        </div>
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
          <div className="flex items-center gap-2 mb-2">
            {gameResult.isWin ? (
              <TrendingUp className="text-green-400 w-4 h-4" />
            ) : (
              <TrendingDown className="text-red-400 w-4 h-4" />
            )}
            <div className="text-xs text-purple-300 font-medium">MULTIPLIER</div>
          </div>
          <div className={`text-2xl font-bold ${gameResult.isWin ? 'text-green-400' : 'text-red-400'}`}>
            {gameResult.multiplier}x
          </div>
        </div>
      </div>
      
      {/* Payout Result */}
      <div className={`text-center p-6 rounded-2xl mb-6 border-2 ${
        gameResult.isWin 
          ? 'bg-gradient-to-r from-green-900/50 to-green-800/50 border-green-400 shadow-lg shadow-green-400/20' 
          : 'bg-gradient-to-r from-red-900/50 to-red-800/50 border-red-400 shadow-lg shadow-red-400/20'
      }`}>
        <div className="text-lg font-bold mb-2">
          {gameResult.isWin ? (
            <span className="text-green-400">🎉 DISASTER WIN! 🎉</span>
          ) : (
            <span className="text-red-400">😭 NICE WEATHER LOSS! 😭</span>
          )}
        </div>
        <div className="font-bungee text-3xl font-bold mb-1">
          {gameResult.isWin ? '+' : ''}{gameResult.payout.toLocaleString()}
        </div>
        <div className="text-sm font-medium opacity-80">
          CREDITS {gameResult.isWin ? 'WON' : 'LOST'}
        </div>
      </div>
      
      {/* Play Again or Need Money Button */}
      {credits > 0 ? (
        <button
          onClick={onPlayAgain}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border-2 border-yellow-400"
        >
          <div className="flex items-center justify-center gap-3">
            <RotateCcw className="w-5 h-5" />
            <span className="font-bungee text-lg">PLAY AGAIN</span>
          </div>
        </button>
      ) : (
        <a
          href="https://onlyfans.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border-2 border-pink-400 block text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">💰</span>
                         <span className="font-bungee text-lg">NEED MORE MONEY?</span>
          </div>
        </a>
      )}
    </div>
  );
} 