import Link from 'next/link'
import { Logo } from '@/components/ui'

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-ink px-5 text-center text-white">
      <div className="max-w-md">
        <Logo className="justify-center" />
        <h1 className="headline mt-10 text-[40px]">Esta página no existe</h1>
        <p className="mt-4 text-white/68">Puede que el enlace esté mal escrito o que la página se haya movido.</p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center rounded-full bg-solar px-5 text-[15px] font-medium text-ink transition hover:bg-[#f6c565]"
        >
          Volver a Solaris
        </Link>
      </div>
    </main>
  )
}
