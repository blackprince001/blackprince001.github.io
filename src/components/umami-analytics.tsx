'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

export default function UmamiAnalytics() {
  const [isProduction, setIsProduction] = useState(false)

  useEffect(() => {
    // Check if we're on the production domain
    if (typeof window !== 'undefined')
    {
      setIsProduction(window.location.hostname === 'blackprince001.github.io')
    }
  }, [])

  // Only load analytics in production
  if (!isProduction)
  {
    return null
  }

  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id="5c9f600a-7383-4013-b589-a7dc61bf1ba4"
      strategy="afterInteractive"
    />
  )
}
