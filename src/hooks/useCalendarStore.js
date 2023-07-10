import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from "../store";

export const useCalendarStore = () => {

    const dispatch = useDispatch()

    const { events, activeEvent } = useSelector(state => state.calendar);

    const setActiveEvent = (calendarEvent) =>{
        dispatch(onSetActiveEvent(calendarEvent))
    }

    const startSavingEvent = (calendarEvent)=>{
        //TODO: llegar al backend
        if(calendarEvent._id){
            //Actualizar evento
            dispatch(onUpdateEvent({...calendarEvent}))
        }
        else{
            //Crear evento
            dispatch(onAddNewEvent({...calendarEvent,_id:new Date().getTime()}));
        }
    }

    const startDeletingEvent = () =>{
        dispatch(onDeleteEvent());
    }

    return {
        events,
        activeEvent,
        setActiveEvent,
        hasEventSelected: !!activeEvent,
        startSavingEvent,
        startDeletingEvent
    }


}