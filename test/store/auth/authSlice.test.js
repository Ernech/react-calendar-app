import { authSlice } from "../../../src/auth/authSlice";
import { initialState } from "../../__fixtures/authStates";

describe('Test in authSlice', () => {

    test('should return initial state', () => {
          expect(authSlice.getInitialState()).toEqual(initialState)  
    });

});