const express = require("express");
const vehicleController = require("../controllers/vehicleController");
const router = express.Router();

router.route("/").get(vehicleController.getAllVehicle).post(vehicleController.createVehicle);

router.route("/:ownerId").get(vehicleController.getVehicleByOwner);
router.route("/:plateNumber").get(vehicleController.getVehicleById);
router.route("/:vehicleId").patch(vehicleController.updateVehicleStatus);
router.route("/platenum/:plateNumber").patch(vehicleController.updateVehicleStatusByPlateNumber);

module.exports = router;
