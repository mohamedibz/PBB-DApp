import React, { useState } from "react";
import { useEthereum } from "../context/EthereumContext";

const Wallet = () => {
  const { connectWallet, disconnectWallet, account } = useEthereum();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await connectWallet();
    } catch (error) {
      console.error("Error al conectar la wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {account ? (
        <div className="bg-transparent text-white font-bold py-2 px-4 rounded">
          <p>Connected As: {account}</p>
          {/*<button onClick={disconnectWallet}>Cerrar sesión</button>*/}
        </div>
      ) : (
        <button className="bg-yellow-900 text-white font-bold py-2 px-4 rounded" onClick={handleLogin} disabled={loading}>
          {loading ? "Conectando..." : "Conectar Wallet"}
        </button>
      )}
    </div>
  );
};

export default Wallet;
