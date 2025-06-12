import { errorHandler } from './error-handler';

async function testErrorHandler() {
  try {
    console.log('Testing Error Handler...');

    // Test network error
    console.log('\nTesting Network Error:');
    const networkError = new Error('Failed to connect to the network');
    errorHandler.handleError(networkError);

    // Test auth error
    console.log('\nTesting Auth Error:');
    const authError = new Error('User is not authorized');
    errorHandler.handleError(authError);

    // Test validation error
    console.log('\nTesting Validation Error:');
    const validationError = new Error('Invalid input data');
    errorHandler.handleError(validationError);

    // Test API error
    console.log('\nTesting API Error:');
    const apiError = new Error('API endpoint not found');
    errorHandler.handleError(apiError);

    // Test database error
    console.log('\nTesting Database Error:');
    const dbError = new Error('Database connection failed');
    errorHandler.handleError(dbError);

    // Test unknown error
    console.log('\nTesting Unknown Error:');
    const unknownError = new Error('Something unexpected happened');
    errorHandler.handleError(unknownError);

    // Test error with details
    console.log('\nTesting Error with Details:');
    const detailedError = {
      message: 'Complex error occurred',
      details: {
        code: 'ERR_001',
        stack: 'Error stack trace...',
        context: {
          userId: '123',
          action: 'update',
        },
      },
    };
    errorHandler.handleError(detailedError);

    // Get error log
    console.log('\nError Log:');
    const errorLog = errorHandler.getErrorLog();
    console.log(JSON.stringify(errorLog, null, 2));

    // Clear error log
    errorHandler.clearErrorLog();
    console.log('\nError log cleared');

    console.log('\nAll error handler tests completed successfully!');
  } catch (error) {
    console.error('Error testing error handler:', error);
  }
}

// Run the tests
testErrorHandler();
