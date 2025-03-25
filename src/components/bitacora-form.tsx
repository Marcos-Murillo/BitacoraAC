"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { BitacoraEntry } from "@/types/bitacora"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  fecha: z.date({
    required_error: "La fecha es requerida",
  }),
  titulo: z.string().min(2, {
    message: "El título debe tener al menos 2 caracteres",
  }),
  descripcion: z.string().min(5, {
    message: "La descripción debe tener al menos 5 caracteres",
  }),
  responsable: z.string({
    required_error: "Por favor seleccione un responsable",
  }),
  categoria: z.string({
    required_error: "Por favor seleccione una categoría",
  }),
})

interface BitacoraFormProps {
  onSubmit: (data: BitacoraEntry) => void
}

export default function BitacoraForm({ onSubmit }: BitacoraFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fecha: new Date(),
      titulo: "",
      descripcion: "",
      responsable: "",
      categoria: "",
    },
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit({
      id: "",
      ...values,
      fechaCreacion: new Date(),
      completada: false,
    })
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fecha"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha del evento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Seleccione una fecha</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="correo">Correo</SelectItem>
                    <SelectItem value="grupos_culturales">Grupos culturales</SelectItem>
                    <SelectItem value="evento">Evento</SelectItem>
                    <SelectItem value="informe">Informe</SelectItem>
                    <SelectItem value="reunion">Reunión</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título del registro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describa los detalles del evento o actividad"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="responsable"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsable</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un responsable" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Alejandro">Alejandro</SelectItem>
                  <SelectItem value="Isabella">Isabella</SelectItem>
                  <SelectItem value="Juan Pablo">Juan Pablo</SelectItem>
                  <SelectItem value="Kerelin">Kerelin</SelectItem>
                  <SelectItem value="Marcos">Marcos</SelectItem>
                  <SelectItem value="Naced">Naced</SelectItem>
                  <SelectItem value="Natalia">Natalia</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Guardar Registro
        </Button>
      </form>
    </Form>
  )
}

