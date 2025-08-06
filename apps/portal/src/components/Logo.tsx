const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center bg-white rounded-lg px-8">
      {/* Doctor Icon */}

      <svg
        className="w-48 h-16 md:w-56 md:h-20 lg:w-64 lg:h-24"
        viewBox="0 0 400 120"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background Circle */}
        <circle cx="60" cy="60" r="50" fill="#4A90E2" />

        {/* Medical Cross */}
        <rect x="45" y="35" width="30" height="8" rx="4" fill="#4A90E2" />
        <rect x="35" y="45" width="8" height="30" rx="4" fill="#4A90E2" />

        {/*  */}
        <g transform="translate(10,10)">
          <rect x="15" y="30" width="70" height="40" rx="5" fill="white" />
          <rect x="42" y="40" width="15" height="20" fill="#4A90E2" />
          <rect x="35" y="47" width="30" height="6" fill="#4A90E2" />
        </g>
        {/*  */}

        {/* Text "MedAgend" */}
        <text
          x="130"
          y="45"
          fontFamily="Arial, sans-serif"
          fontSize="48"
          fontWeight="bold"
          fill="#4A90E2"
        >
          Med
        </text>
        <text
          x="160"
          y="90"
          fontFamily="Arial, sans-serif"
          fontSize="48"
          fontWeight="bold"
          fill="#4A90E2"
        >
          Agend
        </text>

        {/* Decorative Elements */}
        <circle cx="320" cy="30" r="3" fill="#4A90E2" opacity="0.6" />
        <circle cx="340" cy="50" r="2" fill="#4A90E2" opacity="0.4" />
        <circle cx="350" cy="80" r="2.5" fill="#4A90E2" opacity="0.5" />
      </svg>
    </div>
  );
};

export default Logo;
