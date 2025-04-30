"use client"

import { useState, useEffect } from "react"
import EarthGlobe, { LocationData } from "@/components/earth-globe"

export async function getVisitorLocation(): Promise<LocationData | null> {
  try {
    const response = await fetch("https://ipapi.co/json/")

    if (!response.ok) {
      throw new Error("Failed to fetch location data")
    }

    const data = await response.json()

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
      country: data.country_name,
    }
  } catch (error) {
    console.error("Error getting visitor location:", error)
    return null
  }
}

function GlobeWithLocation() {
  const [visitorLocation, setVisitorLocation] = useState<LocationData | null>(null)

  useEffect(() => {
    async function fetchLocation() {
      try {
        const location = await getVisitorLocation()

        if (location) {
          setVisitorLocation(location)
        }
      } catch (error) {
        console.error("Failed to get location:", error)
      }
    }

    fetchLocation()
  }, [])

  return (
    <div>
      <div className="flex justify-center items-center mx-8">
        {visitorLocation && (
          <div className="bg-black/70 p-4 rounded-lg">
            <h2 className="m-0 mb-2.5">Your Location</h2>
            <p className="my-1">
              {visitorLocation.city ? `${visitorLocation.city}, ` : ""}
              {visitorLocation.country || "Unknown"}
            </p>
            <p className="my-1 text-sm">
              Lat: {visitorLocation.latitude.toFixed(4)}, Long: {visitorLocation.longitude.toFixed(4)}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center mx-32">
        <EarthGlobe visitorLocation={visitorLocation || undefined} />
      </div>

    </div>
  )
}

export default GlobeWithLocation