import { Router } from "express";
import multer from "multer";
import BookController from "../controllers/bookController.js";
import passport from "passport";
import validateLogin from "../auth/verify.js"
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
router.post("/add",validateLogin,upload.single("image"), (req, res) => {
  bookController.addBook(req, res, imageName);
});

// must provide bearer token to access this
router.get(
  "/auth",
  passport.authenticate('jwt',{session:false}),
  (req, res) => {
    res.send(req.user);
  }
);
router.get("/:id", bookController.getBookByID);

// ?limit = 20
router.get("/", bookController.getBooks);

router.put("/update/:id", bookController.updateBook);

router.delete("/delete/:id", bookController.deleteBook);

// /search/all?q=
router.get("/search/all", bookController.searchBook);

export default router;
