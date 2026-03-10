"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function Login(){

 const [email,setEmail]=useState("")
 const [password,setPassword]=useState("")

 async function submit(e:any){

  e.preventDefault()

  await signIn("credentials",{
   email,
   password,
   callbackUrl:"/dashboard"
  })

 }

 return(

 <form onSubmit={submit}
 className="max-w-md mx-auto space-y-4">

 <h1 className="text-2xl font-bold">
 Login
 </h1>

 <input
 className="border p-2 w-full"
 placeholder="Email"
 onChange={e=>setEmail(e.target.value)}
 />

 <input
 type="password"
 className="border p-2 w-full"
 placeholder="Password"
 onChange={e=>setPassword(e.target.value)}
 />

 <button className="bg-black text-white px-4 py-2">
 Login
 </button>

 </form>

 )

}