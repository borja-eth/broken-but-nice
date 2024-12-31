"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { KeyResultsList } from "./key-results-list"
import { EditOkrDialog } from "./edit-okr-dialog"
import { DeleteOkrDialog } from "./delete-okr-dialog"
import type { Objective, KeyResult, Deliverable, KPI } from "@/lib/types/okr"

interface ObjectiveDetailProps {
  objective: Objective & {
    key_results: KeyResult[]
    deliverables: Deliverable[]
    kpis: KPI[]
  }
  userMap: Map<string, string>
  users: Array<{
    id: string
    email: string
  }>
}

export function ObjectiveDetail({ objective, userMap, users }: ObjectiveDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
              {objective.category}
            </span>
            <span className="text-sm text-muted-foreground">
              Responsable: {userMap.get(objective.owner_id)}
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold">{objective.title}</h1>
          {objective.description && (
            <p className="mt-2 text-muted-foreground">{objective.description}</p>
          )}
          {objective.due_date && (
            <p className="mt-2 text-sm text-muted-foreground">
              Fecha de vencimiento:{" "}
              {format(new Date(objective.due_date), "PPP", { locale: es })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <EditOkrDialog objective={objective} users={users} />
          <DeleteOkrDialog
            objectiveId={objective.id}
            title={objective.title}
            ownerId={objective.owner_id}
          />
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Key Results</h2>
          <KeyResultsList keyResults={objective.key_results} userMap={userMap} />
        </section>

        {objective.deliverables.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Entregables del Objetivo</h2>
            <div className="space-y-4">
              {objective.deliverables.map((deliverable) => (
                <div
                  key={deliverable.id}
                  className="rounded-lg border bg-card p-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{deliverable.title}</h3>
                    <span className="text-sm text-muted-foreground">
                      Responsable: {userMap.get(deliverable.accountable_id)}
                    </span>
                  </div>
                  {deliverable.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {deliverable.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {objective.kpis.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">KPIs</h2>
            <div className="space-y-4">
              {objective.kpis.map((kpi) => (
                <div key={kpi.id} className="rounded-lg border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{kpi.kpi}</h3>
                      <p className="text-sm text-muted-foreground">
                        Unidad de medida: {kpi.unit_of_account}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Responsable: {userMap.get(kpi.owner_id)}
                    </span>
                  </div>
                  {kpi.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {kpi.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
} 