import React, { useState, useEffect } from 'react';
import { SearchParams } from '../types';

interface SearchFormProps {
    onSearch: (params: SearchParams) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
    const [tripType, setTripType] = useState<'one-way' | 'roundtrip'>('one-way');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [overnightStays, setOvernightStays] = useState<number | string>(1);

    // Calculate maximum overnight stays based on trip dates
    const getMaxOvernightStays = (): number => {
        if (tripType !== 'roundtrip' || !departureDate || !returnDate) return 30;

        const depDate = new Date(departureDate);
        const retDate = new Date(returnDate);
        const diffTime = retDate.getTime() - depDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Maximum overnight stays should be trip duration minus 1 (can't stay longer than the trip)
        return Math.max(1, diffDays - 1);
    };

    // Auto-adjust overnight stays when dates change
    useEffect(() => {
        if (tripType === 'roundtrip' && departureDate && returnDate) {
            const maxStays = getMaxOvernightStays();
            const currentStays = typeof overnightStays === 'number' ? overnightStays : parseInt(overnightStays) || 1;

            if (currentStays > maxStays) {
                setOvernightStays(maxStays);
            }
        }
    }, [departureDate, returnDate, tripType, overnightStays]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateInputs()) {
            onSearch({
                tripType,
                departureDate,
                returnDate: tripType === 'roundtrip' ? returnDate : undefined,
                overnightStays: tripType === 'roundtrip' ? (typeof overnightStays === 'number' ? overnightStays : parseInt(overnightStays) || 1) : undefined
            });
        }
    };

    const validateInputs = (): boolean => {
        if (!departureDate) {
            alert('Departure date is required');
            return false;
        }
        if (tripType === 'roundtrip' && !returnDate) {
            alert('Return date is required for round trips');
            return false;
        }

        // Validate overnight stays for roundtrip
        if (tripType === 'roundtrip' && departureDate && returnDate) {
            const maxStays = getMaxOvernightStays();
            const currentStays = typeof overnightStays === 'number' ? overnightStays : parseInt(overnightStays) || 1;

            if (currentStays > maxStays) {
                const tripDays = maxStays + 1;
                alert(`Overnight stays cannot exceed ${maxStays} for a ${tripDays}-day trip. Please adjust your dates or overnight stays.`);
                return false;
            }
        }

        return true;
    };

    const formStyle: React.CSSProperties = {
        backgroundColor: '#f8f9fa',
        padding: '30px',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        marginBottom: '30px'
    };

    const rowStyle: React.CSSProperties = {
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
        flexWrap: 'wrap'
    };

    const fieldStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '200px',
        flex: '1'
    };

    const labelStyle: React.CSSProperties = {
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#495057'
    };

    const inputStyle: React.CSSProperties = {
        padding: '10px',
        border: '1px solid #ced4da',
        borderRadius: '4px',
        fontSize: '16px'
    };

    const buttonStyle: React.CSSProperties = {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '12px 30px',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: 'bold'
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <div style={rowStyle}>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Trip Type:</label>
                    <select
                        value={tripType}
                        onChange={(e) => setTripType(e.target.value as 'one-way' | 'roundtrip')}
                        style={inputStyle}
                    >
                        <option value="one-way">🎯 One-way</option>
                        <option value="roundtrip">🔄 Roundtrip</option>
                    </select>
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>From:</label>
                    <input
                        type="text"
                        value="Hamburg, Germany 🇩🇪"
                        disabled
                        style={{...inputStyle, backgroundColor: '#e9ecef', color: '#6c757d'}}
                    />
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>To:</label>
                    <input
                        type="text"
                        value="Amsterdam, Netherlands 🇳🇱"
                        disabled
                        style={{...inputStyle, backgroundColor: '#e9ecef', color: '#6c757d'}}
                    />
                </div>
            </div>

            <div style={rowStyle}>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Departure Date:</label>
                    <input
                        type="date"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        style={inputStyle}
                    />
                </div>

                {tripType === 'roundtrip' && (
                    <div style={fieldStyle}>
                        <label style={labelStyle}>Return Date:</label>
                        <input
                            type="date"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            min={departureDate || new Date().toISOString().split('T')[0]}
                            style={inputStyle}
                        />
                    </div>
                )}

                {tripType === 'roundtrip' && (
                    <div style={fieldStyle}>
                        <label style={labelStyle}>
                            Overnight Stays:
                            {departureDate && returnDate && (
                                <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
                                    {' '}(max: {getMaxOvernightStays()})
                                </span>
                            )}
                        </label>
                        <input
                            type="number"
                            value={overnightStays}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '') {
                                    setOvernightStays('');
                                } else {
                                    const numValue = parseInt(value);
                                    const maxStays = getMaxOvernightStays();
                                    if (!isNaN(numValue) && numValue >= 1 && numValue <= maxStays) {
                                        setOvernightStays(numValue);
                                    }
                                }
                            }}
                            onBlur={(e) => {
                                const maxStays = getMaxOvernightStays();
                                const value = parseInt(e.target.value);
                                if (e.target.value === '' || value < 1) {
                                    setOvernightStays(1);
                                } else if (value > maxStays) {
                                    setOvernightStays(maxStays);
                                }
                            }}
                            min="1"
                            max={getMaxOvernightStays()}
                            placeholder="1"
                            style={inputStyle}
                            title={`Maximum overnight stays for your trip duration: ${getMaxOvernightStays()}`}
                        />
                    </div>
                )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button
                    type="submit"
                    style={buttonStyle}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                >
                    🔍 Search Trains
                </button>
            </div>
        </form>
    );
};

export default SearchForm;