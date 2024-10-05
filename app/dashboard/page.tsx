//app/(dashboard)/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Home } from 'lucide-react'

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClientComponentClient()

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser()
                if (error) throw error
                setUser(user)
            } catch (error) {
                console.error('Error fetching user:', error)
                setError('Impossible de charger les informations utilisateur')
            } finally {
                setIsLoading(false)
            }
        }
        getUser()
    }, [supabase])

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login')
        }
    }, [isLoading, user, router])

    const becomeLandlord = async () => {
        if (!user) return

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_landlord: true })
                .eq('id', user.id)

            if (error) throw error

            setUser(prevUser => prevUser ? {
                ...prevUser,
                user_metadata: { ...prevUser.user_metadata, is_landlord: true }
            } : null)
        } catch (error) {
            console.error('Error updating user profile:', error)
            setError('Impossible de mettre à jour le profil')
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
            <p className="text-xl mb-8">Bienvenue, {user.user_metadata?.full_name || 'Utilisateur'}</p>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Parcelles disponibles</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => router.push('/parcels')}>
                        Voir toutes les parcelles
                    </Button>
                </CardContent>
            </Card>

            {user.user_metadata?.is_landlord ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Gérer mes parcelles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">Vous êtes propriétaire. Gérez vos parcelles ou ajoutez-en de nouvelles.</p>
                        <Button onClick={() => router.push('/add-parcel')}>
                            <Plus className="mr-2 h-4 w-4" /> Ajouter une parcelle
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Proposer une parcelle à louer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">Vous n&apos;avez pas encore de parcelle à louer. Proposez votre première parcelle dès maintenant !</p>
                        <Button onClick={becomeLandlord}>
                            <Home className="mr-2 h-4 w-4" /> Proposer une parcelle
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}