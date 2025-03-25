"use client"


import { useMemo, useState } from "react"
import { format, startOfDay, startOfWeek, startOfMonth, isSameDay, isSameWeek, isSameMonth } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { BitacoraEntry } from "@/types/bitacora"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface BitacoraStatsProps {
  entries: BitacoraEntry[]
}

type TimeFilter = "all" | "day" | "week" | "month"

export default function BitacoraStats({ entries }: BitacoraStatsProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all")

  const filteredEntries = useMemo(() => {
    if (timeFilter === "all") return entries

    const today = new Date()
    const startOfCurrentDay = startOfDay(today)
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }) // Semana comienza el lunes
    const startOfCurrentMonth = startOfMonth(today)

    return entries.filter((entry) => {
      const entryDate = new Date(entry.fecha)

      switch (timeFilter) {
        case "day":
          return isSameDay(entryDate, today)
        case "week":
          return isSameWeek(entryDate, today, { weekStartsOn: 1 })
        case "month":
          return isSameMonth(entryDate, today)
        default:
          return true
      }
    })
  }, [entries, timeFilter])

  const responsableStats = useMemo(() => {
    const stats = new Map<string, { total: number; completadas: number }>()

    filteredEntries.forEach((entry) => {
      if (!stats.has(entry.responsable)) {
        stats.set(entry.responsable, { total: 0, completadas: 0 })
      }

      const currentStats = stats.get(entry.responsable)!
      currentStats.total += 1

      if (entry.completada) {
        currentStats.completadas += 1
      }

      stats.set(entry.responsable, currentStats)
    })

    return Array.from(stats.entries())
      .map(([name, data]) => ({
        name,
        total: data.total,
        completadas: data.completadas,
        pendientes: data.total - data.completadas,
      }))
      .sort((a, b) => b.total - a.total)
  }, [filteredEntries])

  const categoriaStats = useMemo(() => {
    const stats = new Map<string, number>()

    filteredEntries.forEach((entry) => {
      const categoria = entry.categoria
      stats.set(categoria, (stats.get(categoria) || 0) + 1)
    })

    return Array.from(stats.entries())
      .map(([name, value]) => {
        const labels: Record<string, string> = {
          correo: "Correo",
          grupos_culturales: "Grupos culturales",
          evento: "Evento",
          informe: "Informe",
          reunion: "Reunión",
        }

        return {
          name: labels[name as keyof typeof labels] || name,
          value,
        }
      })
      .sort((a, b) => b.value - a.value)
  }, [filteredEntries])

  const getTimeFilterLabel = () => {
    switch (timeFilter) {
      case "day":
        return `Hoy (${format(new Date(), "dd/MM/yyyy")})`
      case "week":
        return `Esta semana (${format(startOfWeek(new Date(), { weekStartsOn: 1 }), "dd/MM/yyyy", { locale: es })} - ${format(new Date(), "dd/MM/yyyy", { locale: es })})`
      case "month":
        return `Este mes (${format(new Date(), "MMMM yyyy", { locale: es })})`
      default:
        return "Todos los tiempos"
    }
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas</CardTitle>
          <CardDescription>No hay datos suficientes para mostrar estadísticas.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Tareas por Responsable</CardTitle>
          <CardDescription>
            Conteo detallado de tareas totales, completadas y pendientes por cada responsable
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Estadísticas actualizadas al {format(new Date(), "dd/MM/yyyy HH:mm")}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Responsable</TableHead>
                <TableHead className="text-center">Total Tareas</TableHead>
                <TableHead className="text-center">Completadas</TableHead>
                <TableHead className="text-center">Pendientes</TableHead>
                <TableHead className="text-center">% Completado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responsableStats.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No hay datos para mostrar
                  </TableCell>
                </TableRow>
              ) : (
                responsableStats.map((stat) => (
                  <TableRow key={stat.name}>
                    <TableCell className="font-medium">{stat.name}</TableCell>
                    <TableCell className="text-center">{stat.total}</TableCell>
                    <TableCell className="text-center text-green-600 font-medium">{stat.completadas}</TableCell>
                    <TableCell className="text-center text-red-600 font-medium">{stat.pendientes}</TableCell>
                    <TableCell className="text-center">
                      {stat.total > 0 ? `${Math.round((stat.completadas / stat.total) * 100)}%` : "0%"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tareas por Responsable</CardTitle>
            <CardDescription>
              {getTimeFilterLabel()}: Distribución de tareas completadas y pendientes por cada responsable
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={timeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeFilter("all")}
            >
              Todos
            </Button>
            <Button
              variant={timeFilter === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeFilter("day")}
            >
              Día
            </Button>
            <Button
              variant={timeFilter === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeFilter("week")}
            >
              Semana
            </Button>
            <Button
              variant={timeFilter === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeFilter("month")}
            >
              Mes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {responsableStats.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No hay datos para el período seleccionado</div>
          ) : (
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={responsableStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completadas" stackId="a" fill="#4ade80" name="Completadas" />
                  <Bar dataKey="pendientes" stackId="a" fill="#f87171" name="Pendientes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribución por Categoría</CardTitle>
          <CardDescription>{getTimeFilterLabel()}: Número de tareas por cada categoría</CardDescription>
        </CardHeader>
        <CardContent>
          {categoriaStats.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No hay datos para el período seleccionado</div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoriaStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#60a5fa" name="Cantidad" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

