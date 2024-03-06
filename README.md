# 電商專案 API 文件

這是一個使用 Node.js 製作的電商專案

## 技術

-   **bcrypt**: 密碼加密
-   **body-parser**: 解析請求主體中的 JSON 數據
-   **express**: Web 應用框架
-   **joi**: 數據驗證
-   **jsonwebtoken**: 生成和驗證 JSON Web Tokens (JWT)
-   **pg**: PostgreSQL 客戶端
-   **pg-hstore**: PostgreSQL 的 JSON 對應存儲
-   **sequelize**: Node.js 的 ORM 框架，支持多種數據庫

## 登入、註冊（JWT）

-   **POST /api/auth/register**

    -   注冊新用戶
    -   請求參數：
        -   username: 使用者名稱
        -   email: 電子郵件地址
        -   password: 密碼
    -   返回：
        -   200: 注冊成功
        -   400: 請求無效

-   **POST /api/auth/login**
    -   使用者登入
    -   請求參數：
        -   email: 電子郵件地址
        -   password: 密碼
    -   返回：
        -   200: 登入成功，返回 JWT
        -   400: 請求無效

## 商品相關

-   **GET /api/product**

    -   獲取所有商品列表，包含變體

-   **GET /api/product/:productId**

    -   獲取特定商品詳細信息

## 購物車操作

-   **POST /api/cart/**

    -   新增商品到購物車
    -   請求參數：
        -   productId: 商品 ID
        -   quantity: 數量
    -   返回：
        -   201: 商品成功新增到購物車
        -   400: 請求無效

-   **GET /api/cart**

    -   獲取購物車內容

-   **PUT /api/cart/**

    -   修改購物車中特定商品的數量
    -   請求參數：
        -   productId: 商品 ID
        -   quantity: 新的數量
    -   返回：
        -   200: 購物車內容成功更新
        -   400: 請求無效

-   **DELETE /api/cart/:itemId**
    -   從購物車中刪除特定商品
    -   返回：
        -   204: 商品成功從購物車中刪除
        -   400: 請求無效

## 訂單管理

-   **POST /api/order**
    -   下單
    -   請求參數：
        -   items: 購買的商品列表
    -   返回：
        -   200: 訂單成功建立
        -   400: 請求無效
