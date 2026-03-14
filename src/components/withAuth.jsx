import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const withAuth = (WrappedComponent, allowedRoles = []) => {
  return (props) => {
    const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
      const checkSession = async () => {
        try {
          const response = await fetch('/api/user');
          const data = await response.json();

          if (data.isLoggedIn) {
            // Check if the user's role is allowed
            const userRole = data.user?.role;
            if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
              setIsVerified(true);
            } else {
              // Role not authorized, redirect
              console.error('Access denied: User does not have the required role.');
              router.replace('/login');
            }
          } else {
            router.replace('/login');
          }
        } catch (error) {
            console.error('Session check failed', error);
            router.replace('/login');
        }
      };

      checkSession();
    }, [router]);

    if (isVerified) {
      return <WrappedComponent {...props} />;
    }

    // You can return a loading spinner or a blank page while checking the session.
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <p>Loading...</p>
        </div>
    ); // Or a loading spinner
  };
};

export default withAuth;