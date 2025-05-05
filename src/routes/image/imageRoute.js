import express from "express";
import multer from "multer";
import { imageUploadController } from "../../controllers/image/imageUpload.js";
import ExpressFormidable from "express-formidable";

const router = express.Router();
router.post(
  "/upload-image",
  ExpressFormidable({ maxFieldsSize: 5 * 1024 * 1024 }),
  imageUploadController
);
export default router;
