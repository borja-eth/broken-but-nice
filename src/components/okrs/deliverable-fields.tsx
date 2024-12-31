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

interface DeliverableFieldsProps {
  form: UseFormReturn<CreateOkrForm>
  path: `objective.deliverables` | `keyResults.${number}.deliverables`
  users: { id: string; email: string }[]
}

export function DeliverableFields({
  form,
  path,
  users,
}: DeliverableFieldsProps) {
  const deliverables = form.watch(path) || []

  const addDeliverable = () => {
    const currentDeliverables = form.getValues(path) || []
    form.setValue(path, [
      ...currentDeliverables,
      { title: "", description: "", accountable: "" },
    ])
  }

  const removeDeliverable = (index: number) => {
    const currentDeliverables = form.getValues(path) || []
    form.setValue(
      path,
      currentDeliverables.filter((_, i) => i !== index)
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Deliverables</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addDeliverable}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Deliverable
        </Button>
      </div>

      {deliverables.map((_, index) => (
        <div
          key={index}
          className="relative rounded-lg border p-4 space-y-4"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => removeDeliverable(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <FormField
            control={form.control}
            name={`${path}.${index}.title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Título del deliverable" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`${path}.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descripción del deliverable"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`${path}.${index}.accountable`}
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