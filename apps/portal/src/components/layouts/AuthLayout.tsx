import React from 'react';
import Logo from '../Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Background with Logo */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-500 to-blue-400 overflow-hidden">
        {/* Background Design Elements */}
        <div className="absolute top-0 right-0 w-100 h-100">
          {/* Top Right Corner Arcs */}
          <div className="absolute -top-40 -right-40 w-100 h-100">
            <div className="absolute top-0 right-0 w-74 h-74 bg-blue-300 rounded-full opacity-30"></div>
            <div className="absolute top-0 right-0 w-78 h-78 bg-blue-300 rounded-full opacity-20"></div>
            <div className="absolute top-0 right-0 w-84 h-84 bg-blue-300 rounded-full opacity-20"></div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-100 h-100">
          {/* Bottom Left Corner Arcs */}
          <div className="absolute -bottom-40 -left-40 w-100 h-100">
            <div className="absolute bottom-0 left-0 w-84 h-84 bg-blue-300 rounded-full opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-78 h-78 bg-blue-300 rounded-full opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-74 h-74 bg-blue-300 rounded-full opacity-20"></div>
          </div>
        </div>

        {/* Doctor Illustration and Logo */}
        <div className=" flex flex-col items-center justify-center w-full h-full">
          {/* Doctor Illustration */}
          <div className="mb-8">
            <Logo />
          </div>

          {/* Tagline */}
          <p className="text-white text-lg lg:text-xl text-center max-w-md ">
            Your health in good hands
          </p>
        </div>
      </div>
      {/* Right Side - Form Content */}
      <div className="flex-1 bg-gray-50 flex flex-col">
        {/* Main Content */}
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full lg:max-w-md bg-white rounded-lg shadow-xl border-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
