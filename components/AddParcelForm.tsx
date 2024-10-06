// components/AddParcelForm.tsx
'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormData } from '@/app/types/formTypes'

type AddParcelFormProps = {
    onSubmit: (formData: FormData) => void
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
        capacite_max: '',
        infos_generales: '',
        accessibilite: '',
        equipements: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <Card>
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
                        <Label htmlFor="infos_generales">Informations générales</Label>
                        <Textarea id="infos_generales" name="infos_generales" value={formData.infos_generales} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="accessibilite">Accessibilité</Label>
                        <Textarea id="accessibilite" name="accessibilite" value={formData.accessibilite} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="equipements">Équipements</Label>
                        <Textarea id="equipements" name="equipements" value={formData.equipements} onChange={handleChange} required />
                    </div>
                    <Button type="submit">Ajouter la parcelle</Button>
                </form>
            </CardContent>
        </Card>
    )
}