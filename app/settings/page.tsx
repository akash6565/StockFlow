"use client"

export default function Settings(){

 async function submit(e:any){

  e.preventDefault()

  const form=new FormData(e.target)

  await fetch("/api/settings",{

   method:"POST",

   body:JSON.stringify({
    defaultLowStock:
     Number(form.get("threshold"))
   })

  })

 }

 return(

 <form onSubmit={submit}
 className="space-y-4 max-w-md">

 <h1>Settings</h1>

 <input
 name="threshold"
 type="number"
 placeholder="Default Low Stock"
 className="border p-2 w-full"
 />

 <button className="bg-black text-white px-4 py-2">
 Save
 </button>

 </form>

 )

}