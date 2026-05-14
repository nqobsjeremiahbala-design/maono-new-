'use client'
import { useEffect, useRef } from 'react'

export default function NewsPage() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.innerHTML = ''
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js'
      script.async = true
      script.innerHTML = JSON.stringify({
        feedMode: 'market',
        market: 'forex',
        isTransparent: false,
        displayMode: 'regular',
        width: '100%',
        height: 550,
        colorTheme: 'dark',
        locale: 'en',
      })
      timelineRef.current.appendChild(script)
    }

    if (calendarRef.current) {
      calendarRef.current.innerHTML = ''
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js'
      script.async = true
      script.innerHTML = JSON.stringify({
        colorTheme: 'dark',
        isTransparent: false,
        width: '100%',
        height: 550,
        locale: 'en',
        importanceFilter: '-1,0,1',
        countryFilter: 'us,eu,gb,za',
      })
      calendarRef.current.appendChild(script)
    }
  }, [])

  return (
    <>
      <section className="bg-navy-950 py-16 md:py-20 px-5 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">Market Intelligence</p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-4">
            News Feed
          </h1>
          <p className="text-navy-300 text-base sm:text-lg">
            Live forex news and economic calendar — everything moving the market, in one place.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-5 sm:px-6 bg-navy-900">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-serif text-xl text-white mb-4">Market News</h2>
            <div ref={timelineRef} className="tradingview-widget-container">
              <div className="tradingview-widget-container__widget" />
            </div>
          </div>
          <div>
            <h2 className="font-serif text-xl text-white mb-4">Economic Calendar</h2>
            <div ref={calendarRef} className="tradingview-widget-container">
              <div className="tradingview-widget-container__widget" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
