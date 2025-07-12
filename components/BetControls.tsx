import { Minus, Plus, DollarSign, TrendingUp, Info } from 'lucide-react';

interface BetControlsProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  credits: number;
  selectedLocation: { lat: number; lng: number } | null;
  pendingBet: number;
  onPlaceBet: () => void;
  loading: boolean;
  setShowPayoutTable: (show: boolean) => void;
}

export default function BetControls({
  betAmount,
  setBetAmount,
  credits,
  selectedLocation,
  pendingBet,
  onPlaceBet,
  loading,
  setShowPayoutTable
}: BetControlsProps) {
  const canPlaceBet = selectedLocation && credits >= betAmount && pendingBet === 0 && !loading;
  
  const betAmounts = [25, 50, 100, 250, 500];
  
  return (
    <div className="space-y-4">
      
      {/* Bet Amount Selection */}
      <div className="bg-black/60 backdrop-blur-sm rounded-2xl border-2 border-yellow-400/50 p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="text-yellow-400 w-6 h-6" />
          <h3 className="font-bungee text-xl text-yellow-400">
            BET AMOUNT
          </h3>
        </div>
        
        {/* Current Bet Display */}
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-yellow-400 font-bungee">
            {betAmount.toLocaleString()}
          </div>
          <div className="text-sm text-yellow-300">CREDITS</div>
        </div>
        
        {/* Bet Amount Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {betAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => setBetAmount(amount)}
              disabled={credits < amount}
              className={`py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 ${
                betAmount === amount
                  ? 'bg-yellow-400 text-black border-2 border-yellow-300 shadow-lg'
                  : credits >= amount
                    ? 'bg-gray-800 text-yellow-400 border-2 border-yellow-400/30 hover:bg-yellow-400/10 hover:border-yellow-400/50'
                    : 'bg-gray-700 text-gray-500 border-2 border-gray-600 cursor-not-allowed'
              }`}
            >
              {amount}
            </button>
          ))}
        </div>
        
        {/* All In Button */}
        <button
          onClick={() => setBetAmount(credits)}
          disabled={credits <= 0}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm mb-4 transition-all duration-200 ${
            betAmount === credits
              ? 'bg-red-500 text-white border-2 border-red-400 shadow-lg scale-105'
              : credits > 0
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500 hover:scale-105'
                : 'bg-gray-700 text-gray-500 border-2 border-gray-600 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="font-bungee">ALL IN</span>
            <span className="text-sm">({credits.toLocaleString()})</span>
          </div>
        </button>
        
        {/* Custom Amount Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBetAmount(Math.max(0, betAmount - 25))}
            disabled={betAmount <= 0}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="flex-1 text-center">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || value === '0') {
                  setBetAmount(0);
                } else {
                  const numValue = parseInt(value);
                  if (!isNaN(numValue) && numValue >= 0) {
                    setBetAmount(numValue);
                  }
                }
              }}
              className="w-full bg-gray-800 text-yellow-400 text-center font-bold py-2 px-3 rounded-xl border-2 border-yellow-400/30 focus:border-yellow-400 focus:outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              placeholder="Enter bet amount"
            />
          </div>
          <button
            onClick={() => setBetAmount(betAmount + 25)}
            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Place Bet Button */}
      <button
        onClick={onPlaceBet}
        disabled={!canPlaceBet}
        className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 border-2 ${
          canPlaceBet
            ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-green-500 shadow-lg hover:shadow-xl transform hover:scale-105'
            : 'bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed'
        }`}
      >
        {!selectedLocation ? (
          <div className="flex items-center justify-center gap-2">
            <span>SELECT LOCATION FIRST</span>
          </div>
        ) : credits < betAmount ? (
          <div className="flex items-center justify-center gap-2">
            <span>INSUFFICIENT CREDITS</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span className="font-bungee">PLACE BET</span>
          </div>
        )}
      </button>
      
      {/* Payout Table Button */}
      <button
        onClick={() => setShowPayoutTable(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-2xl font-bold text-sm transition-all duration-200 border-2 border-blue-500 shadow-lg hover:shadow-xl"
      >
        <div className="flex items-center justify-center gap-2">
          <Info className="w-4 h-4" />
          <span>VIEW PAYOUT TABLE</span>
        </div>
      </button>
      
      {/* Game Status */}
      {selectedLocation && (
        <div className="bg-green-900/30 backdrop-blur-sm border-2 border-green-500/50 rounded-2xl p-4 text-center">
          <div className="text-green-400 text-sm font-bold mb-1">
            🎯 LOCATION SELECTED
          </div>
          <div className="text-green-300 text-xs">
            Coordinates: {selectedLocation.lat.toFixed(2)}, {selectedLocation.lng.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
} 