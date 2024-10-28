import React, { createContext, useState, useContext, useEffect } from "react";
import { BrowserProvider } from "ethers";
import PBBService from "../services/PBBService";

const EthereumContext = createContext();

export function useEthereum() {
  return useContext(EthereumContext);
}

export function EthereumProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [pbbService, setPbbService] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      console.error("MetaMask no está instalada.");
      return;
    }

    const [selectedAccount] = await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new BrowserProvider(window.ethereum);
    setProvider(provider);
    const signer = await provider.getSigner();
    setSigner(signer);
    setAccount(selectedAccount);
    setPbbService(new PBBService(provider, signer));
    sessionStorage.setItem("userAddress", selectedAccount);
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    sessionStorage.removeItem("userAddress");
  };

  useEffect(() => {
    const storedAccount = sessionStorage.getItem("userAddress");
    if (storedAccount) setAccount(storedAccount);

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          sessionStorage.setItem("userAddress", accounts[0]);
        } else {
          disconnectWallet(); // Ejecuta cierre de sesión si no hay cuentas activas
        }
      });
    }
  }, []);


  return (
    <EthereumContext.Provider value={{ provider, signer, account, connectWallet, disconnectWallet, pbbService }}>
      {children}
    </EthereumContext.Provider>
  );
}