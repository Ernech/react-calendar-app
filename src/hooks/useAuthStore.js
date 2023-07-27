import { useDispatch, useSelector } from 'react-redux'
import { calendarApi } from '../api';
import { onChecking, onLogin, onLogout, clearErrorMessage } from '../auth/authSlice';
import { onLogoutCalendar } from '../store';

export const useAuthStore = ()=>{

    const { status, user, errorMessage } =  useSelector(state=>state.auth);
    const dispatch = useDispatch();

    const startLogin = async({email,password})=>{
        dispatch(onChecking())
        try {
            const {data} = await calendarApi.post('/auth',
            {email,password});
            localStorage.setItem('token',data.token);
            localStorage.setItem('token-init-date',new Date().getDate());
            dispatch(onLogin({name:data.name,uid:data.uid}))
        } catch (error) {
            console.log(error);
            dispatch(onLogout('Wrong credentials'));
            setTimeout(()=>{
                dispatch(clearErrorMessage())},10);
        }
    }

    const startRegiter =async({name,email,password})=>{
        dispatch(onChecking())

        try {
            const {data} = await calendarApi.post('/auth/new',{name,email,password});
            localStorage.setItem('token',data.token);
            localStorage.setItem('token-init-date',new Date().getDate());
            dispatch(onLogin({name:data.name,uid:data.uid}))
        } catch (error) {
            console.log({error});
            dispatch(onLogout(error.response.data.msg));
            setTimeout(()=>{
                dispatch(clearErrorMessage())
            },10)
            
        }
    }

    const checkAuthToken = async()=>{
        const token = localStorage.getItem('token');
        if(!token) return dispatch(onLogout());

        try {
            const {data} =await calendarApi.get('auth/renew');
            localStorage.setItem('token',data.token);
            localStorage.setItem('token-init-date',new Date().getDate());
            dispatch(onLogin({name:data.name,uid:data.uid}))
        } catch (error) {
            localStorage.clear();
            dispatch(onLogout());
        }
    }

    const startLogout = ()=>{
        localStorage.clear()
        dispatch(onLogout());
        dispatch(onLogoutCalendar());
    }

    return {
        //Propertires
        status,
        user,
        errorMessage,
        // Methods
        startLogin,
        startRegiter,
        checkAuthToken,
        startLogout
    }
}