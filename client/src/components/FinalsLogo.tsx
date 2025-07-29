import React from "react";
import finals from "./finals.svg";

const FinalsLogo: React.FC<{ className?: string }> = ({ className }) => (
  <img src={finals} alt="SecureDrop.AI Logo" className={className || "w-8 h-8 mr-2"} />
);

export default FinalsLogo;
