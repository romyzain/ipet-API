const express = require('express');
const router = express.Router();
const { userController } = require('../controller');
const { auth } = require('../helper/jwt');
const {
    Register,
    Login,
    keepLogin,
    emailVerification,
    changePicture,
    fetchDataUsers,
    fetchTransHistory,
    addAddress,
    deleteAddress,
    editAddress,
    changePassword,
    fetchAllUsers,
    hexPass,
    banUser,
    unbanUser,
    addPhone,
    deletePhone,
    editPhone
} = userController;


router.post('/register', Register);
router.post('/login', Login);
router.post('/keep-login', auth ,keepLogin);
router.post('/verification', emailVerification);
router.patch('/changePicture/:id', auth, changePicture);
router.get('/fetchDataUsers/:id', fetchDataUsers);
router.get('/fetchTransHistory/:id', fetchTransHistory);
router.post('/addAddress', addAddress);
router.delete('/deleteAddress/:id', deleteAddress);
router.patch('/editAddress/:id', editAddress);
router.patch('/changePassword/:id', changePassword);
router.get('/fetchAllUsers', fetchAllUsers);
router.patch('/hexPass', auth, hexPass);
router.patch('/banUser/:id', banUser);
router.patch('/unbanUser/:id', unbanUser);
router.patch('/editPhone/:id', editPhone);
router.delete('/deletePhone/:id', deletePhone);
router.post('/addPhone', addPhone)



module.exports = router;