import { render, screen } from "@testing-library/react";
import { AppRouter } from "../../src/router/AppRouter";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { MemoryRouter } from "react-router-dom";
import { CalendarPage } from "../../src/calendar/pages/CalendarPage";

jest.mock("../../src/hooks/useAuthStore")
jest.mock("../../src/calendar/pages/CalendarPage",()=>({
    CalendarPage:()=><h1>CalendarPage</h1>
}))
describe('Test on <AppRouter/>', () => {

    const mockCheckAuthToken = jest.fn();
    beforeEach(() => jest.clearAllMocks());

    test('should show loading screen and call checkAuthToken', () => {
        useAuthStore.mockReturnValue({
            status: 'checking',
            checkAuthToken: mockCheckAuthToken
        })

        render(<AppRouter />)
        expect(screen.getByText('Loading...')).toBeTruthy()
        expect(mockCheckAuthToken).toHaveBeenCalled()
    });

    test('should show login in case the user is not authenticated', () => {
        useAuthStore.mockReturnValue({
            status: 'not-authenticated',
            checkAuthToken: mockCheckAuthToken
        })

       const {container} = render(
            <MemoryRouter>
                <AppRouter />
            </MemoryRouter>
        )

        expect(screen.getByText('Ingreso')).toBeTruthy();
        expect(container).toMatchSnapshot();
    });

    test('should show calendar page if the user is authenticated', () => {
        useAuthStore.mockReturnValue({
            status: 'authenticated',
            checkAuthToken: mockCheckAuthToken
        })

        render(
            <MemoryRouter>
                <AppRouter />
            </MemoryRouter>
        )
            screen.debug()
        expect(screen.getByText('CalendarPage')).toBeTruthy();
        
    });

});