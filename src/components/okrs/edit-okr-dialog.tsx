"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EditOkrForm } from "./edit-okr-form"
import { OkrService } from "@/lib/services/okr-service"
import type { Objective, KeyResult, Deliverable, KPI } from "@/lib/types/okr"

interface EditOkrDialogProps {
  objective: Objective & {
    key_results: KeyResult[]
    deliverables: Deliverable[]
    kpis: KPI[]
  }
  users: Array<{
    id: string
    email: string
  }>
}

export function EditOkrDialog({ objective, users }: EditOkrDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const okrService = new OkrService()

  const handleSubmit = async (data: any) => {
    try {
      await okrService.editOkr(data)
      
      setOpen(false)
      toast({
        title: "OKR editado",
        description: "El OKR ha sido editado exitosamente.",
      })
      router.refresh()
    } catch (error) {
      console.error("Error al editar OKR:", error)
      toast({
        title: "Error",
        description: "Hubo un error al editar el OKR.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Editar OKR</DialogTitle>
          <DialogDescription>
            Modifica los detalles del OKR y sus componentes
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[calc(90vh-8rem)] pr-4">
          <EditOkrForm
            objective={objective}
            users={users}
            onSubmit={handleSubmit}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 