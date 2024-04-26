import { PrismaClient } from "@prisma/client";
  const prisma =new PrismaClient();

import express from "express";
import jwt from "jsonwebtoken";
import z from "zod";

const router=express.Router();


   const todoInput=z.object({
         title:z.string(),
         description:z.string(),
         done:z.boolean(),

   })


router.post("/add",async (req,res)=>{


      try{

             const body=req.body;
        const authHeader = req.headers['authorization'];
 
                if(!authHeader){
                     return res.json({
                         "msg":"please signin/signup to add todo"
                     })
                }

                 const {success}=todoInput.safeParse(body);
                    
            
                if(!success){
                  return res.json({
                    "msg":"please provide valid title description and done in valid format"
                  })
                } else{

                  const token = authHeader.split(' ')[1];
                  const user_decoded:any=jwt.verify(token,"secret_password");
                      
    
                  const added_todo= await prisma.todo.create({
                     data:{
                        title:body.title,
                        description:body.description,
                        done:body.done,
                        userId:user_decoded.id
                     }
                   })

       
                  return res.json({
                      user_decoded,
                      added_todo,
                     "msg":"inside from add todo",
                  })


                 }

      }catch(e){
           console.log(e);
          return res.json({
              "msg":"error",
                 e
          })
      }

   
      

})

export default router;
