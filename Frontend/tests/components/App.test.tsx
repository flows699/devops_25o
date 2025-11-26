import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';

describe('App Component', () => {

    it('should render the App with 100 EUR default value', () => {
        render(<App />);

        const amountInput = screen.getByTestId('amount-input');
        expect(amountInput).toHaveValue(100);

        const fromSelect = screen.getByTestId('from-select');
        expect(fromSelect).toHaveValue('EUR');
    });

    it('should render the App with correct title', () => {
        render(<App />);
        const titleElement = screen.getByText(/Valutaváltó/i);
        expect(titleElement).toBeInTheDocument();
    });

    it('should have a swap button', () => {
        render(<App />);
        const swapButton = screen.getByTestId('swap-button'); 
        expect(swapButton).toBeInTheDocument();
    });

    it('should swap currencies when swap button is clicked', async () => {
        const user = userEvent.setup();
        
        render(<App />);

        const fromSelect = screen.getByTestId('from-select');
        const toSelect = screen.getByTestId('to-select');
        const swapButton = screen.getByTestId('swap-button');

        expect(fromSelect).toHaveValue('EUR');
        expect(toSelect).toHaveValue('HUF');

        await user.click(swapButton);

        expect(fromSelect).toHaveValue('HUF');
        expect(toSelect).toHaveValue('EUR');
        
        expect(screen.getByTestId('amount-input')).toHaveValue(100);
    });
});