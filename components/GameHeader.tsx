interface GameHeaderProps {
  credits: number;
  pendingBet: number;
}

export default function GameHeader({ credits, pendingBet }: GameHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-600 p-3 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="text-3xl">🌪️</div>
          <div>
            <h1 className="text-2xl font-bungee text-yellow-400">Weather Wheel</h1>
            <p className="text-sm text-gray-300">Worst Weather Wins!</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="bg-green-600 px-4 py-2 rounded-lg border border-green-400 shadow-lg">
            <div className="text-sm text-green-100">Available Credits</div>
            <div className="text-xl font-bungee text-green-100">{credits.toLocaleString()}</div>
          </div>
          
          {pendingBet > 0 && (
            <div className="bg-yellow-600 px-4 py-2 rounded-lg border border-yellow-400 shadow-lg">
              <div className="text-sm text-yellow-100">Pending Bet</div>
              <div className="text-xl font-bungee text-yellow-100">{pendingBet.toLocaleString()}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 