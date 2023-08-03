import { useUiStore } from '../../hooks/useUiStore'
import { useCalendarStore } from '../../hooks/useCalendarStore';

export const FabDelete = () => {

  const { startDeletingEvent, hasEventSelected } = useCalendarStore()

  const handleDeleteEvent = () => {
    startDeletingEvent();
  }

  return (
    <button 
    aria-label="btn-delete"
    className="btn btn-danger fab-danger"
     onClick={handleDeleteEvent}
     style={{
      display: hasEventSelected ? '' :'none'
     }}
     >
      <i className="fas fa-trash-alt"></i>
    </button>
  )
}
