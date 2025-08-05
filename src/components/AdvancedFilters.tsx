import React, { useState } from 'react';

interface AdvancedFiltersProps {
    onFiltersChange: (filters: FilterOptions) => void;
    maxPrice: number;
    maxDuration: number;
}

interface FilterOptions {
    maxPrice: number;
    maxDuration: number;
    directOnly: boolean;
    maxChanges: number;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ 
    onFiltersChange, 
    maxPrice, 
    maxDuration 
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({
        maxPrice: maxPrice,
        maxDuration: maxDuration,
        directOnly: false,
        maxChanges: 3
    });

    const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        onFiltersChange(updatedFilters);
    };

    const resetFilters = () => {
        const defaultFilters = {
            maxPrice: maxPrice,
            maxDuration: maxDuration,
            directOnly: false,
            maxChanges: 3
        };
        setFilters(defaultFilters);
        onFiltersChange(defaultFilters);
    };

    const containerStyle: React.CSSProperties = {
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '6px',
        marginBottom: '20px'
    };

    const headerStyle: React.CSSProperties = {
        padding: '15px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: isExpanded ? '1px solid #dee2e6' : 'none'
    };

    const contentStyle: React.CSSProperties = {
        padding: isExpanded ? '20px' : '0',
        maxHeight: isExpanded ? '300px' : '0',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
    };

    const filterRowStyle: React.CSSProperties = {
        display: 'flex',
        gap: '20px',
        marginBottom: '15px',
        flexWrap: 'wrap'
    };

    const filterItemStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '150px',
        flex: '1'
    };

    const labelStyle: React.CSSProperties = {
        marginBottom: '5px',
        fontWeight: 'bold',
        fontSize: '14px',
        color: '#495057'
    };

    const inputStyle: React.CSSProperties = {
        padding: '8px',
        border: '1px solid #ced4da',
        borderRadius: '4px',
        fontSize: '14px'
    };

    const buttonStyle: React.CSSProperties = {
        padding: '8px 16px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle} onClick={() => setIsExpanded(!isExpanded)}>
                <span style={{ fontWeight: 'bold', color: '#495057' }}>
                    🔧 Advanced Filters
                </span>
                <span style={{ fontSize: '18px' }}>
                    {isExpanded ? '▲' : '▼'}
                </span>
            </div>
            
            <div style={contentStyle}>
                <div style={filterRowStyle}>
                    <div style={filterItemStyle}>
                        <label style={labelStyle}>Max Price: €{filters.maxPrice}</label>
                        <input
                            type="range"
                            min="20"
                            max={maxPrice}
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange({ maxPrice: parseInt(e.target.value) })}
                            style={inputStyle}
                        />
                    </div>
                    
                    <div style={filterItemStyle}>
                        <label style={labelStyle}>Max Duration: {Math.floor(filters.maxDuration / 60)}h {filters.maxDuration % 60}m</label>
                        <input
                            type="range"
                            min="180"
                            max={maxDuration}
                            step="30"
                            value={filters.maxDuration}
                            onChange={(e) => handleFilterChange({ maxDuration: parseInt(e.target.value) })}
                            style={inputStyle}
                        />
                    </div>
                </div>
                
                <div style={filterRowStyle}>
                    <div style={filterItemStyle}>
                        <label style={labelStyle}>
                            <input
                                type="checkbox"
                                checked={filters.directOnly}
                                onChange={(e) => handleFilterChange({ directOnly: e.target.checked })}
                                style={{ marginRight: '8px' }}
                            />
                            Direct connections only
                        </label>
                    </div>
                    
                    <div style={filterItemStyle}>
                        <label style={labelStyle}>Max Changes:</label>
                        <select
                            value={filters.maxChanges}
                            onChange={(e) => handleFilterChange({ maxChanges: parseInt(e.target.value) })}
                            style={inputStyle}
                        >
                            <option value="0">Direct only</option>
                            <option value="1">Up to 1 change</option>
                            <option value="2">Up to 2 changes</option>
                            <option value="3">Up to 3 changes</option>
                        </select>
                    </div>
                    
                    <div style={filterItemStyle}>
                        <button onClick={resetFilters} style={buttonStyle}>
                            Reset Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvancedFilters;
