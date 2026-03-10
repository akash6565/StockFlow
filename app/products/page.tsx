"use client"

import { useEffect,useState } from "react"

export default function Products(){

 const [products,setProducts]=useState([])

 useEffect(()=>{

 fetch("/api/products")
 .then(r=>r.json())
 .then(setProducts)

 },[])

 return(

 <div>

 <h1 className="text-2xl font-bold mb-4">
 Products
 </h1>

 <a href="/products/new"
 className="underline">
 Add Product
 </a>

 <table className="mt-4 w-full border">

 <thead>
 <tr>
 <th>Name</th>
 <th>SKU</th>
 <th>Qty</th>
 </tr>
 </thead>

 <tbody>

 {products.map((p:any)=>(
 <tr key={p.id}>
 <td>{p.name}</td>
 <td>{p.sku}</td>
 <td>{p.quantity}</td>
 </tr>
 ))}

 </tbody>

 </table>

 </div>

 )

}