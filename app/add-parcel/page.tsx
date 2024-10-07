//app/add-parcel/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { AddParcelForm } from '@/components/AddParcelForm'
import { FormData } from '@/app/types/formTypes'
import { handleAddParcelSubmit } from '@/app/utils/addParcelSubmit'

export default function AddParcelPage() {
    const router = useRouter()

    const handleSubmit = async (formData: FormData, image: File | null) => {
        try {
            const message = await handleAddParcelSubmit(formData, image)
            alert(message)
            router.push('/dashboard')
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message)
            } else {
                alert("Une erreur inattendue s'est produite")
            }
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <AddParcelForm onSubmit={handleSubmit} />
        </div>
    )
}