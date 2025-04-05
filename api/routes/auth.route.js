import express from 'express';
const router = express.Router();
import {register}  from '../controllers/auth.controller.js';
import{ login }from '../controllers/auth.controller.js';
import {logout }from '../controllers/auth.controller.js';


router.post("/register",register);
router.post("/login",login);
router.post("/logout",logout);

export default router;

