import { MapPin, DollarSign } from 'lucide-react';

interface BetLoadingWheelProps {
  betAmount: number;
  location: string;
  loadingStage: string;
}

export default function BetLoadingWheel({ betAmount, location, loadingStage }: BetLoadingWheelProps) {
  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-2xl border-2 border-yellow-400 p-8 text-center shadow-2xl shadow-yellow-400/20">
      
      {/* Spinning Wheel */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin shadow-lg"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl animate-pulse">🎰</div>
          </div>
        </div>
      </div>
      
      {/* Betting Status */}
      <div className="space-y-4">
        <h3 className="font-bungee text-2xl lg:text-3xl text-yellow-400">
          PLACING BET
        </h3>
        
        {/* Bet Details */}
        <div className="space-y-3">
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MapPin className="text-yellow-400 w-5 h-5" />
              <div className="text-sm text-yellow-300 font-medium">LOCATION</div>
            </div>
            <div className="text-white font-bungee text-lg">
              {location}
            </div>
          </div>
          
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="text-yellow-400 w-5 h-5" />
              <div className="text-sm text-yellow-300 font-medium">BET AMOUNT</div>
            </div>
            <div className="font-bungee text-2xl text-yellow-400">
              {betAmount.toLocaleString()}
            </div>
            <div className="text-yellow-300 text-sm">CREDITS</div>
          </div>
        </div>
        
        {/* Status Message */}
        <div className="text-yellow-300 text-sm font-bungee animate-pulse">
          {loadingStage || '🎲 Initializing...'}
        </div>
      </div>
      
      {/* Animated Dots */}
      <div className="flex justify-center gap-2 mt-6">
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
    </div>
  );
} 