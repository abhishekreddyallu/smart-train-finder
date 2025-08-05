import '@testing-library/jest-dom';

global.alert = jest.fn();

global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
});
