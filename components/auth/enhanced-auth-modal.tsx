"use client"

import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/ui/logo"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

interface EnhancedAuthModalProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function EnhancedAuthModal({ open, setOpen }: EnhancedAuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const signInResponse = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (signInResponse?.error) {
        form.setError("email", {
          type: "manual",
          message: "Invalid credentials.",
        })
        form.setError("password", {
          type: "manual",
          message: "Invalid credentials.",
        })
        return
      }

      setOpen(false)
      router.refresh()
      router.push("/dashboard")
    } catch (error) {
      console.error("Authentication error:", error)
      form.setError("email", {
        type: "manual",
        message: "An unexpected error occurred.",
      })
      form.setError("password", {
        type: "manual",
        message: "An unexpected error occurred.",
      })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              <Logo />
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin ? "Login to your account" : "Create a new account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="mail@example.com" {...field} />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {isLogin ? "Login" : "Sign Up"}
                </Button>
              </form>
            </Form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M22 4c0-1.5-1.5-3-3-3H5c-1.5 0-3 1.5-3 3v16c0 1.5 1.5 3 3 3h14c1.5 0 3-1.5 3-3V4z" />
                <path d="M12 15V9h-2V7h6v2h-2v6" />
              </svg>
              Google
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </Button>
          </CardFooter>
        </Card>
      </AlertDialogContent>
    </AlertDialog>
  )
}
