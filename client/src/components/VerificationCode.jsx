import React, { useContext, useState } from "react";
import { useAuthstore } from "../store/Authstore";
import { Loader } from "lucide-react";
import { Globalstate } from "../contexts/Usecontext";

const VerificationCode = ({ userData }) => {
  const { cod, setcod } = useContext(Globalstate);
  const { signup, message, error, isLoading } = useAuthstore();
  const [code, setCode] = useState(new Array(6).fill(""));

  const handleChange = (value, index) => {
    if (isNaN(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setcod(newCode.join(""));

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
    setcod(newCode.join(""));

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(userData);
    } catch (err) {
      error && console.log(error);
      console.error("err", err);
    }
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
        disabled={cod}
        onClick={handleSubmit}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer flex justify-center items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader className="size-5 animate-spin" />
        ) : (
          <b>{message ? "Resend?" : "Get code"}</b>
        )}
      </button>
    </div>
  );
};

export default VerificationCode;
