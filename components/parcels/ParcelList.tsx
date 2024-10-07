// components/parcels/ParcelList.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import ParcelCard from './ParcelCard'
import { Terrain } from '@/app/types/formTypes'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

const ITEMS_PER_PAGE = 6

export default function ParcelList() {
    const [terrains, setTerrains] = useState<Terrain[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [priceFilter, setPriceFilter] = useState<number | null>(null)
    const [capacityFilter, setCapacityFilter] = useState<number | null>(null)
    const [sortBy, setSortBy] = useState<string>('date_creation')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const supabase = createClientComponentClient()

    const fetchTerrains = useCallback(async () => {
        try {
            setIsLoading(true)
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
            const endIndex = startIndex + ITEMS_PER_PAGE - 1

            let query = supabase
                .from('terrains')
                .select(`
    *,
    image_mise_en_avant:images!terrains_image_mise_en_avant_id_fkey(id, url, legende)
  `, { count: 'exact' })
                .range(startIndex, endIndex)

            if (priceFilter) {
                query = query.lte('prix_par_jour', priceFilter)
            }
            if (capacityFilter) {
                query = query.gte('capacite_max', capacityFilter)
            }

            const { data: terrainsData, count, error: supabaseError } = await query
                .order(sortBy, { ascending: sortOrder === 'asc' })

            if (supabaseError) throw supabaseError

            setTerrains(terrainsData)
            setTotalCount(count || 0)
        } catch (error) {
            console.error('Erreur lors de la récupération des terrains:', error)
            setError('Impossible de charger les terrains')
        } finally {
            setIsLoading(false)
        }
    }, [currentPage, priceFilter, capacityFilter, sortBy, sortOrder, supabase])

    useEffect(() => {
        fetchTerrains()
    }, [fetchTerrains])

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

    if (isLoading) {
        return <div>Chargement...</div>
    }

    if (error) {
        return <div>Erreur : {error}</div>
    }

    return (
        <div>
            <div className="mb-4 flex space-x-4">
                <Input
                    type="number"
                    placeholder="Prix max"
                    onChange={(e) => setPriceFilter(e.target.value ? Number(e.target.value) : null)}
                />
                <Input
                    type="number"
                    placeholder="Capacité min"
                    onChange={(e) => setCapacityFilter(e.target.value ? Number(e.target.value) : null)}
                />
                <Select onValueChange={(value) => setSortBy(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="prix_par_jour">Prix</SelectItem>
                        <SelectItem value="capacite_max">Capacité</SelectItem>
                        <SelectItem value="date_creation">Date de création</SelectItem>
                    </SelectContent>
                </Select>
                <Select onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
                    <SelectTrigger>
                        <SelectValue placeholder="Ordre" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">Croissant</SelectItem>
                        <SelectItem value="desc">Décroissant</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {terrains.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {terrains.map((terrain) => (
                        <ParcelCard key={terrain.id} terrain={terrain} />
                    ))}
                </div>
            ) : (
                <div>Aucun terrain trouvé</div>
            )}
            <div className="mt-4 flex justify-center space-x-2">
                <Button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Précédent
                </Button>
                <span>Page {currentPage} sur {totalPages}</span>
                <Button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Suivant
                </Button>
            </div>
        </div>
    )
}