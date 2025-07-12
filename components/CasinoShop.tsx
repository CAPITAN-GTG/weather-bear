import { useState, useEffect } from 'react';
import { Coins, ShoppingBag, Check, X } from 'lucide-react';

interface Hat {
  id: string;
  name: string;
  price: number;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface CasinoShopProps {
  showShop: boolean;
  setShowShop: (show: boolean) => void;
  credits: number;
  setCredits: (credits: number) => void;
  onPurchase: (hatId: string) => void;
}

const hats: Hat[] = [
  // Common Hats (100-500 credits)
  { id: 'ranchero', name: 'Ranchero Hat', price: 100, image: '/hat-ranchero.webp', rarity: 'common' },
  { id: 'pimp', name: 'Pimp Hat', price: 200, image: '/hat-pimp.webp', rarity: 'common' },
  { id: 'yankeewithnobrim', name: 'Yankee No Brim', price: 500, image: '/hat-yankeewithnobrim.webp', rarity: 'common' },
  
  // Rare Hats (1,000-5,000 credits)
  { id: 'doublebrim', name: 'Double Brim', price: 1000, image: '/hat-doublebrim.webp', rarity: 'rare' },
  { id: 'straightcowboy', name: 'Straight Cowboy', price: 2000, image: '/hat-straightcowboy.webp', rarity: 'rare' },
  { id: 'prettyflowers', name: 'Pretty Flowers', price: 3000, image: '/hat-prettyflowers.webp', rarity: 'rare' },
  { id: 'gaycowboy', name: 'Gay Cowboy', price: 5000, image: '/hat-gaycowboy.webp', rarity: 'rare' },
  
  // Epic Hats (10,000-25,000 credits)
  { id: 'holiday', name: 'Holiday Hat', price: 10000, image: '/hat-holiday.webp', rarity: 'epic' },
  { id: 'witch', name: 'Witch Hat', price: 15000, image: '/hat-witch.webp', rarity: 'epic' },
  { id: 'goofyahh', name: 'Goofy Ahh Hat', price: 25000, image: '/hat-goofyahh.webp', rarity: 'epic' },
  
  // Legendary Hats (50,000-100,000 credits)
  { id: 'doublehat', name: 'Double Hat', price: 100000, image: '/hat-doublehat.webp', rarity: 'legendary' }
];

const rarityColors = {
  common: 'from-gray-600 to-gray-800 border-gray-500',
  rare: 'from-blue-600 to-blue-800 border-blue-500',
  epic: 'from-purple-600 to-purple-800 border-purple-500',
  legendary: 'from-yellow-600 to-yellow-800 border-yellow-500'
};

export default function CasinoShop({ showShop, setShowShop, credits, setCredits, onPurchase }: CasinoShopProps) {
  const [ownedHats, setOwnedHats] = useState<string[]>([]);

  useEffect(() => {
    // Load owned hats from localStorage
    const saved = localStorage.getItem('ownedHats');
    if (saved) {
      setOwnedHats(JSON.parse(saved));
    }
  }, []);

  const handlePurchase = (hat: Hat) => {
    if (credits >= hat.price && !ownedHats.includes(hat.id)) {
      const newCredits = credits - hat.price;
      const newOwnedHats = [...ownedHats, hat.id];
      
      setCredits(newCredits);
      setOwnedHats(newOwnedHats);
      onPurchase(hat.id);
      
      // Save to localStorage
      localStorage.setItem('credits', newCredits.toString());
      localStorage.setItem('ownedHats', JSON.stringify(newOwnedHats));
    }
  };

  if (!showShop) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl border-4 border-yellow-400 p-6 max-w-5xl w-full h-fit shadow-2xl shadow-yellow-400/20">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-yellow-400 w-6 h-6" />
            <h2 className="font-bungee text-2xl text-yellow-400">
              CASINO SHOP
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-1 border border-yellow-400/50">
              <Coins className="text-yellow-400 w-4 h-4" />
              <span className="text-yellow-400 font-bungee text-sm">{credits.toLocaleString()}</span>
            </div>
            <button
              onClick={() => setShowShop(false)}
              className="text-yellow-400 hover:text-white text-2xl font-bungee hover:scale-110 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Shop Description */}
        <div className="text-center mb-4">
          <p className="text-yellow-300 text-sm font-bungee">
            🎩 Customize your avatar with exclusive casino hats! 🎩
          </p>
        </div>
        
        {/* Hats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {hats.map((hat) => {
            const isOwned = ownedHats.includes(hat.id);
            const canAfford = credits >= hat.price;
            
            return (
              <div
                key={hat.id}
                className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${rarityColors[hat.rarity]} border-2 p-3 shadow-lg transition-all duration-200 hover:scale-105`}
              >
                {/* Rarity Badge */}
                <div className="absolute top-1 right-1">
                  <div className={`px-1 py-0.5 rounded text-xs font-bungee uppercase ${
                    hat.rarity === 'legendary' ? 'bg-yellow-400 text-black' :
                    hat.rarity === 'epic' ? 'bg-purple-400 text-white' :
                    hat.rarity === 'rare' ? 'bg-blue-400 text-white' :
                    'bg-gray-400 text-white'
                  }`}>
                    {hat.rarity.charAt(0)}
                  </div>
                </div>
                
                {/* Hat Image */}
                <div className="text-center mb-3">
                  <div className="w-16 h-16 mx-auto bg-black/30 rounded-full flex items-center justify-center mb-2 border-2 border-white/20">
                    <img 
                      src={hat.image} 
                      alt={hat.name}
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        // Fallback if image doesn't exist
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<div class="text-2xl">🎩</div>';
                      }}
                    />
                  </div>
                  <h3 className="text-white font-bungee text-xs">{hat.name}</h3>
                </div>
                
                {/* Price and Status */}
                <div className="text-center">
                  {isOwned ? (
                    <div className="bg-green-600 text-white py-1 px-2 rounded-lg font-bungee text-xs flex items-center justify-center gap-1">
                      <Check className="w-3 h-3" />
                      OWNED
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePurchase(hat)}
                      disabled={!canAfford}
                      className={`w-full py-1 px-2 rounded-lg font-bungee text-xs transition-all duration-200 ${
                        canAfford
                          ? 'bg-yellow-400 hover:bg-yellow-500 text-black hover:scale-105'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <Coins className="w-3 h-3" />
                        <span>{hat.price.toLocaleString()}</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-xs font-bungee">
            💡 Win big to unlock legendary items!
          </p>
        </div>
      </div>
    </div>
  );
} 