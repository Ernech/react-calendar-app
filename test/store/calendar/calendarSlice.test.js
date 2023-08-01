import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice";
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from "../../__fixtures/calendarStates";

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

    test('onDeleteEvents should delete the active event ', () => {
        const state = calendarSlice.reducer(calendarWithActiveEventState,onDeleteEvent());
        expect(state.events).not.toContain(events[0]);
        expect(state.activeEvent).toBe(null);
    });

    test('onLoadEvents should set the events', () => {
        const state = calendarSlice.reducer(initialState, onLoadEvents(events));
        expect(state.isLoadingEvents).toBeFalsy();
        //expect(state.events).toEqual(events);

    });

    test('onLogoutCalendar should clear state', () => {
        const state = calendarSlice.reducer(calendarWithEventsState,onLogoutCalendar());
        expect(state).toEqual(initialState);
    });

});