import { useCallback, useEffect, useState } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { decrement, increment } from "@/Store/addToCartSlice";
import { wishListManage } from "@/Store/wishListSlice";
import toast from "react-hot-toast";

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
const ProductCart2 = ({ productData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isloaded, setIsLoaded] = useState(false);
  const addToCartProductDetails = useSelector((state) =>
    state.addToCart?.cartItems?.find(item =>
      item.productData?._id === productData._id
    ))
  const user = useSelector(state => state.auth)
  const wishListProduct = useSelector(state =>
    state.wishList?.wishListItem?.find(item =>
      item?._id === productData._id
    )
  )
  return (
    <div onClick={(e) => {
      const tag = e.target.tagName.toLowerCase();
      if (["button", "svg", "path", "section", "h3"].includes(tag)) return;
      navigate(`/shop/product-details/${productData._id}`);
    }}
      className={`relative group bg-white border border-gray-200 rounded-2xl shadow-sm p-4 
          cursor-pointer flex flex-col justify-between h-full transition-all duration-500 ease-out
          ${isloaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}


    >
      <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-center h-44 overflow-hidden">
        <img
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          src={productData?.avatar || ""}
          alt={productData?.name || ""}
          className="h-full object-contain"
        />
      </div>

      {productData?.discount ? (
        <Badge className="absolute top-3 left-3 bg-blue-600 text-white">
          {productData.discount}% OFF
        </Badge>
      ) : null}

      <div className="mt-4 px-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-base font-semibold text-slate-700 line-clamp-1">
              {capitalize(productData?.name)}
            </h3>
          </div>
          <p className="text-sm text-gray-500 mt-2 line-clamp-2 text-justify">
            {productData?.description}
          </p>
          <p className="text-sm text-gray-600 mt-5 line-clamp-1 flex flex-row-reverse justify-between items-center">
            <span className="text-sm font-bold min-w-fit">
              ₹{productData?.finalPrice}
            </span>
            {productData?.weight}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 space-x-3">
        <button
          onClick={(e) => {
            if (!user.isAuthenticate) {
              toast.error("Sign in to save this to your wishlist.")
              return;
            }
            e.stopPropagation();
            dispatch(wishListManage(productData))
          }}
          className={`p-2 rounded-lg border transition-colors duration-200 
              ${wishListProduct ? "bg-pink-100 border-pink-200" : "bg-white border-gray-200"} 
              hover:bg-pink-50 hover:border-pink-300`}
        >
          <Heart
            size={18}
            className={`transition-all duration-500
               ${wishListProduct ? "fill-pink-500 animate-big-small text-pink-600" : "fill-gray-200 text-gray-400"}`}
          />
        </button>

        {!addToCartProductDetails?.quantity ? (
          <button
            onClick={() => {
              if (!user.isAuthenticate) {
                toast.error("You must be logged in to buy this item.")
                return;
              }
              dispatch(increment(productData))
            }}
            className={`flex-1 py-2 rounded-lg ${productData?.quantity === 0 ? "bg-gray-400" : "bg-green-600"} text-white font-semibold text-sm ${productData?.quantity === 0 ? "" : "hover:bg-green-700"} transition`}
          >
            {productData?.quantity === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        ) : (
          <>
            {productData?.quantity === 0 ?
              <button
                onClick={() => {
                  if (!user.isAuthenticate) {
                    toast.error("You must be logged in to buy this item.")
                    return;
                  }
                  dispatch(increment(productData))
                }}
                className={`flex-1 py-2 rounded-lg ${productData?.quantity === 0 ? "bg-gray-400" : "bg-green-600"} text-white font-semibold text-sm ${productData?.quantity === 0 ? "" : "hover:bg-green-700"} transition`}
              >
                {productData?.quantity === 0 ? "Out of Stock" : "Add to Cart"}
              </button> :
              <section className={`flex items-center justify-between ${addToCartProductDetails?.quantity <= productData?.quantity ? "bg-green-100" : "bg-gray-200"} rounded-lg px-3 py-2 flex-1`}>

                <button onClick={() => dispatch(decrement(productData))} className="px-2 cursor-pointer text-green-700 hover:text-green-800">
                  <Minus size={18} />
                </button>
                <h3 className="text-green-900 font-semibold text-sm">{addToCartProductDetails?.quantity}</h3>
                <button onClick={() => dispatch(increment(productData))} className="px-2 cursor-pointer text-green-700 hover:text-green-800">
                  <Plus size={18} />
                </button>

              </section>
            }
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCart2;
