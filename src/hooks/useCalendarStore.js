import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from "../store";
import {default as calendarApi} from "../api/calendarApi";
import { convertEventsToDateEvents } from "../helpers/convertEventsTodateEvents";

export const useCalendarStore = () => {

    const dispatch = useDispatch()
    const { events, activeEvent } = useSelector(state => state.calendar);
    const { user } = useSelector(state=>state.auth);

    const setActiveEvent = (calendarEvent) =>{
        dispatch(onSetActiveEvent(calendarEvent))
    }

    const startSavingEvent = async(calendarEvent)=>{
        //TODO: llegar al backend
        if(calendarEvent._id){
            //Actualizar evento
            dispatch(onUpdateEvent({...calendarEvent}))
        }
        else{
            //Crear evento
            const {data} = await calendarApi.post('/events', calendarEvent);
            
            dispatch(onAddNewEvent({...calendarEvent,id:data.event.id,user}));
        }
    }

    const startDeletingEvent = () =>{
        dispatch(onDeleteEvent());
    }

    const startLoadingEvents=async()=>{
        try {
            const {data} = await calendarApi.get('/events');
            const events= convertEventsToDateEvents(data.events);
            console.log(events);
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