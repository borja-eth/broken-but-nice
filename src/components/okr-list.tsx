import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import type { Objective, KeyResult, Deliverable, KPI } from "@/lib/types/okr"

export async function OKRList() {
  const supabase = await createClient()

  // Obtener los OKRs
  const { data: objectives, error: objectivesError } = await supabase
    .from("objectives")
    .select(`
      *,
      key_results (
        *
      ),
      deliverables (
        *
      ),
      kpis (
        *
      )
    `)
    .order("created_at", { ascending: false })

  if (objectivesError) {
    console.error("Error al obtener OKRs:", objectivesError)
    return <div>Error al cargar OKRs</div>
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">OKRs</h1>
          <p className="text-muted-foreground">
            Gestiona y da seguimiento a tus Objetivos y Resultados Clave
          </p>
        </div>
        <Button asChild>
          <Link href="/okrs/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear OKR
          </Link>
        </Button>
      </div>

      <div className="space-y-8">
        {objectives?.map((objective: any) => (
          <div
            key={objective.id}
            className="rounded-lg border bg-card p-6 space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                    {objective.category}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Responsable: {objective.owner_id}
                </span>
              </div>
              <h2 className="text-2xl font-semibold">{objective.title}</h2>
              {objective.description && (
                <p className="text-muted-foreground">{objective.description}</p>
              )}
            </div>

            {objective.key_results && objective.key_results.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Key Results</h3>
                <div className="grid gap-4">
                  {objective.key_results.map((kr: KeyResult) => (
                    <div
                      key={kr.id}
                      className="rounded-lg border bg-muted/50 p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{kr.title}</h4>
                        <span className="text-sm text-muted-foreground">
                          Responsable: {kr.owner_id}
                        </span>
                      </div>
                      {kr.description && (
                        <p className="text-sm text-muted-foreground">
                          {kr.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {objective.deliverables && objective.deliverables.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Deliverables</h3>
                <div className="grid gap-4">
                  {objective.deliverables.map((deliverable: Deliverable) => (
                    <div
                      key={deliverable.id}
                      className="rounded-lg border bg-muted/50 p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{deliverable.title}</h4>
                        <span className="text-sm text-muted-foreground">
                          Responsable: {deliverable.accountable_id}
                        </span>
                      </div>
                      {deliverable.description && (
                        <p className="text-sm text-muted-foreground">
                          {deliverable.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {objective.kpis && objective.kpis.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">KPIs</h3>
                <div className="grid gap-4">
                  {objective.kpis.map((kpi: KPI) => (
                    <div
                      key={kpi.id}
                      className="rounded-lg border bg-muted/50 p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{kpi.kpi}</h4>
                        <span className="text-sm text-muted-foreground">
                          Responsable: {kpi.owner_id}
                        </span>
                      </div>
                      <p className="text-sm">
                        Unidad de medida: {kpi.unit_of_account}
                      </p>
                      {kpi.description && (
                        <p className="text-sm text-muted-foreground">
                          {kpi.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {objectives?.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No hay OKRs creados</h3>
            <p className="text-muted-foreground">
              Comienza creando tu primer OKR
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 