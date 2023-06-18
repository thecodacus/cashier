import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { baseService } from './services/baseService'
import { authSlice } from './services/authService'
import { checkoutSlice } from './services/invoiceService'


export const store = configureStore({
    reducer: {
        [baseService.reducerPath]: baseService.reducer,
        auth: authSlice.reducer,
        checkout: checkoutSlice.reducer
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(baseService.middleware)
    }
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useAppDispatch = () => useDispatch<AppDispatch>();