import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { ObjectiveDetail } from "@/components/okrs/objective-detail"

interface OKRDetailPageProps {
  params: {
    id: string
  }
}

export default async function OKRDetailPage({ params }: OKRDetailPageProps) {
  const supabase = await createClient()

  // Verificar autenticación
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect("/login")
  }

  // Obtener el objetivo con sus relaciones
  const { data: objective, error } = await supabase
    .from("objectives")
    .select(`
      *,
      key_results (
        *,
        deliverables (*)
      ),
      deliverables (*),
      kpis (*)
    `)
    .eq("id", params.id)
    .single()

  if (error) {
    console.error("Error al obtener OKR:", error)
    return <div>Error al cargar el OKR</div>
  }

  // Obtener usuarios para mapear IDs a emails
  const { data: users } = await supabase
    .from("profiles")
    .select("id, email")

  // Crear un mapa de id -> email para los usuarios
  const userMap = new Map(users?.map(user => [user.id, user.email]) || [])

  return (
    <div className="container py-10">
      <ObjectiveDetail 
        objective={objective} 
        userMap={userMap} 
        users={users || []} 
      />
    </div>
  )
} 