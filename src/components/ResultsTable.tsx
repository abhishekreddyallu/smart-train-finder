import React from 'react';
import { TrainConnection } from '../types';

interface ResultsTableProps {
  results: TrainConnection[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        color: '#6c757d',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        🚫 No train connections found. Please try a different search.
      </div>
    );
  }

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '15px 10px',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '14px'
  };

  const cellStyle: React.CSSProperties = {
    padding: '15px 10px',
    borderBottom: '1px solid #dee2e6',
    fontSize: '14px'
  };

  const rowStyle: React.CSSProperties = {
    transition: 'background-color 0.2s'
  };

  const getBestValueBadge = (connection: TrainConnection, index: number) => {
    if (index === 0) {
      return <span style={{
        backgroundColor: '#28a745',
        color: 'white',
        padding: '2px 6px',
        borderRadius: '3px',
        fontSize: '10px',
        fontWeight: 'bold',
        marginLeft: '5px'
      }}>BEST</span>;
    }
    return null;
  };

  const getChangesDisplay = (changes: number) => {
    if (changes === 0) {
      return <span style={{ color: '#28a745', fontWeight: 'bold' }}>Direct</span>;
    }
    return <span style={{ color: '#ffc107' }}>{changes} change{changes > 1 ? 's' : ''}</span>;
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerStyle}>Option</th>
            <th style={headerStyle}>🕐 Duration</th>
            <th style={headerStyle}>💰 Price</th>
            <th style={headerStyle}>🔄 Changes</th>
            <th style={headerStyle}>🚀 Departure</th>
            <th style={headerStyle}>🏁 Arrival</th>
            <th style={headerStyle}>🚆 Train Type</th>
            <th style={headerStyle}>🏢 Carrier</th>
          </tr>
        </thead>
        <tbody>
          {results.map((connection, index) => (
            <tr
              key={index}
              style={rowStyle}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <td style={cellStyle}>
                <strong>#{index + 1}</strong>
                {getBestValueBadge(connection, index)}
              </td>
              <td style={cellStyle}>
                <strong>{connection.duration}</strong>
              </td>
              <td style={cellStyle}>
                <strong style={{ color: '#007bff' }}>€{connection.price}</strong>
              </td>
              <td style={cellStyle}>
                {getChangesDisplay(connection.changes)}
              </td>
              <td style={cellStyle}>
                <strong>{connection.departure}</strong>
                <br />
                <small style={{ color: '#6c757d' }}>Hamburg Hbf</small>
              </td>
              <td style={cellStyle}>
                <strong>{connection.arrival}</strong>
                <br />
                <small style={{ color: '#6c757d' }}>Amsterdam Centraal</small>
              </td>
              <td style={cellStyle}>
                <span style={{
                  backgroundColor: '#e9ecef',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  fontSize: '12px'
                }}>
                  {connection.trainType}
                </span>
              </td>
              <td style={cellStyle}>
                {connection.carrier}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#6c757d'
      }}>
        💡 <strong>Tip:</strong> Prices shown are estimates. Actual prices may vary based on booking time,
        availability, and fare conditions. Book early for the best deals!
      </div>
    </div>
  );
};

export default ResultsTable;