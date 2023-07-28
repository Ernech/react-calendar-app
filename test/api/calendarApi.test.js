import {default as calendarApi} from "../../src/api/calendarApi";

describe('Test at CalendarApi', () => {

    test('should have the default config', () => {
    
         expect(calendarApi.defaults.baseURL).toBe(process.env.VITE_API_URL);
    });

    test('should have x-token in the header of all requests', async() => {
        localStorage.setItem('token','ABC-123-XYZ');
        const res = await calendarApi.get('/auth') .then((res) => res)
        .catch((res) => res);
        expect(res.config.headers['x-token']).toBe('ABC-123-XYZ');
    });
});