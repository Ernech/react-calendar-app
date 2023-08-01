import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../../src/auth/authSlice";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { initialState } from "../__fixtures/authStates";

const getMockStore = (initialState)=>{
    return configureStore({
        reducer:{
            auth:authSlice.reducer
        },
        preloadedState:{
            auth: {...initialState}
        }
    })
}

describe('Test on useAuthStore', () => {
    
    test('should return default values', () => {
        const mockStore = getMockStore({...initialState});
           const { result }=renderHook(()=>useAuthStore(), {
            wrapper: ({children})=> <Provider store={mockStore}>{children}</Provider>
           });
           expect(result.current).toEqual({ status: 'checking',
           user: {},
           errorMessage: undefined,
           startLogin: expect.any(Function),
           startRegiter: expect.any(Function),
           checkAuthToken: expect.any(Function),
           startLogout: expect.any(Function)
        });
        
    });

});