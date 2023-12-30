import connectDB from "./database/index.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({
    path:"./.env",
})

const PORT=process.env.PORT||3000;

connectDB().
then(()=> {
      app.listen(PORT, () => {
          console.log(`Server is listening on port: ${PORT}`);
      });

})
.catch((error)=>{
    console.log("Connection Error: ",error);
})