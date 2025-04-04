import React, { useState } from "react";

const VerificationCode = ({ onVerify }) => {
  const [code, setCode] = useState(new Array(6).fill(""));

  const handleChange = (value, index) => {
    if (isNaN(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to the next input if value is entered
    if (value && index < 5) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    const newCode = pasteData
      .split("")
      .map((char, i) => (!isNaN(char) ? char : code[i] || ""));
    setCode(newCode);

    // Focus the last filled input
    const lastFilledIndex = Math.min(pasteData.length, 6) - 1;
    if (lastFilledIndex >= 0) {
      document.getElementById(`code-input-${lastFilledIndex}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`code-input-${index - 1}`).focus();
    }
  };

  const handleSubmit = () => {
    onVerify(code.join(""));
  };

  return (
    <div className="grid grid-cols-[2fr_1fr]">
      <div
        className="flex justify-between h-10 gap-2"
        onPaste={handlePaste} // Added onPaste handler to the container
      >
        {code.map((digit, index) => (
          <input
            key={index}
            id={`code-input-${index}`}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="h-full w-1/6 text-center text-lg ring-1 ring-gray-400 focus:ring-2 focus:ring-blue-400 outline-none rounded-sm"
          />
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
      >
        Get code
      </button>
    </div>
  );
};

export default VerificationCode;
