import React from "react";

const PasswordStrengthBar = ({ strengthColor }) => {
  const strengthLabels = {
    red: "Weak password",
    orange: "Medium password",
    green: "Strong password",
  };

  const strengthLabel =
    strengthLabels[strengthColor.toLowerCase()] || "Unknown";

  return (
    <div>
      <div className={`w-full h-1 bg-${strengthColor}-500 rounded-full mt-1`} />
      <p className={`text-sm  flex justify-center text-${strengthColor}-500 mt-2`}>{strengthLabel}</p>
    </div>
  );
};

export default PasswordStrengthBar;
