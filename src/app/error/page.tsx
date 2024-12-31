'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ErrorPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Lo sentimos, algo salió mal</h1>
      <p className="text-muted-foreground">
        Hubo un error al procesar tu solicitud.
      </p>
      <Button asChild>
        <Link href="/login">Volver al inicio de sesión</Link>
      </Button>
    </div>
  )
} 