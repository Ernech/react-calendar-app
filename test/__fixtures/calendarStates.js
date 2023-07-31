export const events = [
    {
        _id: '1',
        title: 'Colación',
        notes: 'Conseguir la toga',
        start: new Date('2023-07-31 15:00:00'),
        end: new Date('2023-07-31 18:00:00')
    },
    {
        _id: '2',
        title: 'Openheimer',
        notes: 'Ver Openheimer',
        start: new Date('2023-08-03 17:00:00'),
        end: new Date('2023-07-03 20:00:00')
    }
]

export const initialState = {
    isLoadingEvents:true,
    events:[],
    activeEvent:null
}


export const calendarWithEventsState = {
    isLoadingEvents:false,
    events:[...events],
    activeEvent:null
}


export const calendarWithActiveEventState = {
    isLoadingEvents:false,
    events:[...events],
    activeEvent:{...events[0]}
}