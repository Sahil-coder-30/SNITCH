import React, { useEffect } from 'react';

/**
 * ResetPassword is now consolidated into the ForgotPassword multi-step flow.
 * This component simply redirects any direct visitors to /forgot-password.
 */
const ResetPassword = () => {
  useEffect(() => {
    window.location.replace('/forgot-password');
  }, []);

  return null;
};

export default ResetPassword;
