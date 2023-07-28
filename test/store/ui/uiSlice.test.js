import { onCloseDateModal, onOpenDateModal, uiSlice } from "../../../src/store";


describe('Test in uiSlice', () => {

    test('Should return the defult state ', () => {
        //console.log(uiSlice.getInitialState());
        expect(uiSlice.getInitialState()).toEqual( { isDateModalOpen: false })
    });

    test("should change 'isDateModalOpen' correctly", () => {
        let state = uiSlice.getInitialState();
        state = uiSlice.reducer(state,onOpenDateModal());
        expect(state.isDateModalOpen).toBeTruthy()

        state = uiSlice.reducer(state,onCloseDateModal());
        expect(state.isDateModalOpen).toBeFalsy();

    });
})
