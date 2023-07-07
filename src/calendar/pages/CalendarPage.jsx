import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getMessagesES, localizer } from '../../helpers';
import { Navbar, CalendarEvent, CalendarModal } from "../components"
import { useState } from 'react';
import { useUiStore } from '../../hooks/useUiStore';
import { useCalendarStore } from '../../hooks/useCalendarStore';


export const CalendarPage = () => {

  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || "week");
  const { openDateModal } = useUiStore();
  const { events, setActiveEvent }=useCalendarStore();
  const eventStyleGetter = (event,start,end, isSelected)=>{
      
      const style = {
        backGroundColor:'#347CF7',
        borderRadius: '0px',
        opacity:0.8,
        color:'white'
      }

      return {style}
  }

const onDoubleClick = (event)=>{
  //console.log({doubleCLick:event});
  openDateModal();
}

const onSelect = (event)=>{
  setActiveEvent(event)
}

const onViewChanged = (event)=>{
localStorage.setItem('lastView',event);
setLastView(event);
}

  return (
    <>
      <Navbar />
      <Calendar
        culture='es'
        localizer={localizer}
        events={events}
        defaultView={lastView}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh-80px)' }}
        messages={getMessagesES()}
        eventPropGetter={eventStyleGetter}
        components={{event:CalendarEvent}}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChanged}
      />
      <CalendarModal/>
    </>
  )
}
