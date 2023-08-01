import { renderHook } from "@testing-library/react";
import { useUiStore } from "../../src/hooks/useUiStore";
import { Provider } from "react-redux";
import { store, uiSlice } from "../../src/store";
import { configureStore } from "@reduxjs/toolkit";

const getMockStore = (initialState)=>{
    return configureStore({
        reducer:{
            ui:uiSlice.reducer
        },
        preloadedState:{
            ui: {...initialState}
        }
    })
}

describe('Test on useUiStore', () => {

    test('should return the default values', () => {

        const mockStore = getMockStore({isDateModalOpen:false})

        const { result }=renderHook(()=>useUiStore(), {
            wrapper: ({children})=> <Provider store={mockStore}>{children}</Provider>
           });
            expect(result.current).toEqual({
                    isDateModalOpen: false,
                    openDateModal: expect.any(Function),
                    closeDateModal: expect.any(Function)
            });
    });
});