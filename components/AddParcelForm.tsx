// components/AddParcelForm.tsx
'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormData } from '@/app/types/formTypes'
import Image from 'next/image'

type AddParcelFormProps = {
    onSubmit: (formData: FormData, image: File | null) => Promise<{ success: boolean, message: string, imageUrl?: string }>
}

export function AddParcelForm({ onSubmit }: AddParcelFormProps) {
    const [formData, setFormData] = useState<FormData>({
        titre: '',
        description: '',
        emplacement: '',
        latitude: '',
        longitude: '',
        prix_par_jour: '',
        date_disponibilite_debut: '',
        date_disponibilite_fin: '',
        capacite_max: ''
    })
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [submitMessage, setSubmitMessage] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitMessage(null)
        try {
            const result = await onSubmit(formData, image)
            setSubmitMessage(result.message)
            if (result.success) {
                // Réinitialiser le formulaire si l'ajout est réussi
                setFormData({
                    titre: '',
                    description: '',
                    emplacement: '',
                    latitude: '',
                    longitude: '',
                    prix_par_jour: '',
                    date_disponibilite_debut: '',
                    date_disponibilite_fin: '',
                    capacite_max: ''
                })
                setImage(null)
                setImagePreview(null)
            }
        } catch (error) {
            setSubmitMessage("Une erreur est survenue lors de l'ajout de la parcelle.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Ajouter une nouvelle parcelle</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="titre">Titre</Label>
                        <Input id="titre" name="titre" value={formData.titre} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="emplacement">Emplacement</Label>
                        <Input id="emplacement" name="emplacement" value={formData.emplacement} onChange={handleChange} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="latitude">Latitude</Label>
                            <Input
                                id="latitude"
                                name="latitude"
                                type="number"
                                step="any"
                                min="-90"
                                max="90"
                                value={formData.latitude}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="longitude">Longitude</Label>
                            <Input
                                id="longitude"
                                name="longitude"
                                type="number"
                                step="any"
                                min="-180"
                                max="180"
                                value={formData.longitude}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="prix_par_jour">Prix par jour</Label>
                        <Input id="prix_par_jour" name="prix_par_jour" type="number" step="0.01" value={formData.prix_par_jour} onChange={handleChange} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="date_disponibilite_debut">Date de disponibilité (début)</Label>
                            <Input id="date_disponibilite_debut" name="date_disponibilite_debut" type="date" value={formData.date_disponibilite_debut} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label htmlFor="date_disponibilite_fin">Date de disponibilité (fin)</Label>
                            <Input id="date_disponibilite_fin" name="date_disponibilite_fin" type="date" value={formData.date_disponibilite_fin} onChange={handleChange} required />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="capacite_max">Capacité maximale</Label>
                        <Input id="capacite_max" name="capacite_max" type="number" value={formData.capacite_max} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="image">Image mise en avant</Label>
                        <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
                        {imagePreview && (
                            <div className="mt-4 relative" style={{ width: '100%', height: '75px', maxWidth: '150px' }}>
                                <Image
                                    src={imagePreview}
                                    alt="Image preview"
                                    layout="fill"
                                    objectFit="contain"
                                />
                            </div>
                        )}
                    </div>

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Ajout en cours...' : 'Ajouter la parcelle'}
                    </Button>

                    {submitMessage && (
                        <div className={`mt-4 p-2 rounded ${submitMessage.includes('succès') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {submitMessage}
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    )
}