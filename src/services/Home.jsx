import { useEffect } from "react";
import { getModules } from "@/services/modulesService";

useEffect(()=>{

   getModules()
   .then(data=>{
      console.log("MODULOS:",data);
   });

},[]);