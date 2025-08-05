import React, { useState } from 'react';
import SearchForm from '../components/SearchForm';
import ResultsTable from '../components/ResultsTable';
import FilterBar from '../components/FilterBar';
import JourneyDetails from '../components/JourneyDetails';
import { TrainConnection, SearchParams } from '../types';
import { fetchTrainConnections, fetchReturnConnections } from '../api/trainApi';

type FilterType = 'fastest' | 'cheapest' | 'least-changes' | 'best-value';

const Home: React.FC = () => {
    const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
    const [results, setResults] = useState<TrainConnection[]>([]);
    const [returnResults, setReturnResults] = useState<TrainConnection[]>([]);
    const [filteredResults, setFilteredResults] = useState<TrainConnection[]>([]);
    const [filteredReturnResults, setFilteredReturnResults] = useState<TrainConnection[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [showDetailedView, setShowDetailedView] = useState(false);

    const handleSearch = async (params: SearchParams) => {
        setSearchParams(params);
        setIsLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            const connections = await fetchTrainConnections(params);
            setResults(connections);
            setFilteredResults(connections);

            if (params.tripType === 'roundtrip') {
                const returnConnections = await fetchReturnConnections(params);
                setReturnResults(returnConnections);
                setFilteredReturnResults(returnConnections);
            } else {
                setReturnResults([]);
                setFilteredReturnResults([]);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            setResults([]);
            setFilteredResults([]);
            setReturnResults([]);
            setFilteredReturnResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (filter: FilterType) => {
        if (!results.length) return;

        const sortFunction = (a: TrainConnection, b: TrainConnection) => {
            switch (filter) {
                case 'fastest':
                    const aDuration = parseDuration(a.duration);
                    const bDuration = parseDuration(b.duration);
                    return aDuration - bDuration;
                case 'cheapest':
                    return a.price - b.price;
                case 'least-changes':
                    if (a.changes !== b.changes) {
                        return a.changes - b.changes;
                    }
                    return parseDuration(a.duration) - parseDuration(b.duration);
                case 'best-value':
                    const aDurationHours = parseDuration(a.duration) / 60;
                    const bDurationHours = parseDuration(b.duration) / 60;
                    const aValueScore = (a.price / aDurationHours) + (a.changes * 5);
                    const bValueScore = (b.price / bDurationHours) + (b.changes * 5);
                    return aValueScore - bValueScore;
                default:
                    return 0;
            }
        };

        const sortedResults = [...results].sort(sortFunction);
        setFilteredResults(sortedResults);

        if (returnResults.length > 0) {
            const sortedReturnResults = [...returnResults].sort(sortFunction);
            setFilteredReturnResults(sortedReturnResults);
        }
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

    return (
        <div style={{
            padding: '20px',
            maxWidth: '1200px',
            margin: '0 auto',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            minHeight: 'calc(100vh - 40px)'
        }}>
            <header style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    margin: '0 0 10px 0',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    🚄 Smart Train Finder
                </h1>
                <p style={{
                    fontSize: '18px',
                    color: '#666',
                    margin: '0 0 10px 0'
                }}>
                    Find the best train connections between Hamburg and Amsterdam
                </p>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '30px',
                    fontSize: '14px',
                    color: '#888',
                    flexWrap: 'wrap'
                }}>
                    <span>⚡ Fast & Reliable</span>
                    <span>💰 Best Prices</span>
                    <span>🔄 Real-time Updates</span>
                </div>
            </header>

            <SearchForm onSearch={handleSearch} />

            {isLoading && (
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    fontSize: '18px',
                    color: '#007bff'
                }}>
                    🔍 Searching for train connections...
                </div>
            )}

            {error && (
                <div style={{
                    color: '#dc3545',
                    backgroundColor: '#f8d7da',
                    border: '1px solid #f5c6cb',
                    borderRadius: '4px',
                    padding: '12px',
                    margin: '20px 0'
                }}>
                    ❌ Error: {error}
                </div>
            )}

            {hasSearched && !isLoading && !error && filteredResults.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#6c757d'
                }}>
                    No train connections found for your search criteria. Please try different dates or options.
                </div>
            )}

            {filteredResults.length > 0 && (
                <>
                    <div style={{ margin: '30px 0 20px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2>🚆 Available Connections</h2>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => setShowDetailedView(!showDetailedView)}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: showDetailedView ? '#28a745' : '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    {showDetailedView ? '📋 Table View' : '📖 Detailed View'}
                                </button>
                            </div>
                        </div>
                        <FilterBar
                            onFilterChange={handleFilterChange}
                            resultCount={filteredResults.length}
                        />
                    </div>

                    {searchParams?.tripType === 'roundtrip' && filteredReturnResults.length > 0 ? (
                        <div>
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ color: '#007bff', marginBottom: '15px' }}>
                                    🚀 Outbound Journey: Hamburg → Amsterdam
                                </h3>
                                {showDetailedView ? (
                                    <div>
                                        {filteredResults.map((connection, index) => (
                                            <JourneyDetails key={index} connection={connection} />
                                        ))}
                                    </div>
                                ) : (
                                    <ResultsTable results={filteredResults} />
                                )}
                            </div>

                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ color: '#28a745', marginBottom: '15px' }}>
                                    🏠 Return Journey: Amsterdam → Hamburg
                                </h3>
                                {showDetailedView ? (
                                    <div>
                                        {filteredReturnResults.map((connection, index) => (
                                            <JourneyDetails key={index} connection={connection} isReturn={true} />
                                        ))}
                                    </div>
                                ) : (
                                    <ResultsTable results={filteredReturnResults} />
                                )}
                            </div>

                            <div style={{
                                backgroundColor: '#e7f3ff',
                                padding: '20px',
                                borderRadius: '8px',
                                border: '1px solid #b3d9ff',
                                marginBottom: '20px'
                            }}>
                                <h4 style={{ margin: '0 0 15px 0', color: '#0056b3' }}>
                                    💡 Roundtrip Summary
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                                    <div>
                                        <strong>Cheapest Combination:</strong>
                                        <br />
                                        €{Math.min(...filteredResults.map(r => r.price)) + Math.min(...filteredReturnResults.map(r => r.price))}
                                    </div>
                                    <div>
                                        <strong>Fastest Combination:</strong>
                                        <br />
                                        {(() => {
                                            const fastestOut = filteredResults.reduce((prev, curr) =>
                                                parseDuration(prev.duration) < parseDuration(curr.duration) ? prev : curr
                                            );
                                            const fastestReturn = filteredReturnResults.reduce((prev, curr) =>
                                                parseDuration(prev.duration) < parseDuration(curr.duration) ? prev : curr
                                            );
                                            const totalMinutes = parseDuration(fastestOut.duration) + parseDuration(fastestReturn.duration);
                                            return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
                                        })()}
                                    </div>
                                    <div>
                                        <strong>Overnight Stays:</strong>
                                        <br />
                                        {searchParams?.overnightStays || 1} night{(searchParams?.overnightStays || 1) > 1 ? 's' : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3 style={{ color: '#007bff', marginBottom: '15px' }}>
                                🚀 One-way Journey: Hamburg → Amsterdam
                            </h3>
                            {showDetailedView ? (
                                <div>
                                    {filteredResults.map((connection, index) => (
                                        <JourneyDetails key={index} connection={connection} />
                                    ))}
                                </div>
                            ) : (
                                <ResultsTable results={filteredResults} />
                            )}
                        </div>
                    )}
                </>
            )}

            <footer style={{
                marginTop: '50px',
                paddingTop: '30px',
                borderTop: '1px solid #dee2e6',
                textAlign: 'center',
                color: '#6c757d',
                fontSize: '14px'
            }}>
                <div style={{ marginBottom: '15px' }}>
                    <strong>🚄 Smart Train Finder</strong> - Your gateway to seamless European rail travel
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    flexWrap: 'wrap',
                    marginBottom: '15px'
                }}>
                    <span>🌍 Hamburg ⇄ Amsterdam</span>
                    <span>📱 Mobile Friendly</span>
                    <span>🔒 Secure Booking</span>
                </div>
                <div style={{ fontSize: '12px', color: '#adb5bd' }}>
                    Built with ❤️ for travelers • Data powered by European rail networks
                    <br />
                    © 2025 Smart Train Finder. Prices and schedules subject to change.
                </div>
            </footer>
        </div>
    );
};

export default Home;