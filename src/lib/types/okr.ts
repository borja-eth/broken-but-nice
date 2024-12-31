export interface User {
  id: string
  email: string
}

export interface Deliverable {
  id: string
  title: string
  description?: string
  accountable_id: string
  users?: User
  objective_id?: string
  key_result_id?: string
  created_at: string
  updated_at: string
}

export interface KPI {
  id: string
  kpi: string
  unit_of_account: string
  description?: string
  owner_id: string
  users?: User
  objective_id: string
  created_at: string
  updated_at: string
}

export interface KeyResult {
  id: string
  title: string
  description?: string
  owner_id: string
  users?: User
  objective_id: string
  deliverables: Deliverable[]
  created_at: string
  updated_at: string
}

export interface Objective {
  id: string
  category: "company" | "divisional"
  title: string
  description?: string
  owner_id: string
  owner?: User
  parent_objective_id?: string
  due_date: string
  created_at: string
  updated_at: string
  key_results: KeyResult[]
  deliverables: Deliverable[]
  kpis: KPI[]
} 