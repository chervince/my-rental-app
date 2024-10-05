//app/components/AddParcelForm.tsx
'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormData } from '@/app/types/formTypes'

type AddParcelFormProps = {
    onSubmit: (formData: FormData) => void
}

type NestedObject = {
    [key: string]: string | boolean | string[] | NestedObject
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
        infos_generales: {
            superficie: '',
            type_terrain: [],
            type_sol: [],
            environnement: [],
            vues: []
        },
        accessibilite: {
            types_acces: [],
            parking: {
                type: '',
                details: ''
            },
            chemin_acces: [],
            distance_route_principale: ''
        },
        equipements: {
            eau: {
                disponible: false,
                type: ''
            },
            electricite: {
                disponible: false,
                caracteristiques: []
            },
            toilettes: {
                disponible: false,
                type: []
            },
            douches: {
                disponible: false,
                type: []
            },
            cuisine: [],
            abri: [],
            mobilier_exterieur: [],
            feu_camp: {
                autorise: false,
                bois_fourni: false
            },
            internet: {
                wifi: false,
                reseau_mobile: false
            },
            gestion_dechets: []
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        const keys = name.split('.')
        setFormData((prev: FormData) => {
            const newData = { ...prev }
            let current: NestedObject = newData
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]] as NestedObject
            }
            current[keys[keys.length - 1]] = value
            return newData
        })
    }

    const handleCheckboxChange = (name: string, checked: boolean) => {
        const keys = name.split('.')
        setFormData((prev: FormData) => {
            const newData = { ...prev }
            let current: NestedObject = newData
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]] as NestedObject
            }
            current[keys[keys.length - 1]] = checked
            return newData
        })
    }

    const handleArrayChange = (category: string, item: string, isChecked: boolean) => {
        const keys = category.split('.')
        setFormData((prev: FormData) => {
            const newData = { ...prev }
            let current: NestedObject = newData
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]] as NestedObject
            }
            const array = current[keys[keys.length - 1]] as string[]
            if (isChecked) {
                current[keys[keys.length - 1]] = [...array, item]
            } else {
                current[keys[keys.length - 1]] = array.filter((i: string) => i !== item)
            }
            return newData
        })
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

                    {/* Infos générales */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Informations générales</h3>
                        <div>
                            <Label htmlFor="superficie">Superficie</Label>
                            <Select onValueChange={(value) => handleSelectChange('infos_generales.superficie', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez la superficie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="<500">Moins de 500 m²</SelectItem>
                                    <SelectItem value="500-1000">500 - 1000 m²</SelectItem>
                                    <SelectItem value="1000-5000">1000 - 5000 m²</SelectItem>
                                    <SelectItem value=">5000">Plus de 5000 m²</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Ajoutez d'autres champs pour type_terrain, type_sol, environnement, vues */}
                    </div>

                    {/* Accessibilité */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Accessibilité</h3>
                        <div>
                            <Label>Types d&apos;accès</Label>
                            <div className="flex space-x-4">
                                {['voiture', 'camping_car', 'velo'].map(type => (
                                    <div key={type} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`acces-${type}`}
                                            checked={formData.accessibilite.types_acces.includes(type)}
                                            onCheckedChange={(checked) => handleArrayChange('accessibilite.types_acces', type, checked as boolean)}
                                        />
                                        <Label htmlFor={`acces-${type}`}>{type}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Ajoutez d'autres champs pour parking, chemin_acces, distance_route_principale */}
                    </div>

                    {/* Équipements */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Équipements</h3>
                        <div>
                            <Label>Eau</Label>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="eau-disponible"
                                    checked={formData.equipements.eau.disponible}
                                    onCheckedChange={(checked) => handleCheckboxChange('equipements.eau.disponible', checked as boolean)}
                                />
                                <Label htmlFor="eau-disponible">Disponible</Label>
                            </div>
                            {formData.equipements.eau.disponible && (
                                <Select onValueChange={(value) => handleSelectChange('equipements.eau.type', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Type d'eau" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="potable">Potable</SelectItem>
                                        <SelectItem value="non_potable">Non potable</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                        {/* Ajoutez d'autres champs pour electricite, toilettes, douches, cuisine, abri, mobilier_exterieur, feu_camp, internet, gestion_dechets */}
                    </div>

                    <Button type="submit">Ajouter la parcelle</Button>
                </form>
            </CardContent>
        </Card>
    )
}