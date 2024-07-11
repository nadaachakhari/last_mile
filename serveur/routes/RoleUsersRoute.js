const express = require('express');
const router = express.Router();
const {
    getRoleUsers,
    getRoleUserById,
    createRoleUser,
    updateRoleUser,
    deleteRoleUser,
} = require('../controller/RoleUsersController');

router.get('/', getRoleUsers);

router.get('/:id', getRoleUserById);
router.post('/', createRoleUser);

router.put('/:id', updateRoleUser);
router.put('/update_deleted/:id', deleteRoleUser);

module.exports = router;
