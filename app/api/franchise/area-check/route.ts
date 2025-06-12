import { NextRequest, NextResponse } from 'next/server';
import { ServiceCategory } from '@/components/EHB-Franchise/FranchiseUtils/FranchiseTypes';

interface AreaAvailabilityResponse {
  isAvailable: boolean;
  message: string;
  existingFranchises?: {
    name: string;
    type: string;
    distance: number;
  }[];
}

// Mock database of existing franchises
const existingFranchises = [
  {
    name: 'GoSellr Express Lahore',
    type: 'SUB',
    location: 'Lahore',
    coordinates: { lat: 31.5204, lng: 74.3587 },
  },
  {
    name: 'GoSellr Master Karachi',
    type: 'MASTER',
    location: 'Karachi',
    coordinates: { lat: 24.8607, lng: 67.0011 },
  },
  {
    name: 'GoSellr Corporate Islamabad',
    type: 'CORPORATE',
    location: 'Islamabad',
    coordinates: { lat: 33.6844, lng: 73.0479 },
  },
];

// Mock geocoding function
async function geocodeAddress(address: string) {
  // TODO: Implement actual geocoding using a service like Google Maps
  return {
    lat: 31.5204,
    lng: 74.3587,
  };
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { area, serviceCategory } = body;

    if (!area) {
      return NextResponse.json({ error: 'Area is required' }, { status: 400 });
    }

    // Geocode the provided area
    const coordinates = await geocodeAddress(area);

    // Check for existing franchises in the area
    const nearbyFranchises = existingFranchises
      .map(franchise => ({
        ...franchise,
        distance: calculateDistance(
          coordinates.lat,
          coordinates.lng,
          franchise.coordinates.lat,
          franchise.coordinates.lng
        ),
      }))
      .filter(franchise => franchise.distance <= 10) // Within 10km radius
      .sort((a, b) => a.distance - b.distance);

    const response: AreaAvailabilityResponse = {
      isAvailable: nearbyFranchises.length === 0,
      message:
        nearbyFranchises.length === 0
          ? 'Area is available for franchise'
          : 'Area has existing franchises nearby',
      existingFranchises: nearbyFranchises.map(franchise => ({
        name: franchise.name,
        type: franchise.type,
        distance: Math.round(franchise.distance * 10) / 10, // Round to 1 decimal place
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Area check error:', error);
    return NextResponse.json({ error: 'Failed to check area availability' }, { status: 500 });
  }
}
