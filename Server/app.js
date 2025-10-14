import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"
import path from 'path'; // <--- 1. Import 'path' module
import { fileURLToPath } from 'url'; // <--- 2. Import utility for ES Modules

// Define __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const app = express()

// Middleware setup (keep as is)
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser())
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


// routers import
import userRoute from './source/Routes/user.router.js'
import productRouter from "./source/Routes/product.router.js"
import featureRouter from "./source/Routes/feature.router.js"
import categoryRouter from "./source/Routes/category.router.js"
import subCategoryRouter from "./source/Routes/subCategory.router.js"
import addCartRouter from "./source/Routes/addToCart.router.js"
import WishListRouter from "./source/Routes/wishList.router.js"
import orderRouter from "./source/Routes/orders.router.js"
import dataSheetRouter from "./source/Routes/dataSheet.router.js"


// API Routes (Keep as is - they MUST come before the Catch-All)
app.use('/api/user', userRoute)
app.use('/api/product', productRouter)
app.use('/api/feature', featureRouter)
app.use('/api/category', categoryRouter)
app.use('/api/subcategory', subCategoryRouter)
app.use('/api/cart', addCartRouter)
app.use('/api/wishlist', WishListRouter)
app.use('/api/order', orderRouter)
app.use('/api/data', dataSheetRouter)


// --- 4. Serve React Production Build ---
// IMPORTANT: Adjust 'path.join' to the actual location of your React build folder (e.g., 'client/dist' or 'client/build')
// This makes sure your browser can download the CSS, JS, and other static assets.
app.use(express.static(path.join(__dirname, '..', 'client', 'dist'))); // Assuming 'client/dist' is one level up from your server code

// --- 5. The FALLBACK CATCH-ALL Route (The Fix!) ---
// If Express hasn't matched any /api/ route above, send the index.html.
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'));
});


export default app;