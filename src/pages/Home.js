import React, { useState, useEffect } from 'react';
import { useEthereum } from "../context/EthereumContext";
import { useNavigate } from 'react-router-dom';



function Home() {

  const { account } = useEthereum(); // Obtener el signer y provider desde el contexto
  const navigate = useNavigate();


  useEffect(() => {
    if (account)  navigate("/Create");  // Redirige al inicio si no hay cuenta conectada
  }, [account]);


  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col justify-between">

    {/* Hero Section */}
    <section className="flex flex-col items-center justify-center h-80 text-center px-6">
      <h2 className="text-4xl font-bold mb-4">Bienvenido a PBB</h2>
      <p className="text-lg text-gray-400 max-w-md">
        La plataforma de anuncios públicos descentralizada, transparente y segura.
      </p>
    </section>

    {/* Explanation Section */}
    <section className="py-12 bg-gray-800 text-center flex-grow">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
        <div className="p-8 bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-semibold mb-2">Transparencia Total</h3>
          <p className="text-gray-400">
            Todos los anuncios son públicos y auditables para todos los usuarios.
          </p>
        </div>
        <div className="p-8 bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-semibold mb-2">Seguridad Blockchain</h3>
          <p className="text-gray-400">
            La tecnología de Ethereum asegura que tu contenido es inmutable.
          </p>
        </div>
        <div className="p-8 bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-semibold mb-2">Control Propio</h3>
          <p className="text-gray-400">
            Tú decides quién puede acceder y participar en tus foros.
          </p>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="p-4 bg-gray-900 text-center">
      <p className="text-gray-400">© 2023 PBB - Todos los derechos reservados</p>
      <div className="flex justify-center space-x-4">
        <a href="#privacy" className="text-gray-400 hover:underline">Política de Privacidad</a>
        <a href="#terms" className="text-gray-400 hover:underline">Términos de Servicio</a>
        <a href="#contact" className="text-gray-400 hover:underline">Contacto</a>
      </div>
    </footer>
    </div>
  );
}

export default Home;
