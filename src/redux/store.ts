import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./api/userAPI";
import { productAPI } from "./api/productAPI";
import { orderAPI } from "./api/orderAPI";
import { dashboardAPI } from "./api/dashboardAPI";
import { paymentAPI } from "./api/paymentAPI";
import { userReducer } from "./reducer/userReducer";
import { cartReducer } from "./reducer/cartReducer";

export const store = configureStore({
    reducer: {
        [userAPI.reducerPath]: userAPI.reducer,
        [productAPI.reducerPath]: productAPI.reducer,
        [orderAPI.reducerPath]: orderAPI.reducer,
        [paymentAPI.reducerPath]: paymentAPI.reducer,
        [dashboardAPI.reducerPath]: dashboardAPI.reducer, // Added dashboardAPI reducer
        [userReducer.name]: userReducer.reducer,
        [cartReducer.name]: cartReducer.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(userAPI.middleware)
            .concat(productAPI.middleware)
            .concat(orderAPI.middleware)
            .concat(paymentAPI.middleware)
            .concat(dashboardAPI.middleware), // Added dashboardAPI middleware
});

export type RootState = ReturnType<typeof store.getState>;
