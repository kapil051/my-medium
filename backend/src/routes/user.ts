import express from "express"
import z from "zod";

const router=express.Router();

const signupInput=z.object({
       email:z.string().email(),
      password:z.string().min(6)
})


router.post("/signup",async (req,res)=>{

      const body=req.body;
         console.log(req.body);

      try{
          const responce=signupInput.safeParse(body);
             if(!responce.success){
                   
                    return res.json({
                         "msg":"please send a valid email and password should be of min 6 charcters"    
                    })
             }else{

                   //store user in the database
                   //issue a token to the user that signup
                
                   return res.json({
                       "msg":"successfully sign up",
                   })


             }

      }catch(e){
           console.log(e);
      }


})

router.get("/",(req,res)=>{
       return res.json({
           "msg":"from user route",
       })
})


export default router;