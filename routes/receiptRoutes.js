const express = require("express");
const receiptController = require("../controllers/receiptController");
const router = express.Router();

router.get("/all", receiptController.getAllReceipts);
router.post("/create/:userId", receiptController.createReceipt);
router.get("/:userId", receiptController.getReceiptById);
router.get("/:userId/all", receiptController.getAllReceiptsOfUser);

module.exports = router;
