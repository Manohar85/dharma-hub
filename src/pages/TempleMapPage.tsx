import { useState, useEffect, useCallback, memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ArrowLeft, Navigation, ExternalLink, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
const templeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Temple {
  id: number;
  name: string;
  lat: number;
  lon: number;
}

// Component to recenter map when position changes
const RecenterMap = memo(({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13, { animate: true });
  }, [lat, lng, map]);
  return null;
});

RecenterMap.displayName = 'RecenterMap';

const TempleMapPage = () => {
  const navigate = useNavigate();
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNearbyTemples = useCallback(async (lat: number, lon: number) => {
    try {
      // Overpass API query for Hindu temples within 8km
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="place_of_worship"]["religion"="hindu"](around:8000,${lat},${lon});
          way["amenity"="place_of_worship"]["religion"="hindu"](around:8000,${lat},${lon});
          node["building"="temple"](around:8000,${lat},${lon});
          way["building"="temple"](around:8000,${lat},${lon});
        );
        out center;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
        headers: {
          'Content-Type': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch temples');
      }

      const data = await response.json();
      
      const templeData: Temple[] = data.elements
        .filter((el: any) => el.tags?.name || el.tags?.['name:en'])
        .map((el: any, index: number) => ({
          id: el.id || index,
          name: el.tags?.name || el.tags?.['name:en'] || 'Hindu Temple',
          lat: el.lat || el.center?.lat,
          lon: el.lon || el.center?.lon,
        }))
        .filter((t: Temple) => t.lat && t.lon);

      setTemples(templeData);
    } catch (err) {
      console.error('Error fetching temples:', err);
      setError('Unable to load nearby temples. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserPosition([latitude, longitude]);
        fetchNearbyTemples(latitude, longitude);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('Please enable location access to find nearby temples');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  }, [fetchNearbyTemples]);

  const openInGoogleMaps = (lat: number, lon: number, name: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}&query_place_id=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
          <p className="text-muted-foreground">Finding nearby temples...</p>
        </div>
      </div>
    );
  }

  if (error && !userPosition) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <MapPin className="w-12 h-12 mx-auto text-destructive" />
          <p className="text-foreground font-medium">{error}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-display font-semibold">Nearby Temples</h1>
            <p className="text-xs text-muted-foreground">
              {temples.length} temples found within 8km
            </p>
          </div>
        </div>
      </header>

      {/* Map */}
      <div className="h-[calc(100vh-80px)] w-full">
        {userPosition && (
          <MapContainer
            center={userPosition}
            zoom={13}
            maxZoom={18}
            minZoom={10}
            className="h-full w-full"
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <RecenterMap lat={userPosition[0]} lng={userPosition[1]} />

            {/* User location marker */}
            <Marker position={userPosition} icon={userIcon}>
              <Popup>
                <div className="text-center p-1">
                  <Navigation className="w-4 h-4 mx-auto text-primary mb-1" />
                  <p className="font-medium text-sm">Your Location</p>
                </div>
              </Popup>
            </Marker>

            {/* Temple markers */}
            {temples.map((temple) => (
              <Marker
                key={temple.id}
                position={[temple.lat, temple.lon]}
                icon={templeIcon}
              >
                <Popup>
                  <div className="min-w-[180px] p-1">
                    <h3 className="font-medium text-sm mb-2">{temple.name}</h3>
                    <button
                      onClick={() => openInGoogleMaps(temple.lat, temple.lon, temple.name)}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open in Google Maps
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default TempleMapPage;
