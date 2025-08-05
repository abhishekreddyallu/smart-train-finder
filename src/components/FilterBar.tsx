import React, { useState } from 'react';

type FilterType = 'fastest' | 'cheapest' | 'least-changes' | 'best-value';

interface FilterBarProps {
    onFilterChange: (filter: FilterType) => void;
    resultCount?: number;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, resultCount = 0 }) => {
    const [selectedFilter, setSelectedFilter] = useState<FilterType>('fastest');

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value as FilterType;
        setSelectedFilter(value);
        onFilterChange(value);
    };

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '15px',
        padding: '15px',
        backgroundColor: '#ffffff',
        border: '1px solid #dee2e6',
        borderRadius: '6px',
        marginBottom: '20px',
        flexWrap: 'wrap'
    };

    const leftSectionStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    };

    const labelStyle: React.CSSProperties = {
        fontWeight: 'bold',
        color: '#495057',
        fontSize: '16px'
    };

    const selectStyle: React.CSSProperties = {
        padding: '8px 12px',
        border: '1px solid #ced4da',
        borderRadius: '4px',
        fontSize: '14px',
        backgroundColor: 'white',
        cursor: 'pointer',
        minWidth: '180px'
    };

    const resultCountStyle: React.CSSProperties = {
        fontSize: '14px',
        color: '#6c757d',
        fontWeight: 'normal'
    };

    const getFilterDescription = (filter: FilterType): string => {
        switch (filter) {
            case 'fastest':
                return 'Sorted by shortest travel time';
            case 'cheapest':
                return 'Sorted by lowest price';
            case 'least-changes':
                return 'Sorted by fewest transfers';
            case 'best-value':
                return 'Sorted by best price-to-time ratio';
            default:
                return '';
        }
    };

    return (
        <div style={containerStyle}>
            <div style={leftSectionStyle}>
                <label htmlFor="filter" style={labelStyle}>
                    📊 Sort by:
                </label>
                <select
                    id="filter"
                    value={selectedFilter}
                    onChange={handleFilterChange}
                    style={selectStyle}
                >
                    <option value="fastest">⚡ Fastest Journey</option>
                    <option value="cheapest">💰 Cheapest Price</option>
                    <option value="least-changes">🔄 Fewest Changes</option>
                    <option value="best-value">🎯 Best Value</option>
                </select>
            </div>

            <div style={resultCountStyle}>
                {resultCount > 0 && (
                    <>
                        <strong>{resultCount}</strong> connection{resultCount !== 1 ? 's' : ''} found
                        <br />
                        <small>{getFilterDescription(selectedFilter)}</small>
                    </>
                )}
            </div>
        </div>
    );
};

export default FilterBar;