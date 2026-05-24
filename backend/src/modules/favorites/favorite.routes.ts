import { Router, type IRouter } from "express";
import { favoriteController } from "./favorite.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

export const favoriteRoutes: IRouter = Router();

favoriteRoutes.use(authenticate);
favoriteRoutes.get("/", favoriteController.list);
favoriteRoutes.post("/:propertyId", favoriteController.add);
favoriteRoutes.delete("/:propertyId", favoriteController.remove);
