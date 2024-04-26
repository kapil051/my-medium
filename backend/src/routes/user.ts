import express from "express"
import z from "zod";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
  const prisma= new PrismaClient();

const router=express.Router();

const signupInput=z.object({
       email:z.string().email(),
       password:z.string().min(6)
})

router.post("/signup",async (req,res)=>{

      const body=req.body;

      try{
          const responce=signupInput.safeParse(body);
             if(!responce.success){
                   
                    return res.json({
                         "msg":"please send a valid email and password should be of min 6 charcters"    
                    })
             }else{

                       const saved_user=await prisma.user.create({
                               data:body,
                       });

                       const token=jwt.sign({id:saved_user.id,email:saved_user.email},"secret_password"); 

                   //store user in the database
                   //issue a token to the user that signup
                
                   return res.json({
                          token,
                         saved_user,
                       "msg":"successfully sign up",
                   })


             }

      }catch(e){
           console.log(e);
           return res.json({
                "msg":e,
           })
      }


})

const signinInput=z.object({
       email:z.string().email(),
       password:z.string().min(6)
})

router.post("/signin",async (req,res)=>{
        const body=req.body;

         try{

            const {success}=signinInput.safeParse(body);   

              if(!success){
                       return res.json({
                            "msg":"please send a valid email and password should be of min 6 charcters"
                       })
              }else{
 
                      const user_found=await prisma.user.findFirst({
                            where:body,
                      })

                         if(user_found!=null){
                            const token=jwt.sign({id:user_found.id,email:user_found.email},"secret_password");
                              return res.json({
                                   user_found,
                                   token,
                             })
                         }else{
                              return res.json({
                                       user_found,
                                     "msg":"no valid user for this email and password"
                              })    
                         }
                     
              }


         }catch(e){
              console.log(e);
              return res.json({
                   "msg":e,
              })
         }

})

router.get("/allUsers",async(req,res)=>{

         try{

             const all_users= await prisma.user.findMany();

                if(!all_users){
                    return res.json({
                        "msg":"no user present in the database",
                     }) 
                }else{
                    return res.json({
                         all_users
                     })
                }      

         }catch(e){
                console.log(e);
                return res.json({
                       "msg":e,
                })
         }
     
})


export default router;