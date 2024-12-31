"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createOkrSchema, type CreateOkrForm } from "@/lib/schemas/okr"
import { Button } from "@/components/ui/button"
import {
  Form,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { DeliverableFields } from "./deliverable-fields"
import { KpiFields } from "./kpi-fields"
import { KeyResultFields } from "./key-result-fields"

interface CreateOkrFormProps {
  onSubmit: (data: CreateOkrForm) => Promise<void>
  users: { id: string; email: string }[]
  companyObjectives?: { id: string; title: string }[]
}

export function CreateOkrForm({
  onSubmit,
  users,
  companyObjectives,
}: CreateOkrFormProps) {
  const form = useForm<CreateOkrForm>({
    resolver: zodResolver(createOkrSchema),
    defaultValues: {
      objective: {
        title: "",
        description: "",
        category: "company",
        deliverables: [],
        kpis: [],
      },
      keyResults: [{
        title: "",
        description: "",
        deliverables: []
      }],
    },
  })

  const [activeTab, setActiveTab] = React.useState("objective")

  const handleSubmit = async (data: CreateOkrForm) => {
    try {
      await onSubmit(data)
      form.reset()
    } catch (error) {
      console.error("Error al crear OKR:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="objective">Objetivo</TabsTrigger>
            <TabsTrigger value="keyResults">Key Results</TabsTrigger>
          </TabsList>
          <TabsContent value="objective" className="space-y-4">
            <FormField
              control={form.control}
              name="objective.category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="company">Compañía</SelectItem>
                      <SelectItem value="divisional">Divisional</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("objective.category") === "divisional" && (
              <FormField
                control={form.control}
                name="objective.parentObjectiveId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objetivo Padre</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un objetivo padre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companyObjectives?.map((objective) => (
                          <SelectItem key={objective.id} value={objective.id}>
                            {objective.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="objective.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título del objetivo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objective.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción del objetivo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objective.owner"
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

            <FormField
              control={form.control}
              name="objective.dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de vencimiento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Selecciona una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DeliverableFields
              form={form}
              path="objective.deliverables"
              users={users}
            />

            <KpiFields form={form} users={users} />

            <Button
              type="button"
              onClick={() => setActiveTab("keyResults")}
              className="w-full"
            >
              Continuar a Key Results
            </Button>
          </TabsContent>

          <TabsContent value="keyResults" className="space-y-4">
            <KeyResultFields form={form} users={users} />
            <Button type="submit" className="w-full">
              Crear OKR
            </Button>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  )
} 