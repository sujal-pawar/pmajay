// Debug file to check environment variables in production
export const debugConfig = {
  API_URL: import.meta.env.VITE_API_URL,
  NODE_ENV: import.meta.env.NODE_ENV,
  ALL_ENV_VARS: import.meta.env,
  EXPECTED_LOGIN_URL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/login`
};

// Function to log debug info to console
export const logDebugInfo = () => {
  console.log('=== DEBUG INFO ===');
  console.log('API_URL:', debugConfig.API_URL);
  console.log('Expected Login URL:', debugConfig.EXPECTED_LOGIN_URL);
  console.log('All Environment Variables:', debugConfig.ALL_ENV_VARS);
  console.log('==================');
};