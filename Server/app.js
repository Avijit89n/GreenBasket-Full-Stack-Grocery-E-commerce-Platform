import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import path from 'path'; // 👈 1. Import 'path' module

const app = express();

// --- Configuration ---
// Note: process.env.FRONTEND_URL for CORS might be redundant if the Express server serves the frontend
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json());
app.use(cookieParser());
// app.use(express.static('public')) // ⚠️ Keep this if you have server-side static assets (like uploads)


// --- Monolith Setup: Serve React Frontend ---
// Define the directory for the compiled React files (ADJUST THIS PATH!)
const __dirname = path.resolve();
const FRONTEND_BUILD_PATH = path.join(__dirname, '..', 'client', 'dist'); // Example path: Assumes 'dist' is sibling of backend folder

// 2. Serve the static build files (HTML, CSS, JS, etc.)
app.use(express.static(FRONTEND_BUILD_PATH));


// --- API Routes Import ---
import userRoute from './source/Routes/user.router.js';
import productRouter from "./source/Routes/product.router.js";
import featureRouter from "./source/Routes/feature.router.js";
import categoryRouter from "./source/Routes/category.router.js";
import subCategoryRouter from "./source/Routes/subCategory.router.js";
import addCartRouter from "./source/Routes/addToCart.router.js";
import WishListRouter from "./source/Routes/wishList.router.js";
import orderRouter from "./source/Routes/orders.router.js";
import dataSheetRouter from "./source/Routes/dataSheet.router.js";


// --- API Routes Use ---
app.use('/api/user', userRoute);
app.use('/api/product', productRouter);
app.use('/api/feature', featureRouter);
app.use('/api/category', categoryRouter);
app.use('/api/subcategory', subCategoryRouter);
app.use('/api/cart', addCartRouter);
app.use('/api/wishlist', WishListRouter);
app.use('/api/order', orderRouter);
app.use('/api/data', dataSheetRouter);


// --- Client-Side Routing Fix (THE CRITICAL PART) ---
// 3. CATCH-ALL ROUTE: This MUST come after all API routes.
// For any GET request that doesn't start with /api and doesn't match a static file, 
// send the index.html file so React Router can handle it.
app.get('*', (req, res) => {
    res.sendFile(path.join(FRONTEND_BUILD_PATH, 'index.html'));
});


// --- Global Error Handler ---
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});


export default app;