import React from "react";

const PasswordStrengthMeter = ({ password }) => {
  const checks = [
    { label: "Contains uppercase", regex: /[A-Z]/ },
    { label: "Contains lowercase", regex: /[a-z]/ },
    { label: "Contains number", regex: /[0-9]/ },
    { label: "Contains special character", regex: /[!@#$%^&*(),.?":{}|<>]/ },
    { label: "At least 6 characters", regex: /.{6,}/ },
  ];

  const validChecks = checks.filter((check) =>
    check.regex.test(password || "")
  ).length;

  const strengthLevels = [
    { label: "Weak", color: "bg-red-500", minValid: 1 },
    { label: "Fair", color: "bg-red-400", minValid: 3 },
    { label: "Good", color: "bg-yellow-500", minValid: 4 },
    { label: "Strong", color: "bg-green-500", minValid: 5 },
  ];

  const currentStrength =
    strengthLevels
      .slice()
      .reverse()
      .find((level) => validChecks >= level.minValid) || strengthLevels[0];

  const barColor = currentStrength.color;

  return (
    <div className="flex flex-col gap-1 mt-2">
      <div className="flex justify-between">
        <span>Password strength</span>
        <span
          className={`text-sm font-semibold ${currentStrength.color.replace(
            "bg-",
            "text-"
          )}`}
        >
          {currentStrength.label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {strengthLevels.map((level, index) => (
          <div
            key={index}
            className={`h-1 flex-1 ${
              validChecks >= level.minValid ? level.color : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>
      {checks.map((check, index) => {
        const isValid = check.regex.test(password || "");
        return (
          <div key={index} className="flex items-center gap-1">
            <span
              className={`text-sm ${
                isValid ? "text-green-500" : "text-gray-300"
              }`}
            >
              {isValid ? "✔" : "✖"} {check.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default PasswordStrengthMeter;
