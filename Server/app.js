// app.js (server side)
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json());
app.use(cookieParser());

// --- API routes (your routers) ---
import userRoute from './source/Routes/user.router.js'
import productRouter from "./source/Routes/product.router.js"
import featureRouter from "./source/Routes/feature.router.js"
import categoryRouter from "./source/Routes/category.router.js"
import subCategoryRouter from "./source/Routes/subCategory.router.js"
import addCartRouter from "./source/Routes/addToCart.router.js"
import WishListRouter from "./source/Routes/wishList.router.js"
import orderRouter from "./source/Routes/orders.router.js"
import dataSheetRouter from "./source/Routes/dataSheet.router.js"

app.use('/api/user', userRoute)
app.use('/api/product', productRouter)
app.use('/api/feature', featureRouter)
app.use('/api/category', categoryRouter)
app.use('/api/subcategory', subCategoryRouter)
app.use('/api/cart', addCartRouter)
app.use('/api/wishlist', WishListRouter)
app.use('/api/order', orderRouter)
app.use('/api/data', dataSheetRouter)

// --- Serve client build (from server/public) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// public folder should contain your built client (index.html + assets)
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all to serve index.html for client-side routes (React Router)
app.get('*', (req, res) => {
  // Optional: avoid serving index.html for API calls (not necessary if APIs are above)
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Error handler (must be last) ---
app.use((err, req, res) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
