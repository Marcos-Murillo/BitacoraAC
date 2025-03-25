"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BitacoraForm from "@/components/bitacora-form"
import BitacoraTable from "@/components/bitacora-table"
import BitacoraStats from "@/components/bitacora-stats"
import type { BitacoraEntry } from "@/types/bitacora"

export default function BitacoraPage() {
  const [entries, setEntries] = useState<BitacoraEntry[]>([])

  // Cargar entradas desde localStorage al iniciar
  useEffect(() => {
    const savedEntries = localStorage.getItem("bitacoraEntries")
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  // Guardar entradas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("bitacoraEntries", JSON.stringify(entries))
  }, [entries])

  const addEntry = (entry: BitacoraEntry) => {
    setEntries([...entries, { ...entry, id: Date.now().toString() }])
  }

  const toggleComplete = (id: string) => {
    setEntries(entries.map((entry) => (entry.id === id ? { ...entry, completada: !entry.completada } : entry)))
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Bitácora de Activides Area de Cultura</h1>

      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="form">Nuevo Registro</TabsTrigger>
          <TabsTrigger value="entries">Ver Registros</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>Nuevo Registro en Bitácora</CardTitle>
              <CardDescription>Complete el formulario para añadir un nuevo registro a la bitácora.</CardDescription>
            </CardHeader>
            <CardContent>
              <BitacoraForm onSubmit={addEntry} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entries">
          <Card>
            <CardHeader>
              <CardTitle>Registros de la Bitácora</CardTitle>
              <CardDescription>Visualice todos los registros guardados en la bitácora.</CardDescription>
            </CardHeader>
            <CardContent>
              <BitacoraTable entries={entries} onToggleComplete={toggleComplete} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <BitacoraStats entries={entries} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

