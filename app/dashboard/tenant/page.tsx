import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function TenantDashboard() {
    console.log("Rendering TenantDashboard");
    const supabase = createServerComponentClient({ cookies });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    console.log("User data:", user);

    if (!user) {
        console.log("No user found, redirecting to login");
        redirect("/login");
    }

    // Vérifiez si l'utilisateur est bien un locataire
    if (user.user_metadata.type_utilisateur !== 'locataire') {
        console.log("User is not a tenant, redirecting to dashboard");
        redirect("/dashboard"); // Redirigez vers une page générique si le type ne correspond pas
    }

    console.log("Rendering tenant dashboard for:", user.email);

    return (
        <div className="max-w-4xl text-gray-900 mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-6">Tableau de bord Locataire</h1>
            <p className="mb-4">Bienvenue, {user.email} !</p>
            {/* Ajoutez ici le contenu spécifique au tableau de bord du locataire */}
        </div>
    );
}