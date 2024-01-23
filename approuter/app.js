const app = require('@sap/approuter');
const CircuitBreaker = require('opossum');
const axios = require('axios');
const axiosRetry = require('axios-retry').default;

// Configure axios retry for 3 retries
axiosRetry(axios, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    onRetry: (retryCount, error, requestConfig) => {
        console.log(`Retry attempt ${retryCount} for request: ${requestConfig.url}`);
    }
});


// Attach axiosRetry to axios with logging for retries
axiosRetry(axios, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    onRetry: (retryCount, error, requestConfig) => {
        console.log(`Retry attempt ${retryCount} for request: ${requestConfig.url}`);
    }
});

// Circuit Breaker options
const breakerOptions = {
    timeout: 2000, // Trigger a failure if a request takes longer than 5 seconds
    errorThresholdPercentage: 50, // Open circuit if 50% of requests fail
    resetTimeout: 30000 // Reset the circuit after 30 seconds
};

// Creating a Circuit Breaker for axios
const breaker = new CircuitBreaker(axios, breakerOptions);

// Fallback function for the Circuit Breaker
breaker.fallback(() => 'Service currently unavailable.');

const ar = app();

// Add beforeRequestHandler to forward requests
ar.beforeRequestHandler.use(async (req, res, next) => {
    try {
        const basePath = 'http://socmiddleware.socmiddleware.svc.cluster.local:8080';
        const path = req.path || ''; // Fallback to empty string if undefined
        const fullPath = basePath + (path.startsWith('/') ? '' : '/') + path;

        console.log('Full URL being called:', fullPath);

        const response = await breaker.fire({
            method: req.method,
            url: fullPath,
            headers: req.headers,
            params: req.query,
            data: req.body,
            timeout: 1000 // Setting a timeout for each request
        });

        console.log('Response from service:', response.data);
        next();
    } catch (error) {
        console.error('Error forwarding request:', error);
        next(error);
    }
});

ar.start();
