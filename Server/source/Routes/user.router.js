import { Router } from "express";
import { 
    registerUser, 
    loginUser, 
    logoutuser, 
    refreshAccessToken,
    addAddress,
    deleteAddress,
    updateAddress,
    updatePassword,
    updateProfile
} from "../Controllers/user.controller.js";
import upload from "../Middleware/Multer.middleware.js";
import verifyToken from "../Middleware/verifyToken.middleware.js";

const router = Router();

router.route('/register').post(upload.none(), registerUser)
router.route('/login').post(upload.none(), loginUser)
router.route('/logout').post(verifyToken, logoutuser)
router.route('/refresh/access/token').get(refreshAccessToken)
router.route('/address/:userID').post(addAddress)
router.route('/delete-address/:userID').get(deleteAddress)
router.route('/update-address/:userID').post(updateAddress)
router.route('/update-password/:userID').post(updatePassword)
router.route('/update-profile/:userID').post(upload.single('avatar'), updateProfile)

export default router  