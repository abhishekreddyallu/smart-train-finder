import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResultsTable from '../ResultsTable';
import { TrainConnection } from '../../types';

describe('ResultsTable', () => {
    const mockConnections: TrainConnection[] = [
        {
            duration: "5h 10m",
            price: 39,
            changes: 0,
            departure: "08:45",
            arrival: "13:55",
            trainType: "IC",
            carrier: "DB/NS"
        },
        {
            duration: "6h 05m",
            price: 29,
            changes: 1,
            departure: "07:00",
            arrival: "13:05",
            trainType: "IC + Sprinter",
            carrier: "DB/NS"
        },
        {
            duration: "7h 20m",
            price: 25,
            changes: 2,
            departure: "06:15",
            arrival: "13:35",
            trainType: "Regional + IC",
            carrier: "DB/NS"
        }
    ];

    it('renders empty state when no results', () => {
        render(<ResultsTable results={[]} />);
        
        expect(screen.getByText(/no train connections found/i)).toBeInTheDocument();
    });

    it('renders table with connections', () => {
        render(<ResultsTable results={mockConnections} />);
        

        expect(screen.getByText(/option/i)).toBeInTheDocument();
        expect(screen.getByText(/duration/i)).toBeInTheDocument();
        expect(screen.getByText(/price/i)).toBeInTheDocument();
        expect(screen.getByText(/changes/i)).toBeInTheDocument();
        expect(screen.getByText(/departure/i)).toBeInTheDocument();
        expect(screen.getByText(/arrival/i)).toBeInTheDocument();
        expect(screen.getByText(/train type/i)).toBeInTheDocument();
        expect(screen.getByText(/carrier/i)).toBeInTheDocument();
    });

    it('displays connection data correctly', () => {
        render(<ResultsTable results={mockConnections} />);
        

        expect(screen.getByText('#1')).toBeInTheDocument();
        expect(screen.getByText('5h 10m')).toBeInTheDocument();
        expect(screen.getByText('€39')).toBeInTheDocument();
        expect(screen.getByText('Direct')).toBeInTheDocument();
        expect(screen.getByText('08:45')).toBeInTheDocument();
        expect(screen.getByText('13:55')).toBeInTheDocument();
        expect(screen.getByText('IC')).toBeInTheDocument();
        expect(screen.getByText('DB/NS')).toBeInTheDocument();
    });

    it('shows "BEST" badge for first option', () => {
        render(<ResultsTable results={mockConnections} />);
        
        expect(screen.getByText('BEST')).toBeInTheDocument();
    });

    it('displays direct connections correctly', () => {
        render(<ResultsTable results={mockConnections} />);
        

        expect(screen.getByText('Direct')).toBeInTheDocument();
    });

    it('displays connections with changes correctly', () => {
        render(<ResultsTable results={mockConnections} />);
        

        expect(screen.getByText('1 change')).toBeInTheDocument();
        

        expect(screen.getByText('2 changes')).toBeInTheDocument();
    });

    it('shows station information', () => {
        render(<ResultsTable results={mockConnections} />);
        
        expect(screen.getAllByText('Hamburg Hbf')).toHaveLength(mockConnections.length);
        expect(screen.getAllByText('Amsterdam Centraal')).toHaveLength(mockConnections.length);
    });

    it('displays booking tip', () => {
        render(<ResultsTable results={mockConnections} />);
        
        expect(screen.getByText(/tip:/i)).toBeInTheDocument();
        expect(screen.getByText(/prices shown are estimates/i)).toBeInTheDocument();
    });

    it('handles single connection', () => {
        const singleConnection = [mockConnections[0]];
        render(<ResultsTable results={singleConnection} />);
        
        expect(screen.getByText('#1')).toBeInTheDocument();
        expect(screen.queryByText('#2')).not.toBeInTheDocument();
    });

    it('handles undefined results gracefully', () => {
        render(<ResultsTable results={undefined as any} />);
        
        expect(screen.getByText(/no train connections found/i)).toBeInTheDocument();
    });

    it('renders all connections in order', () => {
        render(<ResultsTable results={mockConnections} />);
        

        expect(screen.getByText('#1')).toBeInTheDocument();
        expect(screen.getByText('#2')).toBeInTheDocument();
        expect(screen.getByText('#3')).toBeInTheDocument();
    });

    it('formats prices correctly', () => {
        render(<ResultsTable results={mockConnections} />);
        

        expect(screen.getByText('€39')).toBeInTheDocument();
        expect(screen.getByText('€29')).toBeInTheDocument();
        expect(screen.getByText('€25')).toBeInTheDocument();
    });

    it('displays train types in badges', () => {
        render(<ResultsTable results={mockConnections} />);
        

        expect(screen.getByText('IC')).toBeInTheDocument();
        expect(screen.getByText('IC + Sprinter')).toBeInTheDocument();
        expect(screen.getByText('Regional + IC')).toBeInTheDocument();
    });

    it('shows carriers correctly', () => {
        render(<ResultsTable results={mockConnections} />);
        

        expect(screen.getAllByText('DB/NS')).toHaveLength(mockConnections.length);
    });

    it('handles edge case with zero price', () => {
        const connectionWithZeroPrice: TrainConnection[] = [{
            duration: "5h 10m",
            price: 0,
            changes: 0,
            departure: "08:45",
            arrival: "13:55",
            trainType: "IC",
            carrier: "DB/NS"
        }];
        
        render(<ResultsTable results={connectionWithZeroPrice} />);
        
        expect(screen.getByText('€0')).toBeInTheDocument();
    });

    it('handles very long train type names', () => {
        const connectionWithLongName: TrainConnection[] = [{
            duration: "5h 10m",
            price: 39,
            changes: 0,
            departure: "08:45",
            arrival: "13:55",
            trainType: "Very Long Train Type Name That Might Overflow",
            carrier: "DB/NS"
        }];
        
        render(<ResultsTable results={connectionWithLongName} />);
        
        expect(screen.getByText('Very Long Train Type Name That Might Overflow')).toBeInTheDocument();
    });
});
