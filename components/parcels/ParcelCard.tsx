// components/parcels/ParcelCard.tsx

import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Terrain } from '@/app/types/formTypes'

type ParcelCardProps = {
    terrain: Terrain
}

export default function ParcelCard({ terrain }: ParcelCardProps) {
    const imageUrl = terrain.image_mise_en_avant?.url || '/images/placeholder-image.jpg';

    return (
        <Card className="overflow-hidden">
            <div className="relative w-full h-48">
                <Image
                    src={imageUrl}
                    alt={terrain.image_mise_en_avant?.legende || `Image de ${terrain.titre}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="transition-transform duration-300 ease-in-out hover:scale-105"
                />
            </div>
            <CardHeader>
                <CardTitle>{terrain.titre}</CardTitle>
            </CardHeader>
            <CardContent>
                {terrain.description && (
                    <p className="text-sm text-gray-600 mb-2">{terrain.description}</p>
                )}
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <p><strong>Prix:</strong> {terrain.prix_par_jour}€ par jour</p>
                    <p><strong>Capacité:</strong> {terrain.capacite_max || 'Non spécifiée'}</p>
                    <p><strong>Emplacement:</strong> {terrain.emplacement}</p>
                </div>
            </CardContent>
        </Card>
    )
}