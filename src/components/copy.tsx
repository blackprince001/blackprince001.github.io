"use client";

interface CopyProps {
  children: React.ReactNode;
  text: string;
}

export const Copy: React.FC<CopyProps> = ({ children, text }) => {
  const handleClick = () => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  return (
    <button className="link" onClick={handleClick}>
      {children}
    </button>
  );
};
