'use client';

import { useEffect, useRef, useState } from 'react';
import { Globe, MapPin } from 'lucide-react';

interface WeatherMapProps {
  selectedLocation: { lat: number; lng: number } | null;
  onLocationSelect: (lat: number, lng: number) => void;
}

export default function WeatherMap({ 
  selectedLocation, 
  onLocationSelect
}: WeatherMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  
  // Initialize map only once
  useEffect(() => {
    if (isMapReady || mapInstanceRef.current) return;
    
    const initializeMap = async () => {
      // Check if Leaflet is already loaded
      if (!(window as any).L) {
        // Load CSS if not already loaded
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          link.rel = 'stylesheet';
          link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          link.crossOrigin = '';
          document.head.appendChild(link);
        }
        
        // Load JS if not already loaded
        if (!document.querySelector('script[src*="leaflet.js"]')) {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
          script.crossOrigin = '';
          
          script.onload = () => {
            createMap();
          };
          
          document.head.appendChild(script);
        } else {
          createMap();
        }
      } else {
        createMap();
      }
    };
    
    const createMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;
      
      const L = (window as any).L;
      
      // Initialize map
      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([20, 0], 2);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
      
      // Add click event to select location
      mapInstanceRef.current.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        onLocationSelect(lat, lng);
      });
      
      // Auto-rotation functionality
      let userInteracting = false;
      const spinEnabled = true;
      const secondsPerRevolution = 120;
      
      function spinGlobe() {
        if (spinEnabled && !userInteracting && mapInstanceRef.current && mapInstanceRef.current.getZoom() < 4) {
          const center = mapInstanceRef.current.getCenter();
          const newLng = center.lng + (360 / secondsPerRevolution);
          mapInstanceRef.current.panTo([center.lat, newLng], { animate: true, duration: 1 });
        }
      }
      
      // Pause spinning on interaction
      const handleInteractionStart = () => {
        userInteracting = true;
      };
      
      const handleInteractionEnd = () => {
        setTimeout(() => {
          userInteracting = false;
        }, 2000);
      };
      
      mapInstanceRef.current.on('dragstart', handleInteractionStart);
      mapInstanceRef.current.on('zoomstart', handleInteractionStart);
      mapInstanceRef.current.on('dragend', handleInteractionEnd);
      mapInstanceRef.current.on('zoomend', handleInteractionEnd);
      
      // Start spinning
      spinIntervalRef.current = setInterval(spinGlobe, 1000);
      
      setIsMapReady(true);
    };
    
    initializeMap();
    
    // Cleanup only the interval, not the map or DOM elements
    return () => {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
        spinIntervalRef.current = null;
      }
    };
  }, []);
  
  // Update marker when location changes
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !(window as any).L) return;
    
    const L = (window as any).L;
    
    // Remove existing marker
    if (markerRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
    
    // Add new marker if location is selected
    if (selectedLocation) {
      const markerIcon = L.divIcon({
        html: '<div class="animate-pulse bg-yellow-400 w-8 h-8 rounded-full border-4 border-yellow-300 shadow-lg shadow-yellow-400/50 flex items-center justify-center text-black font-bold text-lg">🎯</div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        className: 'location-marker'
      });
      
      markerRef.current = L.marker([selectedLocation.lat, selectedLocation.lng], { icon: markerIcon })
        .addTo(mapInstanceRef.current);
    }
  }, [selectedLocation, isMapReady]);
  
  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-2xl border-2 border-yellow-400/50 overflow-hidden shadow-2xl">
      <div 
        className="bg-gradient-to-r from-yellow-400/20 via-yellow-400/10 to-yellow-400/20 backdrop-blur-sm border-b-2 border-yellow-400/30 px-6 py-4"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Globe className="text-yellow-400 w-8 h-8" />
            <h2 className="font-bungee text-2xl lg:text-3xl text-yellow-400">
              WORLD MAP
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {isMapReady && (
              <div className="flex items-center gap-2 text-yellow-400">
                <div className="animate-spin text-xl">🌍</div>
                <span className="text-sm font-semibold">SPINNING...</span>
              </div>
            )}
            {!isMapReady && (
              <div className="flex items-center gap-2 text-yellow-400">
                <div className="animate-spin text-xl">⏳</div>
                <span className="text-sm font-semibold">LOADING...</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-yellow-300 text-sm mt-2 font-medium">
          {!isMapReady 
            ? "Loading interactive world map..."
            : selectedLocation 
              ? "🎯 Location locked in! Ready to place your bet."
              : "🎲 Click anywhere on the map to select your betting location!"
          }
        </p>
      </div>
      
      <div className="relative">
        <div 
          ref={mapRef} 
          className="w-full h-64 sm:h-80 lg:h-96 xl:h-[500px] cursor-crosshair"
        />
        
        {/* Loading overlay */}
        {!isMapReady && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin text-6xl mb-4">🌍</div>
              <div className="text-lg text-yellow-400 font-bungee">
                LOADING WORLD MAP...
              </div>
            </div>
          </div>
        )}
        
        {/* Selection indicator */}
        {selectedLocation && (
          <div className="absolute top-4 right-4 bg-yellow-400/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <div className="flex items-center gap-2">
              <MapPin className="text-black w-4 h-4" />
              <span className="text-black font-bold text-sm">
                {selectedLocation.lat.toFixed(2)}, {selectedLocation.lng.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 