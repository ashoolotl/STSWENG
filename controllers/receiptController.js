const Receipt = require("../models/receiptModel.js");

exports.createReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.create(req.body);
    console.log("receipt id in create receipt: ", receipt._id);
    res.status(201).json({
      status: "success",
      data: {
        receipt,
        id: receipt._id,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "An error occurred.",
    });
  }
};

exports.getReceiptById = async (req, res, next) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({
        status: "fail",
        message: "Receipt not found.",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        receipt,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: "An error occurred.",
    });
  }
};


exports.getAllReceiptsOfUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const allReceiptsOfUser = await Receipt.find({ owner: userId });

    res.status(201).json({
      status: "success",
      data: {
        receipts: allReceiptsOfUser,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: "An error occurred.",
    });
  }
};


exports.getAllReceipts = async (req, res, next) => {
  try {
    const allReceipts = await Receipt.find();

    res.status(200).json({
      status: "success",
      data: {
        receipts: allReceipts,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: "An error occurred.",
    });
  }
};

