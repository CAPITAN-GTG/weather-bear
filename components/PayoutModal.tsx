interface PayoutModalProps {
  showPayoutTable: boolean;
  setShowPayoutTable: (show: boolean) => void;
}

export default function PayoutModal({ showPayoutTable, setShowPayoutTable }: PayoutModalProps) {
  if (!showPayoutTable) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4" style={{zIndex: 10000}}>
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl border-4 border-yellow-400 p-8 max-w-lg w-full shadow-2xl shadow-yellow-400/20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-center flex-1">
            <h3 className="font-bungee text-3xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
              🎰 PAYOUT TABLE 🎰
            </h3>
            <div className="text-sm text-yellow-400 font-semibold mt-1 tracking-wider">
              WEATHER WHEEL CASINO
            </div>
          </div>
          <button
            onClick={() => setShowPayoutTable(false)}
            className="text-yellow-400 hover:text-white text-3xl font-bold ml-4 hover:scale-110 transition-all duration-200"
          >
            ×
          </button>
        </div>
        
        {/* Payout Cards */}
        <div className="space-y-4">
          {/* Clear Weather - Losing Card */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-900 via-red-800 to-red-900 border-2 border-red-600 p-4 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-600/20 to-transparent"></div>
            <div className="relative flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="text-3xl drop-shadow-lg">☀️</div>
                <div>
                  <div className="text-lg font-bold text-white">CLEAR WEATHER</div>
                  <div className="text-sm text-red-200 font-semibold">Total Loss!</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-red-300">LOSE ALL</div>
                <div className="text-sm text-red-400 font-semibold">0x PAYOUT</div>
              </div>
            </div>
          </div>
          
          {/* Light Rain - Small Loss */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-900 via-orange-800 to-orange-900 border-2 border-orange-600 p-4 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-600/20 to-transparent"></div>
            <div className="relative flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="text-3xl drop-shadow-lg">🌧️</div>
                <div>
                  <div className="text-lg font-bold text-white">LIGHT RAIN</div>
                  <div className="text-sm text-orange-200 font-semibold">Small Loss</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-orange-300">0.5x</div>
                <div className="text-sm text-orange-400 font-semibold">PAYOUT</div>
              </div>
            </div>
          </div>
          
          {/* Storms - Win */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 border-2 border-blue-400 p-4 shadow-lg shadow-blue-400/20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"></div>
            <div className="relative flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="text-3xl drop-shadow-lg">⛈️</div>
                <div>
                  <div className="text-lg font-bold text-white">STORMS</div>
                  <div className="text-sm text-blue-200 font-semibold">Nice Win!</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-400">5x WIN</div>
                <div className="text-sm text-green-300 font-semibold">PAYOUT</div>
              </div>
            </div>
          </div>
          
          {/* Snow - Big Win */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 border-2 border-purple-400 p-4 shadow-lg shadow-purple-400/20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"></div>
            <div className="relative flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="text-3xl drop-shadow-lg">❄️</div>
                <div>
                  <div className="text-lg font-bold text-white">SNOW</div>
                  <div className="text-sm text-purple-200 font-semibold">Big Win!</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-400">10x WIN</div>
                <div className="text-sm text-green-300 font-semibold">PAYOUT</div>
              </div>
            </div>
          </div>
          
          {/* Extreme - Jackpot */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-yellow-900 via-yellow-800 to-yellow-900 border-2 border-yellow-400 p-4 shadow-lg shadow-yellow-400/30">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent animate-pulse"></div>
            <div className="relative flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="text-3xl drop-shadow-lg animate-bounce">🌪️</div>
                <div>
                  <div className="text-lg font-bold text-white">EXTREME</div>
                  <div className="text-sm text-yellow-200 font-semibold">JACKPOT!</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-yellow-400 animate-pulse">25x JACKPOT</div>
                <div className="text-sm text-yellow-300 font-semibold">PAYOUT</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Casino Footer */}
        <div className="mt-6 p-4 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-xl border border-yellow-400/50">
          <div className="text-center">
            <div className="font-bungee text-lg font-bold text-yellow-400 mb-1">🎲 HOUSE RULES 🎲</div>
            <p className="text-sm text-gray-300">
              <span className="text-red-400">☀️ Sunny Days = Lose Everything</span> • <span className="text-green-400">🌪️ Disasters = Win Big!</span>
            </p>
            <div className="text-xs text-gray-400 mt-2 font-semibold tracking-wide">
              GAMBLE RESPONSIBLY • WEATHER WHEEL CASINO
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 