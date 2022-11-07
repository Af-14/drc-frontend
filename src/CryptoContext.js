import React, { createContext, useContext, useState, useEffect } from "react";

const Crypto = createContext();

function CryptoContext({ children }) {
  const [currency, setCurrency] = useState("USD");
  const [symbol, setSymbol] = useState("$");

  useEffect(() => {
    if (currency === "MYR") setSymbol("MYR");
    else if (currency === "USD") setSymbol("USD");
  }, [currency]);

  return (
    <Crypto.Provider value={{ currency, symbol, setCurrency }}>
      {children}
    </Crypto.Provider>
  );
}

export default CryptoContext;

export const CryptoState = () => {
  return useContext(Crypto);
};
