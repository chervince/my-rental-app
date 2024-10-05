//app/parcels/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Parcel = {
    id: string
    title: string
    description: string
    // Ajoutez d'autres propriétés selon vos besoins
}

export default function Parcels() {
    const [parcels, setParcels] = useState<Parcel[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClientComponentClient()

    useEffect(() => {
        const fetchParcels = async () => {
            try {
                const { data, error } = await supabase
                    .from('parcels')
                    .select('*')
                if (error) throw error
                setParcels(data)
            } catch (error) {
                console.error('Error fetching parcels:', error)
                setError('Impossible de charger les parcelles')
            } finally {
                setIsLoading(false)
            }
        }
        fetchParcels()
    }, [supabase])

    if (isLoading) {
        return <div>Chargement des parcelles...</div>
    }

    if (error) {
        return <div>Erreur : {error}</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Parcelles disponibles</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {parcels.map((parcel) => (
                    <Card key={parcel.id}>
                        <CardHeader>
                            <CardTitle>{parcel.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{parcel.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}