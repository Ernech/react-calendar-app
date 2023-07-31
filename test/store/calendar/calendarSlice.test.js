import { calendarSlice, onAddNewEvent, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice";
import { calendarWithEventsState, events, initialState } from "../../__fixtures/calendarStates";

describe('test in calendar slice', () => {
    
    test('should return initialState', () => {
        const state = calendarSlice.getInitialState();
        expect(state).toEqual(initialState);
    });

    test('onSetActiveEvent should activate an event', () => {
        const state = calendarSlice.reducer(calendarWithEventsState, onSetActiveEvent(events[0]));
        expect(state.activeEvent).toEqual(events[0]);
    });

    test('onAddNewEvent should add the new event',()=>{
        const newEvent = {
                _id: '3',
                title: 'Cumple sergio',
                notes: 'Comprar comida vegana',
                start: new Date('2023-08-06 12:00:00'),
                end: new Date('2023-08-06 20:00:00')
        }
        const state = calendarSlice.reducer(calendarWithEventsState,onAddNewEvent(newEvent))
        expect(state.events).toEqual([...events,newEvent]);
    })

    
    test('onUpdateEvent should update event',()=>{
        const updatedEvent = {
                _id: '1',
                title: 'Cumple sergio',
                notes: 'Comprar comida vegana',
                start: new Date('2023-08-06 12:00:00'),
                end: new Date('2023-08-06 20:00:00')
        }
        const state = calendarSlice.reducer(calendarWithEventsState,onUpdateEvent(updatedEvent))
        expect(state.events).toContain(updatedEvent);
    })


});