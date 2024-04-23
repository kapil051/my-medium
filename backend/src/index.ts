import express from "express";
import cors from "cors";
import userRouter from "./routes/user"

const app=express();
  const port=3000;

  app.use(express.json());
  app.use(cors());
  app.use("/user",userRouter);



  app.listen(port,()=>{
    console.log(`app listning on the port ${port}`);
  })


