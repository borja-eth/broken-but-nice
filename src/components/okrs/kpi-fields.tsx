"use client"

import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UseFormReturn } from "react-hook-form"
import { CreateOkrForm } from "@/lib/schemas/okr"
import { PlusCircle, Trash2 } from "lucide-react"

interface KpiFieldsProps {
  form: UseFormReturn<CreateOkrForm>
  users: { id: string; email: string }[]
}

export function KpiFields({ form, users }: KpiFieldsProps) {
  const kpis = form.watch("objective.kpis") || []

  const addKpi = () => {
    const currentKpis = form.getValues("objective.kpis") || []
    form.setValue("objective.kpis", [
      ...currentKpis,
      { kpi: "", unitOfAccount: "", description: "", owner: "" },
    ])
  }

  const removeKpi = (index: number) => {
    const currentKpis = form.getValues("objective.kpis") || []
    form.setValue(
      "objective.kpis",
      currentKpis.filter((_, i) => i !== index)
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">KPIs</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addKpi}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar KPI
        </Button>
      </div>

      {kpis.map((_, index) => (
        <div
          key={index}
          className="relative rounded-lg border p-4 space-y-4"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => removeKpi(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <FormField
            control={form.control}
            name={`objective.kpis.${index}.kpi`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>KPI</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del KPI" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`objective.kpis.${index}.unitOfAccount`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidad de Medida</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: %, $, número" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`objective.kpis.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descripción del KPI"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`objective.kpis.${index}.owner`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsable</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un responsable" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  )
} 