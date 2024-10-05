//app/(dashboard)/add-parcel/page.tsx
'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AddParcel() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const supabase = createClientComponentClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) throw new Error('Utilisateur non connecté')

            const { error: insertError } = await supabase
                .from('parcels')
                .insert([
                    { title, description, price: parseFloat(price), owner_id: user.id }
                ])

            if (insertError) throw insertError

            // Mettre à jour le statut de l'utilisateur en tant que propriétaire
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ is_landlord: true })
                .eq('id', user.id)

            if (updateError) throw updateError

            router.push('/dashboard')
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Une erreur inconnue est survenue')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Ajouter une nouvelle parcelle</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Titre de la parcelle</Label>
                            <Input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Entrez le titre de la parcelle"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Décrivez votre parcelle"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Prix par jour (€)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Entrez le prix par jour"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Erreur</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Ajout en cours...' : 'Ajouter la parcelle'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}