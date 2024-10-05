//components/Auth/LoginForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClientComponentClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)
        console.log('Tentative de connexion avec:', { email })

        try {
            console.log('Appel à signInWithPassword')
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            console.log('Résultat de signInWithPassword:', { data, error })

            if (error) throw error

            console.log('Vérification de la session')
            const { data: { session } } = await supabase.auth.getSession()
            console.log('Session:', session)

            if (session) {
                console.log('Redirection vers le tableau de bord')
                setTimeout(() => {
                    router.push('/dashboard')
                }, 100)
            } else {
                throw new Error('La session n\'a pas pu être établie')
            }
        } catch (error) {
            console.error('Erreur détaillée:', error)
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('Une erreur inconnue est survenue')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <Input
                    type="email"
                    placeholder="Adresse e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <Input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
        </form>
    )
}