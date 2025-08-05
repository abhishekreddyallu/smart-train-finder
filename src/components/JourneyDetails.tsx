import React, { useState } from 'react';
import { TrainConnection } from '../types';

interface JourneyDetailsProps {
    connection: TrainConnection;
    isReturn?: boolean;
}

const JourneyDetails: React.FC<JourneyDetailsProps> = ({ connection, isReturn = false }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const containerStyle: React.CSSProperties = {
        border: '1px solid #dee2e6',
        borderRadius: '6px',
        marginBottom: '10px',
        backgroundColor: 'white'
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
        maxHeight: isExpanded ? '400px' : '0',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
    };

    const routeStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '20px'
    };

    const stationStyle: React.CSSProperties = {
        textAlign: 'center',
        minWidth: '120px'
    };

    const timeStyle: React.CSSProperties = {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#007bff'
    };

    const stationNameStyle: React.CSSProperties = {
        fontSize: '14px',
        color: '#6c757d',
        marginTop: '5px'
    };

    const arrowStyle: React.CSSProperties = {
        fontSize: '24px',
        color: '#28a745'
    };

    const detailsGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '20px'
    };

    const detailItemStyle: React.CSSProperties = {
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px'
    };

    const getJourneySteps = () => {
        if (connection.changes === 0) {
            return [
                {
                    type: 'train',
                    from: isReturn ? 'Amsterdam Centraal' : 'Hamburg Hbf',
                    to: isReturn ? 'Hamburg Hbf' : 'Amsterdam Centraal',
                    departure: connection.departure,
                    arrival: connection.arrival,
                    trainType: connection.trainType,
                    carrier: connection.carrier
                }
            ];
        }

        const steps = [];
        const totalMinutes = parseDuration(connection.duration);
        const segmentDuration = Math.floor(totalMinutes / (connection.changes + 1));

        for (let i = 0; i <= connection.changes; i++) {
            const isFirst = i === 0;
            const isLast = i === connection.changes;
            
            steps.push({
                type: 'train',
                from: isFirst ? (isReturn ? 'Amsterdam Centraal' : 'Hamburg Hbf') : `Transfer Station ${i}`,
                to: isLast ? (isReturn ? 'Hamburg Hbf' : 'Amsterdam Centraal') : `Transfer Station ${i + 1}`,
                departure: isFirst ? connection.departure : `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
                arrival: isLast ? connection.arrival : `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
                trainType: i === 0 ? connection.trainType.split(' + ')[0] || connection.trainType : 'Regional',
                carrier: connection.carrier
            });

            if (!isLast) {
                steps.push({
                    type: 'transfer',
                    duration: '5-10 min',
                    station: `Transfer Station ${i + 1}`
                });
            }
        }

        return steps;
    };

    const parseDuration = (duration: string): number => {
        const match = duration.match(/(\d+)h\s*(\d+)m/);
        if (match) {
            const hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            return hours * 60 + minutes;
        }
        return 0;
    };

    const journeySteps = getJourneySteps();

    return (
        <div style={containerStyle}>
            <div style={headerStyle} onClick={() => setIsExpanded(!isExpanded)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={stationStyle}>
                        <div style={timeStyle}>{connection.departure}</div>
                        <div style={stationNameStyle}>
                            {isReturn ? 'Amsterdam' : 'Hamburg'}
                        </div>
                    </div>
                    
                    <div style={arrowStyle}>→</div>
                    
                    <div style={stationStyle}>
                        <div style={timeStyle}>{connection.arrival}</div>
                        <div style={stationNameStyle}>
                            {isReturn ? 'Hamburg' : 'Amsterdam'}
                        </div>
                    </div>
                    
                    <div style={{ marginLeft: '20px' }}>
                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                            {connection.duration}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6c757d' }}>
                            {connection.changes === 0 ? 'Direct' : `${connection.changes} change${connection.changes > 1 ? 's' : ''}`}
                        </div>
                    </div>
                    
                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#007bff' }}>
                            €{connection.price}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6c757d' }}>
                            {connection.trainType}
                        </div>
                    </div>
                </div>
                
                <span style={{ fontSize: '18px', marginLeft: '20px' }}>
                    {isExpanded ? '▲' : '▼'}
                </span>
            </div>
            
            <div style={contentStyle}>
                <h4 style={{ marginTop: '0', color: '#495057' }}>
                    🚆 Journey Details {isReturn ? '(Return)' : '(Outbound)'}
                </h4>
                
                <div style={detailsGridStyle}>
                    <div style={detailItemStyle}>
                        <strong>🕐 Total Duration</strong>
                        <div>{connection.duration}</div>
                    </div>
                    
                    <div style={detailItemStyle}>
                        <strong>💰 Price</strong>
                        <div>€{connection.price}</div>
                    </div>
                    
                    <div style={detailItemStyle}>
                        <strong>🔄 Changes</strong>
                        <div>{connection.changes === 0 ? 'Direct connection' : `${connection.changes} transfer${connection.changes > 1 ? 's' : ''}`}</div>
                    </div>
                    
                    <div style={detailItemStyle}>
                        <strong>🚆 Train Type</strong>
                        <div>{connection.trainType}</div>
                    </div>
                    
                    <div style={detailItemStyle}>
                        <strong>🏢 Operator</strong>
                        <div>{connection.carrier}</div>
                    </div>
                    
                    <div style={detailItemStyle}>
                        <strong>📍 Route</strong>
                        <div>
                            {isReturn ? 'Amsterdam → Hamburg' : 'Hamburg → Amsterdam'}
                        </div>
                    </div>
                </div>
                
                <div style={{ marginTop: '20px' }}>
                    <h5 style={{ color: '#495057' }}>🛤️ Journey Steps</h5>
                    {journeySteps.map((step, index) => (
                        <div key={index} style={{ 
                            padding: '10px', 
                            marginBottom: '10px',
                            backgroundColor: step.type === 'transfer' ? '#fff3cd' : '#d1ecf1',
                            borderRadius: '4px',
                            borderLeft: `4px solid ${step.type === 'transfer' ? '#ffc107' : '#007bff'}`
                        }}>
                            {step.type === 'train' ? (
                                <div>
                                    <strong>{step.trainType}</strong> - {step.carrier}
                                    <br />
                                    {step.from} → {step.to}
                                    <br />
                                    <small>{step.departure} - {step.arrival}</small>
                                </div>
                            ) : (
                                <div>
                                    <strong>🚶 Transfer at {step.station}</strong>
                                    <br />
                                    <small>Transfer time: {step.duration}</small>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                
                <div style={{ 
                    marginTop: '20px', 
                    padding: '15px', 
                    backgroundColor: '#e7f3ff', 
                    borderRadius: '6px',
                    fontSize: '14px'
                }}>
                    <strong>💡 Booking Tips:</strong>
                    <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                        <li>Book in advance for better prices</li>
                        <li>Consider flexible tickets for changes</li>
                        <li>Arrive at the station 15-30 minutes early</li>
                        <li>Check for any service disruptions before travel</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default JourneyDetails;
