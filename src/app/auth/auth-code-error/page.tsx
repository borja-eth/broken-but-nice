import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuthCodeError() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Error de Autenticación</h1>
      <p className="text-muted-foreground">
        Hubo un error al verificar tu código de autenticación.
      </p>
      <Button asChild>
        <Link href="/login">Volver al inicio de sesión</Link>
      </Button>
    </div>
  )
} 