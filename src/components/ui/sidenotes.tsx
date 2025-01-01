import React from 'react';

interface SidenoteProps {
  children: React.ReactNode;
  number?: number;
}

const Sidenote: React.FC<SidenoteProps> = ({ children, number }) => {
  return (
    <span className="sidenote-wrapper inline-block relative">
      <span className="sidenote-number align-super text-sm cursor-pointer text-gray-500">
        {number || '*'}
      </span>
      <span className="sidenote hidden lg:block absolute left-full top text-sm text-gray-400 transform">
        {children}
      </span>
      <span className="sidenote-mobile lg:hidden text-sm text-gray-400 inline-block ml-1">
        ({children})
      </span>
    </span>
  );
};

// Counter for automatic sidenote numbering
let sidenoteCounter = 0;

export const resetSidenoteCounter = () => {
  sidenoteCounter = 0;
};

export const AutoNumberedSidenote: React.FC<Omit<SidenoteProps, 'number'>> = ({ children }) => {
  sidenoteCounter += 1;
  return <Sidenote number={sidenoteCounter}>{children}</Sidenote>;
};

export default Sidenote;