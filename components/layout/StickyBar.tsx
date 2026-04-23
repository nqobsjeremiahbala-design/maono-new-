import Link from 'next/link'

export function StickyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-navy-950 border-t border-navy-800 px-4 py-3 flex items-center justify-between gap-3">
      <p className="text-xs text-navy-300 leading-tight">
        Free signals group<br />
        <span className="text-white font-medium">Zero cost. Real analysis.</span>
      </p>
      <Link
        href="/signals"
        className="shrink-0 bg-gold-500 text-navy-950 font-semibold text-sm px-4 py-2 rounded-md"
      >
        Join free →
      </Link>
    </div>
  )
}
