import { Router } from "express";
import multer from "multer";
import BookController from "../controllers/bookController.js";
import validateToken from "../middlewares/validateToken.js";

const router = Router();
let imageName;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    imageName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      "-" +
      file.originalname.trim();
    cb(null, imageName);
  },
});

const upload = multer({ storage });
const bookController = new BookController();

// /book/add
router.post("/add",validateToken, upload.single("image"), (req, res) => {
  bookController.addBook(req, res, imageName);
});

router.get("/:id", validateToken, bookController.getBookByID);

// ?limit = 20
router.get("/", bookController.getBooks);

router.put("/update/:id",validateToken, bookController.updateBook);

router.delete("/delete/:id",validateToken, bookController.deleteBook);

// /search/all?q=
router.get("/search/all",validateToken, bookController.searchBook);

export default router;
