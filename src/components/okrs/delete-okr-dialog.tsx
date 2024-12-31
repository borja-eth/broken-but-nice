"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/components/ui/use-toast"

interface DeleteOkrDialogProps {
  objectiveId: string
  title: string
  ownerId: string
}

export function DeleteOkrDialog({ objectiveId, title, ownerId }: DeleteOkrDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleDelete = async () => {
    console.log("Iniciando proceso de eliminación para OKR:", { objectiveId, title })
    setIsDeleting(true)
    
    try {
      // Verificar sesión del usuario
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw new Error("Error al verificar la sesión")
      if (!session) throw new Error("No hay sesión activa")

      console.log("Verificando permisos:", {
        userId: session.user.id,
        ownerId,
        isOwner: session.user.id === ownerId
      })

      if (session.user.id !== ownerId) {
        throw new Error("No tienes permiso para eliminar este OKR")
      }

      // Primero eliminamos los key results y sus deliverables
      console.log("Buscando key results asociados...")
      const { data: keyResults, error: krError } = await supabase
        .from("key_results")
        .select("id")
        .eq("objective_id", objectiveId)

      if (krError) {
        console.error("Error al buscar key results:", krError)
        throw new Error(`Error al buscar key results: ${krError.message}`)
      }

      console.log("Key results encontrados:", keyResults)

      if (keyResults && keyResults.length > 0) {
        const krIds = keyResults.map(kr => kr.id)
        console.log("IDs de key results a eliminar:", krIds)
        
        // Eliminar deliverables de key results
        console.log("Eliminando deliverables de key results...")
        const { error: delKrError } = await supabase
          .from("deliverables")
          .delete()
          .in("key_result_id", krIds)

        if (delKrError) {
          console.error("Error al eliminar deliverables de key results:", delKrError)
          throw new Error(`Error al eliminar deliverables de key results: ${delKrError.message}`)
        }

        // Eliminar key results
        console.log("Eliminando key results...")
        const { error: krDelError } = await supabase
          .from("key_results")
          .delete()
          .eq("objective_id", objectiveId)

        if (krDelError) {
          console.error("Error al eliminar key results:", krDelError)
          throw new Error(`Error al eliminar key results: ${krDelError.message}`)
        }
      }

      // Eliminar deliverables del objetivo
      console.log("Eliminando deliverables del objetivo...")
      const { error: delObjError } = await supabase
        .from("deliverables")
        .delete()
        .eq("objective_id", objectiveId)

      if (delObjError) {
        console.error("Error al eliminar deliverables del objetivo:", delObjError)
        throw new Error(`Error al eliminar deliverables del objetivo: ${delObjError.message}`)
      }

      // Eliminar KPIs del objetivo
      console.log("Eliminando KPIs...")
      const { error: kpiError } = await supabase
        .from("kpis")
        .delete()
        .eq("objective_id", objectiveId)

      if (kpiError) {
        console.error("Error al eliminar KPIs:", kpiError)
        throw new Error(`Error al eliminar KPIs: ${kpiError.message}`)
      }

      // Finalmente, eliminar el objetivo
      console.log("Eliminando el objetivo principal...")
      const { error: objError } = await supabase
        .from("objectives")
        .delete()
        .eq("id", objectiveId)

      if (objError) {
        console.error("Error al eliminar el objetivo:", objError)
        throw new Error(`Error al eliminar el objetivo: ${objError.message}`)
      }

      console.log("OKR eliminado exitosamente")
      toast({
        title: "OKR eliminado",
        description: "El OKR y todos sus elementos asociados han sido eliminados.",
      })

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error durante el proceso de eliminación:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar el OKR. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <div className="space-y-4">
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el OKR &quot;{title}&quot; y todos sus elementos asociados:
            </AlertDialogDescription>
            <div className="text-sm text-muted-foreground">
              <ul className="list-disc pl-4">
                <li>Resultados clave</li>
                <li>Deliverables</li>
                <li>KPIs</li>
                <li>Historial de actualizaciones</li>
              </ul>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 