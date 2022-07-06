const express = require("express");
const path = require("path");

const productsController = require("../controllers/products-controller");
const { authUser, authRole } = require("../middleware/auth");
const { ROLE } = require("../data/data");
const multer = require("multer");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/uploads");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname + path.extname(file.originalname));
    cb(null, file.originalname);
  },
});

const router = express.Router();
const upload = multer({ limits: 500000, storage: fileStorageEngine });

router.get("/", productsController.getProducts);

router.get("/:id", productsController.getProductById);

router.post(
  "/",
  authUser,
  authRole(ROLE.SELLER),
  //fileUpload.single("image"),
  //upload.single("image"),
  productsController.createProduct
);

router.patch(
  "/:id",
  authUser,
  authRole(ROLE.SELLER),
  productsController.updateProduct
);

router.delete(
  "/:id",
  authUser,
  authRole(ROLE.SELLER, ROLE.ADMIN),
  productsController.deleteProduct
);

module.exports = router;
