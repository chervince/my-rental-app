// app/parcels/page.tsx
import ParcelList from '@/components/parcels/ParcelList'

export default function ParcelsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Terrains disponibles</h1>
            <ParcelList />
        </div>
    )
}