'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

export default function Dashboard() {
    const [user, setUser] = useState<any>(null)
    const [parcelles, setParcelles] = useState<any[]>([])
    const router = useRouter()
    const supabase = createClientComponentClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            if (user) {
                const { data, error } = await supabase
                    .from('terrains')
                    .select('id, titre')
                    .eq('proprietaire_id', user.id)
                if (data) setParcelles(data)
                if (error) console.error('Erreur lors de la récupération des parcelles:', error)
            }
        }
        getUser()
    }, [supabase])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    if (!user) {
        return <div className="flex justify-center items-center h-screen">Chargement...</div>
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Tableau de bord</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg mb-4">Bienvenue, {user.email}</p>
                    <Button onClick={handleLogout}>Se déconnecter</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Mes Parcelles</CardTitle>
                </CardHeader>
                <CardContent>
                    {parcelles.length > 0 ? (
                        <ul className="space-y-2">
                            {parcelles.map((parcelle) => (
                                <li key={parcelle.id} className="bg-gray-100 p-3 rounded">
                                    {parcelle.titre}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Vous n'avez pas encore de parcelles.</p>
                    )}
                    <div className="mt-4">
                        <Link href="/add-parcel">
                            <Button>Ajouter une nouvelle parcelle</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}