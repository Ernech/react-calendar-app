import { authSlice, clearErrorMessage, onLogin, onLogout } from "../../../src/auth/authSlice";
import { authenticatedState, initialState } from "../../__fixtures/authStates";
import { testUserCredentials } from "../../__fixtures/testUser";

describe('Test in authSlice', () => {

    test('should return initial state', () => {
          expect(authSlice.getInitialState()).toEqual(initialState)  
    });

    test('should preform login', () => {
        const state = authSlice.reducer(initialState,onLogin(testUserCredentials))
        expect(state).toEqual(  {
            status: 'authenticated',
            user: testUserCredentials,
            errorMessage: undefined
          })

    });

    test('should preform logout', () => {
        const state = authSlice.reducer(authenticatedState,onLogout());
        expect(state).toEqual({
            status:'not-authenticated',
            user:{},
            errorMessage: undefined
        });
    });

    test('should preform logout with error message', () => {
        const errorMessage= "Incorrect logout"
        const state = authSlice.reducer(authenticatedState,onLogout(errorMessage));
        expect(state).toEqual({
            status:'not-authenticated',
            user:{},
            errorMessage:errorMessage
        });
    });

    test('should clear error message', () => {
        const errorMessage= "Incorrect logout"
        const state = authSlice.reducer(authenticatedState,onLogout(errorMessage));
        const newState = authSlice.reducer(state, clearErrorMessage());
        expect(newState.errorMessage).toBe(undefined); 
    });

});