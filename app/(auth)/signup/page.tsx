"use client"

import { useEffect,useState } from "react"

export default function Dashboard(){

 const [data,setData]=useState<any>()

 useEffect(()=>{

  fetch("/api/dashboard")
  .then(r=>r.json())
  .then(setData)

 },[])

 if(!data) return <p>Loading...</p>

 return(

 <div className="space-y-6">

 <h1 className="text-3xl font-bold">
 Dashboard
 </h1>

 <div className="grid grid-cols-2 gap-4">

 <div className="border p-4">
 Products: {data.totalProducts}
 </div>

 <div className="border p-4">
 Total Qty: {data.totalQuantity}
 </div>

 </div>

 </div>

 )

}