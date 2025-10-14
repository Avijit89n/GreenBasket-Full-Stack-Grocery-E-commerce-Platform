import ProductCart2 from '@/components/Common/ProductCart2'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Delete, Heart, ShoppingBag, Trash2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { clearWishList } from '@/Store/wishListSlice'

function WishList() {
  const wishListItems = useSelector(state => state?.wishList?.wishListItem)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth)
  
  return (
    <div className='min-h-screen bg-gray-50'>

      <div className='max-w-8xl mx-auto px-10 py-8'>
        {wishListItems?.length === 0 ? (
          <div className='text-center py-20'>
            <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <Heart className='w-12 h-12 text-gray-400' />
            </div>
            <h3 className='text-2xl font-semibold text-gray-900 mb-3'>Your wishlist is empty</h3>
            <p className='text-gray-600 mb-8 max-w-md mx-auto'>
              Start adding products you love and keep track of items you want to buy later
            </p>
            <button onClick={() => navigate('/shop/lists/all')} className='bg-gradient-to-r from-green-500 via-emerald-600 to-green-700 border-2 border-green-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto'>
              <ShoppingBag className='w-5 h-5' />
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className='flex items-center justify-between mb-8 flex-wrap gap-5'>
              <div>
                <h2 className='text-xl font-semibold text-gray-900'>
                  {wishListItems.length} Product{wishListItems.length !== 1 ? 's' : ''} Found
                </h2>
                <p className='text-gray-600'>Browse and manage your saved items</p>
              </div>
              
              <div className='flex gap-3'>
                <button onClick={() => dispatch(clearWishList())} className='flex gap-2 items-center justify-center px-6 py-2 hover:bg-red-200 cursor-pointer border border-red-300 rounded-lg font-semibold text-red-700 bg-red-100 transition-colors'>
                  <Trash2 height={18} width={18}/> Clear All
                </button>
              </div>
            </div>

            <div className='bg-white shadow-lg rounded-xl border border-gray-200 p-6'>
              <div className='grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6'>
                {wishListItems?.map((ele, index) =>
                  <div key={ele._id} className='opacity-0 group animate-fade-in-scale duration-200'
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProductCart2 productData={ele} />
                  </div>
                )}
              </div>
            </div>

            <div className='rounded-xl p-8 mt-8 text-center'>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                Ready to purchase?
              </h3>
              <p className='text-gray-600 mb-6'>
                Add your favorite items to cart and complete your order
              </p>
              <div className='flex gap-4 justify-center flex-wrap'>
                <button className='border border-gray-300 text-gray-700 px-8 py-3 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors'>
                  Continue Shopping
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default WishList