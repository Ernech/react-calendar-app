import { addHours, differenceInSeconds } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useUiStore } from '../../hooks/useUiStore';
import { useCalendarStore } from '../../hooks/useCalendarStore';
import { getEnvVariables } from '../../helpers';

registerLocale('es',es);

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};


if(getEnvVariables().VITE_MODE !== 'test'){
    Modal.setAppElement('#root');
}


export const CalendarModal = () => {

    const {isDateModalOpen, closeDateModal} = useUiStore()

    const {activeEvent, startSavingEvent} = useCalendarStore();

    const [formSubmited, setFormSubmited] = useState(false)

    const [formValues, setFormValues] = useState({
        title:'Ernech',
        notes:'Vilela',
        start: new Date(),
        end: addHours(new Date(),2)
    });

    const titleClass = useMemo(() => {
        if(!formSubmited) return'';
        return (formValues.title.length>0) 
        ? 'is-valid'
        : 'is-invalid';
    }, [formValues.title, formSubmited]);
    
    useEffect(() => {
        if(activeEvent !==null){
            setFormValues({...activeEvent})
        }

    }, [activeEvent])
    

    const onInputChanged = ({target})=>{
        setFormValues({
            ...formValues,
            [target.name]:target.value
        })
    }

    const onCloseModal = () => {
        closeDateModal();
    }

    const onDateChange = (event,changing)=>{
        setFormValues({
            ...formValues,
            [changing]:event
        });
    }

    const onSubmitForm=async(event)=>{
        event.preventDefault();
        setFormSubmited(true);
        const diference = differenceInSeconds(formValues.end, formValues.start);
        if(isNaN(diference) || diference<=0){
            Swal.fire('Fechas incorrectas', 'Revizar fechas ingresadas.','error')
            return;
        }
        if(formValues.title.length<=0) return;
        console.log(formValues);
         startSavingEvent(formValues);
        closeDateModal();
        setFormSubmited(false);
    }

    return (
        <Modal
            isOpen={isDateModalOpen}
            onRequestClose={onCloseModal}
            style={customStyles}
            className="modal"
            overlayClassName="modal-fondo"
            closeTimeoutMS={250}
        >
            <h1> Nuevo evento </h1>
            <hr />
            <form className="container" onSubmit={onSubmitForm}>

                <div className="form-group mb-2">
                    <label>Fecha y hora inicio:</label>
                    &nbsp;
                    <DatePicker 
                        selected={formValues.start}
                        onChange={(event)=>onDateChange(event,'start')} 
                        className="form-control" 
                        dateFormat="Pp"
                        minDate={new Date()}
                        showTimeSelect
                        locale="es"
                        timeCaption="Hora"/>
                </div>

                <div className="form-group mb-2">
                    <label>Fecha y hora fin:</label>
                    &nbsp;
                    <DatePicker 
                        selected={formValues.end}
                        onChange={(event)=>onDateChange(event,'end')} 
                        className="form-control" 
                        dateFormat="Pp"
                        minDate={formValues.start}
                        showTimeSelect
                        locale="es"
                        timeCaption="Hora"/>
                </div>

                <hr />
                <div className="form-group mb-2">
                    <label>Titulo y notas</label>
                    <input
                        type="text"
                        className={`form-control ${titleClass}`}
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={formValues.title}
                        onChange={onInputChanged}
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group mb-2">
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={formValues.notes}
                        onChange={onInputChanged}
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>

            </form>
        </Modal>
    )
}
