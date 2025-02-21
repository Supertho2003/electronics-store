import { configureStore } from "@reduxjs/toolkit";
import IdReducer from "./id.slice";
import authReducer from "./auth.slice";
import { userApi } from "./user/user.service";
import { productApi } from "./product/product.service";
import { categoryApi } from "./category/category.service";
import { cartItemApi } from "./cartItem/cartItem.service";
import { orderApi } from "./order/order.service";
import { colorApi } from "./color/colorProduct.service";
import { attributeApi } from "./attribute/attribute.service";
import { cartApi } from "./cart/cart.service";
import { reviewApi } from "./review/review.service";
import { authApi } from "./auth/auth.service";
import { couponApi } from "./coupon/coupon.service";
import discountReducer from "./discount.slice";
import { addressApi } from "./address/address.service";

export const store = configureStore({
  reducer: {
    id: IdReducer,
    auth: authReducer,
    discount: discountReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [colorApi.reducerPath]: colorApi.reducer,
    [attributeApi.reducerPath]: attributeApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [cartItemApi.reducerPath]: cartItemApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [couponApi.reducerPath]: couponApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      addressApi.middleware,
      productApi.middleware,
      colorApi.middleware,
      cartApi.middleware,
      attributeApi.middleware,
      categoryApi.middleware,
      cartItemApi.middleware,
      orderApi.middleware,
      couponApi.middleware,
      reviewApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispath = typeof store.dispatch;
