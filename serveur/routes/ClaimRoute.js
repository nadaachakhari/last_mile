const express = require("express");
const router = express.Router();

const {
  createClaim,
  getAllClaims,
  updateClaim,
  getClaimById,
  getClaimByClaimID
} = require("../controller/ClaimController");
const { authenticateToken } = require("../controller/AuthController");

// Routes pour les réclamations
router.get("/", authenticateToken, getAllClaims);
router.post("/:orderID", authenticateToken, createClaim);
router.put("/:claimID", authenticateToken, updateClaim);
router.get("/:orderID", authenticateToken, getClaimById);
router.get("/getClaimByClaimID/:claimID", authenticateToken, getClaimByClaimID);

module.exports = router;
