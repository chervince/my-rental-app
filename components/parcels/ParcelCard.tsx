// components/parcels/ParcelCard.tsx
import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Terrain } from '@/app/types/formTypes'

type ParcelCardProps = {
    terrain: Terrain
}

export default function ParcelCard({ terrain }: ParcelCardProps) {
    return (
        <Card className="overflow-hidden">
            {terrain.image_mise_en_avant && (
                <div className="relative w-full h-48">
                    <Image
                        src={terrain.image_mise_en_avant.url}
                        alt={terrain.image_mise_en_avant.legende || `Image de ${terrain.titre}`}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 ease-in-out hover:scale-105"
                    />
                </div>
            )}
            <CardHeader>
                <CardTitle>{terrain.titre}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-600 mb-2">{terrain.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <p><strong>Prix:</strong> {terrain.prix_par_jour}€ par jour</p>
                    <p><strong>Capacité:</strong> {terrain.capacite_max} personnes</p>
                    <p><strong>Emplacement:</strong> {terrain.emplacement}</p>
                </div>
                <div className="mt-4">
                    <details className="text-sm">
                        <summary className="font-semibold cursor-pointer">Plus d&aposinformations</summary>
                        <p className="mt-2"><strong>Informations générales:</strong> {terrain.infos_generales}</p>
                        <p className="mt-1"><strong>Accessibilité:</strong> {terrain.accessibilite}</p>
                        <p className="mt-1"><strong>Équipements:</strong> {terrain.equipements}</p>
                    </details>
                </div>
            </CardContent>
        </Card>
    )
}