
import express from "express";
import { AddressInfo } from "net";
import customerRouter from "./routes/routes";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/user", customerRouter)

const server = app.listen(process.env.PORT || 3003, () => {
   if (server) {
      const address = server.address() as AddressInfo;
      console.log(`Server is running in http://localhost:${address.port}`);
   } else {
      console.error(`Failure upon starting server.`);
   }
});