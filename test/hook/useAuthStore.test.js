import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../../src/auth/authSlice";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { initialState, notAuthenticatedState } from "../__fixtures/authStates";
import { act } from "react-dom/test-utils";
import { testUserCredentials } from "../__fixtures/testUser";

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

    test('startLogin should preform login correctly', async() => {
        localStorage.clear();
        const mockStore = getMockStore({...notAuthenticatedState})
        const {result} = renderHook(()=> useAuthStore(),{
            wrapper: ({children})=><Provider store={mockStore}>{children}</Provider>
        });

        await act(async()=>{
          await result.current.startLogin(testUserCredentials);
        });

        const {errorMessage, status, user} = result.current;
        expect({errorMessage, status,user}).toEqual({
            errorMessage:undefined,
            status: 'authenticated',
            user:{ name: 'Test User', uid: '64c4368d0570a508feb1e08b' }
        });
        expect(localStorage.getItem('token')).toEqual(expect.any(String));
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String));
    });

});