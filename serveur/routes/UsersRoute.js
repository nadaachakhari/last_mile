const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getOrdersByDeliveryPerson,
  changeOrderState,
  checkUserName,
} = require("../controller/UsersController");
const { authenticateToken } = require('../controller/AuthController')

// Configuration de multer pour le stockage des images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/src/assets/images/users');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.post('/', upload.single('photo'), createUser);
router.get('/', getAllUsers);
router.get('/orders/delivery-person', authenticateToken, getOrdersByDeliveryPerson);
router.put('/change-state/:orderId', authenticateToken, changeOrderState);
router.get('/:id', getUserById);
router.put('/:id', upload.single('photo'), updateUser);
router.put('/update_deleted/:id', deleteUser);
router.get("/checkUserName/:userName", checkUserName);


module.exports = router;
