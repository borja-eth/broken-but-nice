import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreateOkrDialog } from "@/components/okrs/create-okr-dialog"
import { DeleteOkrDialog } from "@/components/okrs/delete-okr-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Target, Users2, ListChecks, Maximize2, Pencil, RefreshCw, History } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export default async function OKRsPage() {
  const supabase = await createClient()

  // Verificar autenticación
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect("/login")
  }

  // Obtener OKRs
  const { data: objectives, error } = await supabase
    .from("objectives")
    .select(`
      *,
      key_results (*)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching OKRs:", error)
  }

  // Obtener usuarios para el formulario y mapeo de IDs a emails
  const { data: users } = await supabase
    .from("profiles")
    .select("id, email")

  // Crear un mapa de id -> email para los usuarios
  const userMap = new Map(users?.map(user => [user.id, user.email]) || [])

  return (
    <div className="w-full space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">OKRs</h2>
          <p className="text-muted-foreground">
            Gestiona tus objetivos y resultados clave
          </p>
        </div>
        <CreateOkrDialog users={users || []} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {objectives?.map((objective) => (
          <Card key={objective.id} className="flex flex-col">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="mb-2">
                  {objective.category === "company" ? "Compañía" : "Divisional"}
                </Badge>
                <Badge>{objective.key_results?.length || 0} KRs</Badge>
              </div>
              <CardTitle className="line-clamp-2">{objective.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {objective.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Users2 className="h-4 w-4 opacity-70" />
                  <span className="text-muted-foreground">
                    {userMap.get(objective.owner_id)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progreso</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ListChecks className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {objective.key_results?.length || 0} resultados clave
                  </span>
                </div>
                <Badge variant="secondary">En Progreso</Badge>
              </div>
            </CardContent>
            <CardFooter className="mt-auto flex flex-col gap-4 pt-6">
              <Button asChild className="w-full" variant="outline">
                <Link href={`/okrs/${objective.id}`} className="flex items-center justify-center gap-2">
                  <Maximize2 className="h-4 w-4" />
                  Ver Detalles
                </Link>
              </Button>
              <Separator />
              <div className="grid w-full grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Actualizar
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Historial
                </Button>
                <DeleteOkrDialog 
                  objectiveId={objective.id} 
                  title={objective.title}
                  ownerId={objective.owner_id}
                />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {!objectives?.length && (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-4 w-fit rounded-full bg-muted p-4">
            <Target className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-medium">No hay OKRs creados</h3>
          <p className="text-sm text-muted-foreground">
            Comienza creando tu primer objetivo y sus resultados clave.
          </p>
        </Card>
      )}
    </div>
  )
} 