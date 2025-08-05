import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchForm from '../SearchForm';
import { SearchParams } from '../../types';

describe('SearchForm', () => {
    const mockOnSearch = jest.fn();

    beforeEach(() => {
        mockOnSearch.mockClear();
    });

    it('renders all form elements', () => {
        render(<SearchForm onSearch={mockOnSearch} />);

        expect(screen.getByLabelText(/trip type/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/departure date/i)).toBeInTheDocument();
        expect(screen.getByText(/hamburg, germany/i)).toBeInTheDocument();
        expect(screen.getByText(/amsterdam, netherlands/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /search trains/i })).toBeInTheDocument();
    });

    it('shows return date field for roundtrip', () => {
        render(<SearchForm onSearch={mockOnSearch} />);

        const tripTypeSelect = screen.getByLabelText(/trip type/i);
        fireEvent.change(tripTypeSelect, { target: { value: 'roundtrip' } });

        expect(screen.getByLabelText(/return date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/overnight stays/i)).toBeInTheDocument();
    });

    it('hides return date field for one-way', () => {
        render(<SearchForm onSearch={mockOnSearch} />);

        const tripTypeSelect = screen.getByLabelText(/trip type/i);
        fireEvent.change(tripTypeSelect, { target: { value: 'one-way' } });

        expect(screen.queryByLabelText(/return date/i)).not.toBeInTheDocument();
        expect(screen.queryByLabelText(/overnight stays/i)).not.toBeInTheDocument();
    });

    it('validates required departure date', async () => {
        render(<SearchForm onSearch={mockOnSearch} />);

        const submitButton = screen.getByRole('button', { name: /search trains/i });
        fireEvent.click(submitButton);


        await waitFor(() => {
            expect(mockOnSearch).not.toHaveBeenCalled();
        });
    });

    it('submits form with valid one-way data', async () => {
        render(<SearchForm onSearch={mockOnSearch} />);

        const departureDate = screen.getByLabelText(/departure date/i);
        const submitButton = screen.getByRole('button', { name: /search trains/i });

        fireEvent.change(departureDate, { target: { value: '2025-08-15' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnSearch).toHaveBeenCalledWith({
                tripType: 'one-way',
                departureDate: '2025-08-15',
                returnDate: undefined,
                overnightStays: undefined
            });
        });
    });

    it('submits form with valid roundtrip data', async () => {
        render(<SearchForm onSearch={mockOnSearch} />);

        const tripTypeSelect = screen.getByLabelText(/trip type/i);
        const departureDate = screen.getByLabelText(/departure date/i);
        const submitButton = screen.getByRole('button', { name: /search trains/i });

        fireEvent.change(tripTypeSelect, { target: { value: 'roundtrip' } });
        fireEvent.change(departureDate, { target: { value: '2025-08-15' } });


        await waitFor(() => {
            expect(screen.getByLabelText(/return date/i)).toBeInTheDocument();
        });

        const returnDate = screen.getByLabelText(/return date/i);
        const overnightStays = screen.getByLabelText(/overnight stays/i);

        fireEvent.change(returnDate, { target: { value: '2025-08-17' } });
        fireEvent.change(overnightStays, { target: { value: '2' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnSearch).toHaveBeenCalledWith({
                tripType: 'roundtrip',
                departureDate: '2025-08-15',
                returnDate: '2025-08-17',
                overnightStays: 2
            });
        });
    });

    it('validates return date for roundtrip', async () => {

        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

        render(<SearchForm onSearch={mockOnSearch} />);

        const tripTypeSelect = screen.getByLabelText(/trip type/i);
        const departureDate = screen.getByLabelText(/departure date/i);
        const submitButton = screen.getByRole('button', { name: /search trains/i });

        fireEvent.change(tripTypeSelect, { target: { value: 'roundtrip' } });
        fireEvent.change(departureDate, { target: { value: '2025-08-15' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Return date is required for round trips');
            expect(mockOnSearch).not.toHaveBeenCalled();
        });

        alertSpy.mockRestore();
    });

    it('handles overnight stays input correctly', async () => {
        render(<SearchForm onSearch={mockOnSearch} />);

        const tripTypeSelect = screen.getByLabelText(/trip type/i);
        fireEvent.change(tripTypeSelect, { target: { value: 'roundtrip' } });

        await waitFor(() => {
            expect(screen.getByLabelText(/overnight stays/i)).toBeInTheDocument();
        });

        const overnightStays = screen.getByLabelText(/overnight stays/i);
        
        // Test valid number
        fireEvent.change(overnightStays, { target: { value: '3' } });
        expect(overnightStays).toHaveValue(3);

        // Test invalid input (should default to 1)
        fireEvent.change(overnightStays, { target: { value: 'invalid' } });
        expect(overnightStays).toHaveValue(1);
    });

    it('sets minimum date to today', () => {
        render(<SearchForm onSearch={mockOnSearch} />);

        const departureDate = screen.getByLabelText(/departure date/i);
        const today = new Date().toISOString().split('T')[0];
        
        expect(departureDate).toHaveAttribute('min', today);
    });

    it('sets return date minimum to departure date', async () => {
        render(<SearchForm onSearch={mockOnSearch} />);

        const tripTypeSelect = screen.getByLabelText(/trip type/i);
        const departureDate = screen.getByLabelText(/departure date/i);

        fireEvent.change(tripTypeSelect, { target: { value: 'roundtrip' } });
        fireEvent.change(departureDate, { target: { value: '2025-08-15' } });

        await waitFor(() => {
            const returnDate = screen.getByLabelText(/return date/i);
            expect(returnDate).toHaveAttribute('min', '2025-08-15');
        });
    });
});
