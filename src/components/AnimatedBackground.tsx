
import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.15]">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-r from-travel-400/20 to-travel-500/20 rounded-full blur-[100px] animate-subtle-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-r from-travel-300/20 to-travel-400/20 rounded-full blur-[100px] animate-subtle-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-gradient-to-r from-travel-400/10 to-travel-600/10 rounded-full blur-[100px] animate-subtle-float" style={{ animationDelay: '-4s' }} />
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MCA4MCI+PHBhdGggZD0iTTAgMGg4MHY4MEgweiIgZmlsbD0ibm9uZSIgLz48cGF0aCBkPSJNODAgODBIMFYwaDgwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlZWUiIHN0cm9rZS13aWR0aD0iLjUiIHN0cm9rZS1vcGFjaXR5PSIuMDUiIC8+PC9zdmc+')] opacity-20"></div>
    </div>
  );
};

export default AnimatedBackground;
