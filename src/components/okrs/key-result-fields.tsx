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
import { DeliverableFields } from "./deliverable-fields"

interface KeyResultFieldsProps {
  form: UseFormReturn<CreateOkrForm>
  users: { id: string; email: string }[]
}

export function KeyResultFields({ form, users }: KeyResultFieldsProps) {
  const keyResults = form.watch("keyResults") || []

  const addKeyResult = () => {
    const currentKeyResults = form.getValues("keyResults") || []
    form.setValue("keyResults", [
      ...currentKeyResults,
      { title: "", description: "", owner: "", deliverables: [] },
    ])
  }

  const removeKeyResult = (index: number) => {
    const currentKeyResults = form.getValues("keyResults") || []
    form.setValue(
      "keyResults",
      currentKeyResults.filter((_, i) => i !== index)
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Key Results</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addKeyResult}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Key Result
        </Button>
      </div>

      {keyResults.map((_, index) => (
        <div
          key={index}
          className="relative rounded-lg border p-6 space-y-6"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => removeKeyResult(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name={`keyResults.${index}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título del Key Result" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`keyResults.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción del Key Result"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`keyResults.${index}.owner`}
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

            <DeliverableFields
              form={form}
              path={`keyResults.${index}.deliverables`}
              users={users}
            />
          </div>
        </div>
      ))}
    </div>
  )
} 