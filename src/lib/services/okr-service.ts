import { createClient } from "@/utils/supabase/client"
import { type CreateOkrForm } from "@/lib/schemas/okr"

export interface EditOkrData {
  objective: {
    id: string
    title: string
    description?: string
    category: "company" | "divisional"
    owner: string
    dueDate?: Date
    parentObjectiveId?: string
  }
  keyResults: Array<{
    id?: string
    title: string
    description?: string
    owner: string
    deliverables: Array<{
      id?: string
      title: string
      description?: string
      accountable: string
    }>
  }>
  deliverables: Array<{
    id?: string
    title: string
    description?: string
    accountable: string
  }>
  kpis: Array<{
    id?: string
    kpi: string
    unitOfAccount: string
    description?: string
    owner: string
  }>
}

export class OkrService {
  private supabase = createClient()

  async editOkr(data: EditOkrData) {
    const { objective, keyResults, deliverables, kpis } = data

    try {
      // 1. Editar el objetivo principal
      const { error: objectiveError } = await this.supabase
        .from("objectives")
        .update({
          title: objective.title,
          description: objective.description,
          category: objective.category,
          owner_id: objective.owner,
          due_date: objective.dueDate,
          parent_objective_id: objective.parentObjectiveId,
        })
        .eq("id", objective.id)

      if (objectiveError) throw objectiveError

      // 2. Editar/Crear/Eliminar Key Results
      for (const kr of keyResults) {
        if (kr.id) {
          // Editar key result existente
          const { error: krError } = await this.supabase
            .from("key_results")
            .update({
              title: kr.title,
              description: kr.description,
              owner_id: kr.owner,
            })
            .eq("id", kr.id)

          if (krError) throw krError
        } else {
          // Crear nuevo key result
          const { error: krError } = await this.supabase
            .from("key_results")
            .insert({
              title: kr.title,
              description: kr.description,
              owner_id: kr.owner,
              objective_id: objective.id,
            })

          if (krError) throw krError
        }
      }

      // 3. Editar/Crear/Eliminar Deliverables del objetivo
      for (const del of deliverables) {
        if (del.id) {
          // Editar deliverable existente
          const { error: delError } = await this.supabase
            .from("deliverables")
            .update({
              title: del.title,
              description: del.description,
              accountable: del.accountable,
            })
            .eq("id", del.id)

          if (delError) throw delError
        } else {
          // Crear nuevo deliverable
          const { error: delError } = await this.supabase
            .from("deliverables")
            .insert({
              title: del.title,
              description: del.description,
              accountable: del.accountable,
              objective_id: objective.id,
            })

          if (delError) throw delError
        }
      }

      // 4. Editar/Crear/Eliminar KPIs
      for (const kpi of kpis) {
        if (kpi.id) {
          // Editar KPI existente
          const { error: kpiError } = await this.supabase
            .from("kpis")
            .update({
              kpi: kpi.kpi,
              unit_of_account: kpi.unitOfAccount,
              description: kpi.description,
              owner: kpi.owner,
            })
            .eq("id", kpi.id)

          if (kpiError) throw kpiError
        } else {
          // Crear nuevo KPI
          const { error: kpiError } = await this.supabase
            .from("kpis")
            .insert({
              kpi: kpi.kpi,
              unit_of_account: kpi.unitOfAccount,
              description: kpi.description,
              owner: kpi.owner,
              objective_id: objective.id,
            })

          if (kpiError) throw kpiError
        }
      }

      return { success: true }
    } catch (error) {
      console.error("Error al editar OKR:", error)
      throw error
    }
  }
} 