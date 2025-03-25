"use client"

import { format } from "date-fns"
import { CheckCircle, XCircle } from "lucide-react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { BitacoraEntry } from "@/types/bitacora"

interface BitacoraTableProps {
  entries: BitacoraEntry[]
  onToggleComplete: (id: string) => void
}

export default function BitacoraTable({ entries, onToggleComplete }: BitacoraTableProps) {
  const getCategoryBadge = (category: string) => {
    const styles = {
      correo: "bg-blue-500 hover:bg-blue-600",
      grupos_culturales: "bg-purple-500 hover:bg-purple-600",
      evento: "bg-yellow-500 hover:bg-yellow-600",
      informe: "bg-orange-500 hover:bg-orange-600",
      reunion: "bg-green-500 hover:bg-green-600",
    }

    const categoryKey = category as keyof typeof styles
    return styles[categoryKey] || "bg-gray-500 hover:bg-gray-600"
  }

  const getCategoryLabel = (category: string) => {
    const labels = {
      correo: "Correo",
      grupos_culturales: "Grupos culturales",
      evento: "Evento",
      informe: "Informe",
      reunion: "Reunión",
    }

    const categoryKey = category as keyof typeof labels
    return labels[categoryKey] || category
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Lista de registros en la bitácora</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Responsable</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No hay registros en la bitácora
              </TableCell>
            </TableRow>
          ) : (
            entries.map((entry) => (
              <TableRow key={entry.id} className={entry.completada ? "bg-green-50" : "bg-red-50"}>
                <TableCell>{format(new Date(entry.fecha), "dd/MM/yyyy")}</TableCell>
                <TableCell className="font-medium">{entry.titulo}</TableCell>
                <TableCell>{entry.responsable}</TableCell>
                <TableCell>
                  <Badge className={getCategoryBadge(entry.categoria)}>{getCategoryLabel(entry.categoria)}</Badge>
                </TableCell>
                <TableCell>
                  {entry.completada ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="mr-1 h-4 w-4" /> Completada
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600">
                      <XCircle className="mr-1 h-4 w-4" /> Pendiente
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant={entry.completada ? "outline" : "default"}
                    size="sm"
                    onClick={() => onToggleComplete(entry.id)}
                  >
                    {entry.completada ? "Marcar pendiente" : "Marcar completada"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

