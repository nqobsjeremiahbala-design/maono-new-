'use client'
import { useEffect, useRef } from 'react'

export function TradingViewTicker() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    if (containerRef.current.querySelector('script')) return

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
    script.async = true
    script.type = 'text/javascript'
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'FX:EURUSD', title: 'EUR/USD' },
        { proName: 'FX:GBPUSD', title: 'GBP/USD' },
        { proName: 'FX:USDJPY', title: 'USD/JPY' },
        { proName: 'OANDA:USDZAR', title: 'USD/ZAR' },
        { proName: 'OANDA:XAUUSD', title: 'Gold' },
        { proName: 'TVC:DXY', title: 'DXY' },
        { proName: 'BITSTAMP:BTCUSD', title: 'BTC/USD' },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'en',
    })
    containerRef.current.appendChild(script)
  }, [])

  return (
    <section aria-label="Live market data" className="bg-navy-950 border-y border-navy-800">
      <div ref={containerRef} className="tradingview-widget-container">
        <div className="tradingview-widget-container__widget" />
      </div>
    </section>
  )
}
