'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin, Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Place {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
}

export default function NearbyPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        initializeMap(latitude, longitude);
        fetchNearbyPlaces(latitude, longitude);
      },
      (err) => {
        setError('Unable to retrieve your location.');
        setLoading(false);
      }
    );
  };

  const initializeMap = async (lat: number, lng: number) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      setError('Google Places API key not configured.');
      return;
    }

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places'],
    });

    try {
      const { Map } = await loader.importLibrary('maps');
      const { Marker } = await loader.importLibrary('marker');

      const mapOptions: google.maps.MapOptions = {
        center: { lat, lng },
        zoom: 14,
        mapId: 'nearby-health-centers',
      };

      if (mapRef.current) {
        mapInstanceRef.current = new Map(mapRef.current, mapOptions);

        // Add user location marker
        new Marker({
          position: { lat, lng },
          map: mapInstanceRef.current,
          title: 'Your Location',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#4285F4"/>
                <circle cx="12" cy="12" r="4" fill="white"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(24, 24),
          },
        });
      }
    } catch (err) {
      console.error('Error loading Google Maps:', err);
      setError('Failed to load Google Maps.');
    }
  };

  const fetchNearbyPlaces = async (lat: number, lng: number) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      setError('Google Places API key not configured.');
      setLoading(false);
      return;
    }

    try {
      // Use Text Search API for health centers and pharmacies
      const queries = ['health center near me', 'medical store near me', 'pharmacy near me', 'hospital near me'];

      const allPlaces: Place[] = [];

      for (const query of queries) {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${lat},${lng}&radius=5000&key=${apiKey}`
        );
        const data = await response.json();

        if (data.results) {
          allPlaces.push(...data.results);
        }
      }

      // Remove duplicates based on place_id
      const uniquePlaces = allPlaces.filter(
        (place, index, self) => index === self.findIndex((p) => p.place_id === place.place_id)
      );

      setPlaces(uniquePlaces);
    } catch (err) {
      setError('Failed to fetch nearby places.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nearby Health Centers & Medical Stores</h1>
        <Button onClick={getLocation} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
          Refresh Location
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Finding nearby places...</span>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {places.map((place) => (
          <Card key={place.place_id} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">{place.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{place.vicinity}</p>
                </div>
                {place.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{place.rating}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {place.types.includes('hospital') ? 'Hospital' :
                     place.types.includes('pharmacy') ? 'Pharmacy' :
                     place.types.includes('health') ? 'Health Center' : 'Medical'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!loading && places.length === 0 && !error && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No nearby places found. Try refreshing your location.</p>
        </div>
      )}
    </div>
  );
}
