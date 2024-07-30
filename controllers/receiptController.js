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
      message: error,
    });
  }
};

exports.getReceiptById = async (req, res, next) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        receipt,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getAllReceiptsOfUser = async (req, res, next) => {
  const userId = req.params.userId;
  const allReceiptsOfUser = await Receipt.find({ owner: userId });

  try {
    res.status(201).json({
      status: "success",
      data: {
        receipts: allReceiptsOfUser,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
    next();
  }
};

exports.getAllReceipts = async (req, res, next) => {
  const allReceipts = await Receipt.find();
  
  try {
    res.status(200).json({
      status: "success",
      data: {
        receipts: allReceipts,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
    next();
  }
};
