import { createSlice } from '@reduxjs/toolkit'
import jwtDecode from 'jwt-decode';
import { baseService } from './baseService'
import { Role } from '../../models/IUser'


const authService = baseService.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation<string, { username: string, password: string }>({
            query: (creds) => ({
                url: 'authenticate_user',
                method: 'POST',
                body: { ...creds },
            }),
        })
    }),
    overrideExisting: false,
})

export const {
    useLoginMutation
} = authService

interface IAuthState {
    isAuthenticated: boolean,
    claims: {
        username: string,
        first_name: string,
        last_name: string,
        role: Role
    } | null,
    token: string | null,
    error: string | null
}
const token = localStorage.getItem("auth_token")
let claims: IAuthState['claims'] | null = null
if (token) {
    console.log({ token });

    let decoded = jwtDecode(token)
    console.log(decoded);
    claims = decoded as any

}
const initialState: IAuthState = {
    isAuthenticated: token ? true : false,
    claims: claims,
    token: token,
    error: null
}

export const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(authService.endpoints.login.matchPending, (state) => {
            localStorage.removeItem("auth_token")
            state.isAuthenticated = false;
            state.claims = null;
            state.token = null;
            state.error = null;

        }).addMatcher(authService.endpoints.login.matchFulfilled, (state, action) => {
            localStorage.setItem("auth_token", action.payload)
            state.isAuthenticated = true;
            state.claims = null;
            state.token = action.payload;
            state.error = null;
        }).addMatcher(authService.endpoints.login.matchRejected, (state, action) => {
            localStorage.removeItem("auth_token")
            state.isAuthenticated = false;
            state.claims = null;
            state.token = null;
            state.error = `${action.payload?.data}`
        })
    }
})
