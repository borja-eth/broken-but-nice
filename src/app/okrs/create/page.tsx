import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { CreateOkrForm } from "@/components/okrs/create-okr-form"

export default async function CreateOkrPage() {
  const supabase = await createClient()

  // Verificar autenticación
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect("/login")
  }

  // Obtener usuarios
  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("id, email")

  if (usersError) {
    console.error("Error al obtener usuarios:", usersError)
    return <div>Error al cargar usuarios</div>
  }

  // Obtener objetivos de compañía
  const { data: companyObjectives, error: objectivesError } = await supabase
    .from("objectives")
    .select("id, title")
    .eq("category", "company")

  if (objectivesError) {
    console.error("Error al obtener objetivos:", objectivesError)
    return <div>Error al cargar objetivos</div>
  }

  async function handleCreateOkr(formData: any) {
    "use server"
    
    const supabase = await createClient()

    try {
      // 1. Crear el objetivo
      const { data: objective, error: objectiveError } = await supabase
        .from("objectives")
        .insert({
          category: formData.objective.category,
          title: formData.objective.title,
          description: formData.objective.description,
          owner: formData.objective.owner,
          parent_objective_id: formData.objective.parentObjectiveId,
          due_date: formData.objective.dueDate,
        })
        .select()
        .single()

      if (objectiveError) throw objectiveError

      // 2. Crear los deliverables del objetivo
      if (formData.objective.deliverables?.length > 0) {
        const { error: deliverablesError } = await supabase
          .from("deliverables")
          .insert(
            formData.objective.deliverables.map((d: any) => ({
              title: d.title,
              description: d.description,
              accountable: d.accountable,
              objective_id: objective.id,
            }))
          )

        if (deliverablesError) throw deliverablesError
      }

      // 3. Crear los KPIs
      if (formData.objective.kpis?.length > 0) {
        const { error: kpisError } = await supabase
          .from("kpis")
          .insert(
            formData.objective.kpis.map((k: any) => ({
              kpi: k.kpi,
              unit_of_account: k.unitOfAccount,
              description: k.description,
              owner: k.owner,
              objective_id: objective.id,
            }))
          )

        if (kpisError) throw kpisError
      }

      // 4. Crear los key results
      for (const kr of formData.keyResults) {
        const { data: keyResult, error: krError } = await supabase
          .from("key_results")
          .insert({
            objective_id: objective.id,
            title: kr.title,
            description: kr.description,
            owner: kr.owner,
          })
          .select()
          .single()

        if (krError) throw krError

        // 5. Crear los deliverables de cada key result
        if (kr.deliverables?.length > 0) {
          const { error: krDeliverablesError } = await supabase
            .from("deliverables")
            .insert(
              kr.deliverables.map((d: any) => ({
                title: d.title,
                description: d.description,
                accountable: d.accountable,
                key_result_id: keyResult.id,
              }))
            )

          if (krDeliverablesError) throw krDeliverablesError
        }
      }

      redirect("/okrs")
    } catch (error) {
      console.error("Error al crear OKR:", error)
      throw error
    }
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Crear OKR</h1>
          <p className="text-muted-foreground">
            Completa el formulario para crear un nuevo OKR
          </p>
        </div>

        <div className="rounded-lg border bg-card p-8">
          <CreateOkrForm
            onSubmit={handleCreateOkr}
            users={users}
            companyObjectives={companyObjectives}
          />
        </div>
      </div>
    </div>
  )
} 