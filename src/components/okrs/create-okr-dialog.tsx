"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { CreateOkrForm } from "@/components/okrs/create-okr-form"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CreateOkrDialogProps {
  users: Array<{
    id: string
    email: string
  }>
}

export function CreateOkrDialog({ users }: CreateOkrDialogProps) {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const handleSubmit = async (data: any) => {
    console.log("Form data received:", data) // Debug log

    try {
      // Verificar datos requeridos del objetivo
      if (!data.objective.title || !data.objective.owner || !data.objective.category) {
        console.log("Current objective data:", {
          title: data.objective.title,
          owner: data.objective.owner,
          category: data.objective.category
        })
        throw new Error("Faltan campos requeridos en el objetivo")
      }

      // Crear el objetivo
      const { data: objective, error: objectiveError } = await supabase
        .from("objectives")
        .insert({
          title: data.objective.title,
          description: data.objective.description || "",
          category: data.objective.category,
          owner_id: data.objective.owner,
          due_date: data.objective.dueDate || null,
        })
        .select()
        .single()

      if (objectiveError) {
        console.error("Error creating objective:", objectiveError)
        throw objectiveError
      }

      console.log("Created objective:", objective) // Debug log

      // Crear los resultados clave
      if (data.keyResults?.length) {
        const keyResults = data.keyResults.map((kr: any) => ({
          title: kr.title,
          description: kr.description || "",
          owner_id: kr.owner,
          objective_id: objective.id,
        }))

        console.log("Creating key results:", keyResults) // Debug log

        const { error: krsError } = await supabase
          .from("key_results")
          .insert(keyResults)

        if (krsError) {
          console.error("Error creating key results:", krsError)
          throw krsError
        }
      }

      toast({
        title: "OKR creado",
        description: "El objetivo y sus resultados clave han sido creados exitosamente.",
      })

      setOpen(false)
      router.refresh()
    } catch (error: any) {
      console.error("Error creating OKR:", error)
      toast({
        title: "Error",
        description: error.message || "Ha ocurrido un error al crear el OKR",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Objetivo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-3xl">
        <DialogHeader>
          <DialogTitle>Crear Nuevo OKR</DialogTitle>
          <DialogDescription>
            Define un nuevo objetivo y sus resultados clave asociados
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-8rem)] overflow-auto">
          <div className="p-1">
            <CreateOkrForm users={users} onSubmit={handleSubmit} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 