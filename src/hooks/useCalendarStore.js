import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onLoadEvents, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from "../store";
import { default as calendarApi } from "../api/calendarApi";
import { convertEventsToDateEvents } from "../helpers/convertEventsTodateEvents";
import Swal from "sweetalert2";

export const useCalendarStore = () => {

    const dispatch = useDispatch()
    const { events, activeEvent } = useSelector(state => state.calendar);
    const { user } = useSelector(state => state.auth);

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent))
    }

    const startSavingEvent = async (calendarEvent) => {
        try {
            if (calendarEvent.id) {
                await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
                dispatch(onUpdateEvent({ ...calendarEvent, user }));
                return;
            }
            const { data } = await calendarApi.post('/events', calendarEvent);
            dispatch(onAddNewEvent({ ...calendarEvent, id: data.event.id, user }));

        } catch (error) {
            console.log(error);
            Swal.fire('There was an error while saving the event',error.response.data.msg,'error');
        }



    }

    const startDeletingEvent = async() => {
        try {
            if(activeEvent===null) return;
            await calendarApi.delete(`/events/${activeEvent.id}`);
            dispatch(onDeleteEvent());
            
        } catch (error) {
            console.log(error);
            Swal.fire('There was an error while saving the event',error.response.data.msg,'error');
        }
    }

    const startLoadingEvents = async () => {
        try {
            const { data } = await calendarApi.get('/events');
            const events = convertEventsToDateEvents(data.events);
            dispatch(onLoadEvents(events));
        } catch (error) {
            console.log(error);
        }
    }

    return {
        events,
        activeEvent,
        setActiveEvent,
        hasEventSelected: !!activeEvent,
        startSavingEvent,
        startDeletingEvent,
        startLoadingEvents
    }


}