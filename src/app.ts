import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import { MORGAN_FORMAT } from "./libs/config";

/**  1-ENTERANCE **/
const app = express();
console.log("dirname:", __dirname);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan(MORGAN_FORMAT));

/**  2-SESSIONS **/
/**  3-VIEWS **/
app.set("view", path.join(__dirname, "views"));
app.set("view engine", "ejs");
/**  4-ROUTERS **/
app.use("/", router); // BSSR: EJS
app.use("/admin", routerAdmin); // SPA: REACT

export default app;
