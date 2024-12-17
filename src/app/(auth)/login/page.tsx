'use client'
import React from "react";
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft } from "lucide-react";
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { AppConfig } from "@/lib/config";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";

// export const metadata: Metadata = {
//   title: "Login",
//   description: "Login to your account",
// };

const formSchema = z.object({
  email: z.string({ message: 'El correo electrónico es requerido' }).email('El correo electrónico no es válido')
    .min(2, 'El correo electrónico debe tener al menos 2 caracteres')
    .max(50, 'El correo electrónico debe tener menos de 50 caracteres'),
  password: z.string().min(1, 'La contraseña es requerida')
})

type LoginSchemaType = z.infer<typeof formSchema>

const defaultValuesState = { email: '', password: '' }

export default function LoginPage() {

  const form = useForm<LoginSchemaType>({ resolver: zodResolver(formSchema), defaultValues: defaultValuesState })
  const { signWithEmailPassword, error, isMutating } = useAuth()

  const onSubmit = (data: LoginSchemaType) => {
    void signWithEmailPassword(data)
  }

  if (error) {
    toast.error(error)
  }

  const router = useRouter();
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
            <CardDescription className='py-2'>
              <Link href='/'>¿Olvidaste tu contraseña?</Link>
            </CardDescription>
            <Button type="submit" variant='default' className="w-full" disabled={isMutating}>
              {isMutating ? 'Cargando...' : 'Iniciar sesión'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
