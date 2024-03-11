const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 用戶註冊
 *     description: 用戶註冊端點，註冊一個新的用戶
 *     tags: [FrontAPI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: 註冊成功
 *       400:
 *         description: 錯誤的請求
 *       409:
 *         description: 用戶已存在
 */
router.post('/register', authController.register('user'))

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 用戶登入
 *     description: 用戶登入端點，通過提供的帳號和密碼進行身份驗證
 *     tags: [FrontAPI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: 登入成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: 登入成功的 token
 *       400:
 *         description: 錯誤的請求
 *       401:
 *         description: 未授權，用戶不存在或密碼錯誤
 */
router.post('/login', authController.login('user'))

module.exports = router
