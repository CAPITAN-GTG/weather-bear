import { useState, useEffect } from 'react';
import { User, X } from 'lucide-react';

interface UserAvatarProps {
  ownedHats: string[];
}

const emojis = [
  '😊', '😎', '🤔', '😄', '🥳', 
  '😤', '🤗', '😇', '🤩', '😋'
];

const hatImages = {
  ranchero: '/hat-ranchero.webp',
  pimp: '/hat-pimp.webp',
  yankeewithnobrim: '/hat-yankeewithnobrim.webp',
  doublebrim: '/hat-doublebrim.webp',
  straightcowboy: '/hat-straightcowboy.webp',
  prettyflowers: '/hat-prettyflowers.webp',
  gaycowboy: '/hat-gaycowboy.webp',
  holiday: '/hat-holiday.webp',
  witch: '/hat-witch.webp',
  goofyahh: '/hat-goofyahh.webp',
  doublehat: '/hat-doublehat.webp'
};

export default function UserAvatar({ ownedHats }: UserAvatarProps) {
  const [selectedEmoji, setSelectedEmoji] = useState('😊');
  const [selectedHat, setSelectedHat] = useState<string | null>(null);
  const [showCustomization, setShowCustomization] = useState(false);

  useEffect(() => {
    // Load saved preferences
    const savedEmoji = localStorage.getItem('userEmoji');
    const savedHat = localStorage.getItem('userHat');
    
    if (savedEmoji) setSelectedEmoji(savedEmoji);
    if (savedHat && savedHat !== 'null') setSelectedHat(savedHat);
  }, []);

  const handleEmojiChange = (emoji: string) => {
    setSelectedEmoji(emoji);
    localStorage.setItem('userEmoji', emoji);
  };

  const handleHatChange = (hatId: string | null) => {
    setSelectedHat(hatId);
    localStorage.setItem('userHat', hatId || 'null');
  };

  return (
    <>
      {/* Avatar Display - Always visible in top right */}
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-40">
        <button
          onClick={() => setShowCustomization(true)}
          className="relative w-16 h-16 bg-black/60 backdrop-blur-sm border-2 border-yellow-400 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-yellow-400/50"
        >
          {/* Emoji */}
          <span className="text-3xl">{selectedEmoji}</span>
          
          {/* Hat Overlay */}
          {selectedHat && (
            <img
              src={hatImages[selectedHat as keyof typeof hatImages]}
              alt="hat"
              className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-8 object-contain pointer-events-none"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-yellow-400/20 animate-pulse"></div>
        </button>
      </div>

      {/* Customization Modal */}
      {showCustomization && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl border-4 border-yellow-400 p-8 max-w-md w-full shadow-2xl shadow-yellow-400/20">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <User className="text-yellow-400 w-6 h-6" />
                <h3 className="font-bungee text-2xl text-yellow-400">
                  CUSTOMIZE AVATAR
                </h3>
              </div>
              <button
                onClick={() => setShowCustomization(false)}
                className="text-yellow-400 hover:text-white text-2xl font-bold hover:scale-110 transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Avatar Preview */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-black/30 rounded-full flex items-center justify-center border-2 border-yellow-400/50 mb-3">
                  <span className="text-5xl">{selectedEmoji}</span>
                                    {selectedHat && (
                    <img
                      src={hatImages[selectedHat as keyof typeof hatImages]}
                      alt="hat"
                      className="absolute -top-1.5 left-13 transform -translate-x-1/2 w-12 h-12 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  )}
                </div>
                <p className="text-yellow-300 text-sm">Your Casino Avatar</p>
              </div>
            </div>

            {/* Emoji Selection */}
            <div className="mb-6">
              <h4 className="text-white font-bungee mb-3">Choose Expression:</h4>
              <div className="grid grid-cols-5 gap-2">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiChange(emoji)}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl transition-all duration-200 ${
                      selectedEmoji === emoji
                        ? 'bg-yellow-400 border-2 border-yellow-300 scale-110'
                        : 'bg-gray-700 hover:bg-gray-600 border-2 border-gray-600'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Hat Selection */}
            <div>
              <h4 className="text-white font-bungee mb-3">Choose Hat:</h4>
              <div className="grid grid-cols-3 gap-3">
                {/* No Hat Option */}
                <button
                  onClick={() => handleHatChange(null)}
                  className={`p-3 rounded-xl text-center transition-all duration-200 ${
                    selectedHat === null
                      ? 'bg-yellow-400 text-black border-2 border-yellow-300'
                      : 'bg-gray-700 text-white hover:bg-gray-600 border-2 border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1">🚫</div>
                  <div className="text-xs font-bungee">NO HAT</div>
                </button>

                {/* Owned Hats */}
                {ownedHats.map((hatId) => (
                  <button
                    key={hatId}
                    onClick={() => handleHatChange(hatId)}
                    className={`p-3 rounded-xl text-center transition-all duration-200 ${
                      selectedHat === hatId
                        ? 'bg-yellow-400 text-black border-2 border-yellow-300'
                        : 'bg-gray-700 text-white hover:bg-gray-600 border-2 border-gray-600'
                    }`}
                  >
                    <div className="w-8 h-8 mx-auto mb-1 flex items-center justify-center">
                      <img
                        src={hatImages[hatId as keyof typeof hatImages]}
                        alt={hatId}
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '<div class="text-xl">🎩</div>';
                        }}
                      />
                    </div>
                    <div className="text-xs font-bungee uppercase">{hatId}</div>
                  </button>
                ))}
              </div>
              
              {ownedHats.length === 0 && (
                <div className="text-center py-6 text-gray-400">
                  <p className="text-sm">No hats owned yet!</p>
                  <p className="text-xs mt-1">Visit the shop to buy some cool hats! 🎩</p>
                </div>
              )}
            </div>


          </div>
        </div>
      )}
    </>
  );
} 