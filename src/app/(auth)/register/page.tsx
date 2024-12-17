'use client'
import React from "react";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft } from "lucide-react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { AppConfig } from "@/lib/config";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { API_BASEURL } from "@/lib/api.utils";
import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(5, 'El nombre es obligatorio'),
  email: z.string().email('El correo electrónico no es válido').min(1, 'El correo electrónico es obligatorio'),
  password: z.string().min(6, 'La contraseña debe tener al menos 8 caracteres'),
  phone: z.string().min(5, 'El teléfono es obligatorio'),
  ubication: z.string().min(5, 'La ubicación es obligatoria'),
  company_type: z.string().min(1, 'El tipo de empresa es obligatorio'),
  balance_type: z.string().min(1, 'El tipo de balance es obligatorio'),
});

type RegisterSchemaType = z.infer<typeof formSchema>;

const defaultValuesState: RegisterSchemaType = {
  name: '',
  email: '',
  password: '',
  phone: '',
  ubication: '',
  company_type: '',
  balance_type: '',
};

const RegisterUserPage = () => {
  const form = useForm<RegisterSchemaType>({ resolver: zodResolver(formSchema), defaultValues: defaultValuesState });
  const { error, isMutating } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: RegisterSchemaType) => {
    try {
      await axios.post(`${API_BASEURL}/api/users`, data);
      // const user = response.data.data;
      // localStorage.setItem("token", token);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.log(error)
    }
  };

  if (error) {
    toast.error(error);
  }


  return (
    <div className="flex flex-col p-5">
      <div>
        <Button
          variant='ghost'
          onClick={() => router.push('/')}
        >
          <>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver
          </>
        </Button>
      </div>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {AppConfig.APP_NAME}
          </h1>
          <p className="text-sm text-muted-foreground">
            {AppConfig.APP_DESCRIPTION}
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2 px-6 pb-6'>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Luis Gabriel" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="ejemplo@gmail.com" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="78010833" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ubication"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="123 Main St, Springfield" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de empresa</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value} required>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Seleccione un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comercial">Comercial</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="servicios">De servicios</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="balance_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de balance</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value} required>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Seleccione un balance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mensual">Mensual</SelectItem>
                        <SelectItem value="anual">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant='default' className="w-full" disabled={isMutating}>
              {isMutating ? 'Cargando...' : 'Registrarse'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterUserPage;
