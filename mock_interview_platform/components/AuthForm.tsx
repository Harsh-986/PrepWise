"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {z} from "zod"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { Form } from "./ui/form"
import FormField from "./FormField"
import { useRouter } from "next/navigation"



const authFornSchema = (type: FormType) => {
  return z.object({
    name :type === "sign-up" ? z.string().min(3, { message: "Name is required" }) : z.string().optional(),
    email: z.string().email({ message: "Email is required" }),
    password: z.string().min(3, { message: "Password is required" }),
})}

const AuthForm = ({type} : {type:FormType}) => {
  const router = useRouter()
  const formSchema = authFornSchema(type)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if(type === "sign-up") {
        toast.success("Account created successfully")
        router.push("/sign-in")
      }
      else {
        // Sign in logic here
        toast.success("Logged in successfully")
        router.push("/")
      }
    } catch (error) {
      console.error(error)
      toast.error(`Threre was an error: ${error}`) 
    }
  }

  const inSignIn = type === "sign-in";


  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38}/>
          <h2 className="text-primary-100">PrepWise</h2>        
        </div>

        <h3>Practice job Interview with AI</h3>
      
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4 mt-4 form">
            {!inSignIn && 
            (<FormField 
              control={form.control} 
              name="name" 
              label="Name" 
              placeholder="Your Name" 
              type="text"
            />)}
            <FormField 
              control={form.control} 
              name="email" 
              label="Email" 
              placeholder="Your Email" 
              type="email"
            />
            <FormField 
              control={form.control} 
              name="password" 
              label="Password" 
              placeholder="Enter Your Password" 
              type="password"
            />
            <Button className="btn" type="submit">{inSignIn ? "Sign in" : "Create an Account"}</Button>
          </form>
        </Form>

        <p className="text-center">
          {inSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link href={!inSignIn ? '/sign-in' : '/sign-up'} className="font-bold text-user-primary ml-1">
            {inSignIn ? "Sign up" : "Sign in"}
          </Link>
          
        </p>

      </div>
    </div>
  )
}

export default AuthForm