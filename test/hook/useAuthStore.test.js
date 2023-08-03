import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../../src/auth/authSlice";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { initialState, notAuthenticatedState } from "../__fixtures/authStates";
import { act } from "react-dom/test-utils";
import { testUserCredentials } from "../__fixtures/testUser";
import { calendarApi } from "../../src/api";

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
    
    beforeEach(()=>localStorage.clear());

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

    test('startLogin should fail authentication', async() => {
        const mockStore = getMockStore({...notAuthenticatedState})
        const {result} = renderHook(()=> useAuthStore(),{
            wrapper: ({children})=><Provider store={mockStore}>{children}</Provider>
        });
        
        await act(async()=>{
            await result.current.startLogin({user:'some@google.com', password:'7894695'});
          });
          
          const { status , user, errorMessage} = result.current;
          expect({status , user, errorMessage}).toEqual({ status: 'not-authenticated',
          user: {},
          errorMessage: 'Wrong credentials',})
          expect(localStorage.getItem('token')).toBe(null);
          expect(localStorage.getItem('token-init-date')).toBe(null);
          await waitFor(
            ()=>expect(result.current.errorMessage).toBe(undefined)
          );
        });

    test('startRegister should register a new user', async() => {
        const mockStore = getMockStore({...notAuthenticatedState})
        const {result} = renderHook(()=> useAuthStore(),{
            wrapper: ({children})=><Provider store={mockStore}>{children}</Provider>
        });
        
        const spy = jest.spyOn(calendarApi,'post').mockReturnValue({
            data:{
                ok:true,
                uid:"s4a5dasd515",
                name:'Test 2',
                token:"ANY-TOKEN"
            }
        });

        await act(async()=>{
            await result.current.startRegiter({email:'test2@google.com', password:'9876xyz',name:'Test 2'});
          });

        const {status, errorMessage, user} = result.current;
        expect({status,errorMessage,user}).toEqual({
            status: 'authenticated',
            user: { name: 'Test 2', uid: 's4a5dasd515' },
            errorMessage: undefined,
        });

        spy.mockRestore()
    });

    test('startRegister should fail in creation ', async() => {
        const mockStore = getMockStore({...notAuthenticatedState})
        const {result} = renderHook(()=> useAuthStore(),{
            wrapper: ({children})=><Provider store={mockStore}>{children}</Provider>
        });
        await act(async()=>{
            await result.current.startRegiter(testUserCredentials);
          });

        const {status, errorMessage, user} = result.current;
        expect({status,errorMessage,user}).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: "There's already a unser with the email test@gmail.com in the DB",
        });

    });

    test('checkAuthToken should fail if there is no token', async() => {
        const mockStore = getMockStore({...initialState})
        const {result} = renderHook(()=> useAuthStore(),{
            wrapper: ({children})=><Provider store={mockStore}>{children}</Provider>
        });
        await act(async()=>{
            await result.current.checkAuthToken();
          });
          const {status, errorMessage, user} = result.current;
          expect({status, errorMessage, user}).toEqual({
            status:'not-authenticated', 
            errorMessage:undefined, 
            user:{}
          });
    });

    test('checkAuthToken should authenticate user if there is a token', async() => {
        const {data} = await calendarApi.post('/auth',testUserCredentials);
        localStorage.setItem('token', data.token);
        const mockStore = getMockStore({...initialState})
        const {result} = renderHook(()=> useAuthStore(),{
            wrapper: ({children})=><Provider store={mockStore}>{children}</Provider>
        });
        await act(async()=>{
            await result.current.checkAuthToken();
          });
          console.log(result.current);
          const {status, errorMessage, user} = result.current;
            expect({status, errorMessage, user}).toEqual({
                status: 'authenticated',
                user: { name: 'Test User', uid: '64c4368d0570a508feb1e08b' },
                errorMessage: undefined,
          });
    });

});