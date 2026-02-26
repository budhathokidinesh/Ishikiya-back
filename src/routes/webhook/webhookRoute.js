import express from "express";
import { stripeWebhookHandler } from "../../controllers/Webhook/stripeWebhookController.js";

const router = express.Router();

router.post("/", stripeWebhookHandler);

export default router;
