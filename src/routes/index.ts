import { Router } from "express";

import postsRoutes from "./posts.routes";
import usersRoutes from "./users.routes";
import classesRoutes from "./class.routes";
import lessonsRoutes from "./lesson.routes";

import PostsController from "@/controllers/PostsController";
import UserController from "@/controllers/UserController";
import ClassController from "@/controllers/ClassController";
import LessonController from "@/controllers/LessonController";

import { isAdmin } from "@/middlewares/isAdmin";

const routes = Router();

routes.use("/posts", postsRoutes);
routes.use("/users", usersRoutes);
routes.use("/classes", classesRoutes);
routes.use("/lessons", lessonsRoutes);

routes.get("/admin/posts", isAdmin, PostsController.getAll);
routes.delete("/admin/posts/:id", isAdmin, PostsController.delete);
routes.put("/admin/posts/:id", isAdmin, PostsController.update);

routes.get("/admin/users", isAdmin, UserController.getAll);
routes.delete("/admin/users/:id", isAdmin, UserController.delete);
routes.put("/admin/users/:id", isAdmin, UserController.update);

export default routes;