import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"

const app = express()

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


// routers
app.use('/api/user', userRoute)
app.use('/api/product', productRouter)
app.use('/api/feature', featureRouter)
app.use('/api/category', categoryRouter)
app.use('/api/subcategory', subCategoryRouter)
app.use('/api/cart', addCartRouter)
app.use('/api/wishlist', WishListRouter)
app.use('/api/order', orderRouter)
app.use('/api/data', dataSheetRouter)



export default app;