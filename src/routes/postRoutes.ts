import { Router } from "express";
import { PostController } from "../controllers/postController";
import { MongoPostRepository } from "../repositories/MongoPostRepository";
import { PostService } from "../services/PostService";

// --------------------------------------------------------
// Composition Root: محل تزریق وابستگی و ترکیب لایه‌ها
// --------------------------------------------------------

// ۱. Repository (وابستگی به دیتابیس) را ایجاد می‌کنیم.
const postRepository = new MongoPostRepository();

// ۲. Service (منطق تجاری) را با تزریق Repository به آن ایجاد می‌کنیم.
const postService = new PostService(postRepository);

// ۳. Controller (لایه API) را با تزریق Service به آن ایجاد می‌کنیم.
const postController = new PostController(postService);

const router = Router();

// تعریف مسیرها (Routes) و نگاشت آن‌ها به متدهای Controller
router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.post("/", postController.createPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

export default router;
