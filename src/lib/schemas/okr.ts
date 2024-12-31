import * as z from "zod"

export const deliverableSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  accountable: z.string().uuid("Selecciona un responsable"),
})

export const kpiSchema = z.object({
  kpi: z.string().min(1, "El KPI es requerido"),
  unitOfAccount: z.string().min(1, "La unidad de medida es requerida"),
  description: z.string().optional(),
  owner: z.string().uuid("Selecciona un responsable"),
})

export const objectiveSchema = z.object({
  category: z.enum(["company", "divisional"], {
    required_error: "Selecciona una categoría",
  }),
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  deliverables: z.array(deliverableSchema),
  kpis: z.array(kpiSchema),
  owner: z.string().uuid("Selecciona un responsable"),
  dueDate: z.date({
    required_error: "Selecciona una fecha de vencimiento",
  }),
  parentObjectiveId: z.string().uuid("Selecciona un objetivo padre").optional(),
})

export const keyResultSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  deliverables: z.array(deliverableSchema),
  owner: z.string().uuid("Selecciona un responsable"),
})

export const createOkrSchema = z.object({
  objective: objectiveSchema,
  keyResults: z.array(keyResultSchema).min(1, "Debe haber al menos un Key Result"),
})

export type CreateOkrForm = z.infer<typeof createOkrSchema> 