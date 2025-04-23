const isProduction = true;

export const baseApiUrl = isProduction
  ? "https://metube-ogcb.onrender.com"
  : "http://localhost:1000";
