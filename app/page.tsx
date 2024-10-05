import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Bienvenue sur notre plateforme</h1>
        <p className="mb-8">Connectez-vous ou inscrivez-vous pour commencer.</p>
        <div className="space-x-4">
          <Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Connexion
          </Link>
          <Link href="/register" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Inscription
          </Link>
        </div>
      </div>
    </div>
  )
}