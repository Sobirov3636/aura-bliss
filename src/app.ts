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
import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";

const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
  uri: String(process.env.MONGO_URL),
  collection: "sessions",
});

/**  2-SESSIONS **/
app.use(
  session({
    secret: String(process.env.SESSION_SECRET), // => secretni .env filedan olyapmiz
    cookie: {
      maxAge: 1000 * 3600 * 3, // 3 hours  => cookie qancha vaqt saqlanishini belgilayapmiz
    },
    store: store, // => store ga biz yuqorida yasagan mongoDBdagi sessions collectionni beryapmiz.
    resave: true, // => cookieimiz 3 soat mobaynida saqlanar edi. Shu oraliqda user qayta kirsa osha kirgan vaqtidan boshlab yana 3 soatni hisoblaydi. false boladigan bolsa, har kirganida update bolmaydi birinchi kirgan vaqti boyicha hisoblaydi.
    saveUninitialized: true,
  })
);
/**  3-VIEWS **/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
/**  4-ROUTERS **/
app.use("/", router); // BSSR: EJS
app.use("/admin", routerAdmin); // SPA: REACT

export default app;
