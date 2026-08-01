import express from "express";
import {
  login,
  updateprofile,
  upgradePlan,
} from "../controllers/auth.js";

const routes = express.Router();

routes.post("/login", login);
routes.patch("/update/:id", updateprofile);

routes.post("/upgrade-plan", upgradePlan);

export default routes;