import { Router } from "express";

import PostsController from "@/controllers/PostsController";
import UserController from "@/controllers/UserController";
import { isAdmin } from "@/middlewares/isAdmin";

import alertsRoutes from "./alerts.routes";
import assessmentsRoutes from "./assessments.routes";
import bimesterPlansRoutes from "./bimester-plans.routes";
import classesRoutes from "./classes.routes";
import lessonsRoutes from "./lessons.routes";
import postsRoutes from "./posts.routes";
import usersRoutes from "./users.routes";
import aiRoutes from "./ai.routes";
import attachmentsRoutes from "./attachments.routes";
import aiHistoryroutes from "./aiHistory.routes";

const routes = Router();

routes.use("/posts", postsRoutes);
routes.use("/users", usersRoutes);
routes.use("/classes", classesRoutes);
routes.use("/lessons", lessonsRoutes);
routes.use("/assessments", assessmentsRoutes);
routes.use("/alerts", alertsRoutes);
routes.use("/bimester-plans", bimesterPlansRoutes);
routes.use("/ai", aiRoutes);
routes.use("/ai-history", aiHistoryroutes);
routes.use("/", attachmentsRoutes);

routes.get("/admin/posts", isAdmin, PostsController.getAll);
routes.delete("/admin/posts/:id", isAdmin, PostsController.delete);
routes.put("/admin/posts/:id", isAdmin, PostsController.update);

routes.get("/admin/users", isAdmin, UserController.getAll);
routes.delete("/admin/users/:id", isAdmin, UserController.delete);
routes.put("/admin/users/:id", isAdmin, UserController.update);

export default routes;
