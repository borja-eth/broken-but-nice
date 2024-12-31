import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Target, ListTodo, Users, TrendingUp, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export default async function HomePage() {
  const supabase = await createClient()

  // Verificar autenticación
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect("/login")
  }

  // Obtener estadísticas
  const { data: objectives } = await supabase
    .from("objectives")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)
  
  const { data: todos } = await supabase
    .from("todos")
    .select("id")

  const { data: users } = await supabase
    .from("profiles")
    .select("id")

  return (
    <div className="w-full space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido al sistema de gestión de OKRs
          </p>
        </div>
      </div>

      <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total OKRs
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{objectives?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Objetivos y resultados clave
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total To Dos
            </CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todos?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Tareas pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Usuarios
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Usuarios activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Progreso General
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <Progress value={68} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Objetivos Recientes</CardTitle>
            <CardDescription>
              Los últimos objetivos creados en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px] pr-4">
              {objectives?.map((objective) => (
                <div key={objective.id} className="mb-4 last:mb-0">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {objective.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {objective.description}
                      </p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Las últimas actualizaciones en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px] pr-4">
              <div className="space-y-4">
                {[1,2,3,4,5].map((i) => (
                  <div key={i}>
                    <div className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Usuario actualizó el objetivo "Mejorar la satisfacción del cliente"
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Hace {i} horas
                        </p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
