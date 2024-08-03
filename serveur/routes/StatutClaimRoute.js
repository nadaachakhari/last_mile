const express = require("express");
const router = express.Router();
const {
  getStatutClaims,
  getStatutClaimById,
  createStatutClaim,
  updateStatutClaim,
  deleteStatutClaim,
} = require("../controller/StatutClaimController");

router.get("/", getStatutClaims);
router.post("/", createStatutClaim);
router.get("/statutclaims/:id", getStatutClaimById);
router.put("/statutclaims/:id", updateStatutClaim);
router.delete("/statutclaims/:id", deleteStatutClaim);

module.exports = router;
