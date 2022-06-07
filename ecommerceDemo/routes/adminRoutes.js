import express from "express";
import AdminController from "../controllers/adminController.js";
import multer from "multer";
import validateToken from "../middlewares/validateTokenAdmin.js";


const router = express.Router();
const adminController = new AdminController();

let imageName;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/products");
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


router.get("/",validateToken,adminController.homepage);

router.route('/login').get(adminController.adminLoginGet).post(adminController.adminLogin)

router.post("/logout",validateToken,adminController.adminLogout);
router.get("/logout",validateToken,adminController.adminLogout)

//add product get and post
router.post("/addProduct",validateToken,upload.single("image"),(req,res)=>{
    adminController.addProduct(req,res,imageName)
    })
router.get("/addProduct",validateToken,adminController.addProductGet)

//update product get and post
// router.put('/updateProduct/:id',adminController.updateProduct)
router.route('/updateProduct/:id').get(validateToken,adminController.updateProductGet).post(adminController.updateProduct)

router.post("/addAdmin",adminController.addAdmin);
router.get("/addAdmin",adminController.addAdminGet);

router.route("/deleteProduct/:id").delete(validateToken,adminController.deleteProduct).get(validateToken,adminController.deleteProduct)

// router.route("/logout").get(adminController.adminLogout).post(adminController.adminLogout)


export default router;