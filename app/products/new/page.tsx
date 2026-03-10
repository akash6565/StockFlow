"use client"

export default function NewProduct(){

 async function submit(e:any){

  e.preventDefault()

  const form=new FormData(e.target)

  await fetch("/api/products",{

   method:"POST",

   body:JSON.stringify({

    name:form.get("name"),
    sku:form.get("sku"),
    quantity:Number(form.get("quantity"))

   })

  })

  window.location.href="/products"

 }

 return(

 <form onSubmit={submit}
 className="space-y-4 max-w-md">

 <h1>Add Product</h1>

 <input name="name"
 placeholder="Name"
 className="border p-2 w-full"/>

 <input name="sku"
 placeholder="SKU"
 className="border p-2 w-full"/>

 <input name="quantity"
 type="number"
 placeholder="Quantity"
 className="border p-2 w-full"/>

 <button className="bg-black text-white px-4 py-2">
 Save
 </button>

 </form>

 )

}