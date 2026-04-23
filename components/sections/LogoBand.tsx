import Image from 'next/image'

export function LogoBand() {
  return (
    <section className="bg-navy-950 py-14 px-4 border-t border-b border-navy-800">
      <div className="max-w-xl mx-auto flex items-center justify-center gap-4">
        <Image
          src="/images/logo/maono-logo.png"
          alt="Maono Forex Trading"
          width={56}
          height={56}
          className="object-contain"
          style={{ width: 'auto', height: '56px' }}
        />
        <span className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-white">
          Maono
        </span>
      </div>
    </section>
  )
}
