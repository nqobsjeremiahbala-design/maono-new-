export function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-lg bg-white border border-navy-100 shadow-card ${className}`}>
      {children}
    </div>
  )
}
