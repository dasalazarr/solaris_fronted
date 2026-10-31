import { Demo } from '../components/Demo'

/** The interactive purchase-process demo on its own, for sharing and previews. */
export function DemoPage() {
  return (
    <main className="bg-paper">
      <Demo standalone />
    </main>
  )
}
