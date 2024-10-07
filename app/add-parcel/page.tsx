// app/add-parcel/page.tsx
'use client'

import { AddParcelForm } from '@/components/AddParcelForm'
import { handleAddParcelSubmit } from '@/app/utils/addParcelSubmit'
import { FormData } from '@/app/types/formTypes'

export default function AddParcelPage() {
    const onSubmit = async (formData: FormData, image: File | null) => {
        const result = await handleAddParcelSubmit(formData, image)
        return result // Assurez-vous que handleAddParcelSubmit retourne l'objet attendu
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Ajouter une nouvelle parcelle</h1>
            <AddParcelForm onSubmit={onSubmit} />
        </div>
    )
}