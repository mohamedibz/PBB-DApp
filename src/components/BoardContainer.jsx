import React, { useState, useEffect } from 'react';
import { createHash } from "crypto-browserify";


const PBBContainer = ({ 
  pbbData, 
  handleShowForm, 
  selectBoard, 
  setBoardName, 
  handleNextPage, 
  handlePreviousPage, 
  currentPage, 
  totalPages,
  onSearch,
  handleFilterChange,
  filterChange,
}) => {

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('name');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBoardId, setSelectedBoardId] = useState(null); // Estado para el ID seleccionado


  function generateShortSHA256(address) {
    const hash = createHash('sha256');
    hash.update(address.toLowerCase());
    return hash.digest('hex').slice(0, 16);  // Devuelve los primeros 16 caracteres
  }


  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [pbbData]);

  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('en-GB') + ' ' + date.toLocaleTimeString('en-GB');
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  const handleBoardClick = (pbb) => {
    setSelectedBoardId(pbb.id); // Marcar como seleccionado
    selectBoard(pbb.id);
    setBoardName(pbb.name);
  };

  return (
    <div className="bg-gray-800 p-4 shadow-md w-full h-screen border-r-2 border-dotted border-yellow-600">
      
      <h3 className="text-white text-lg font-semibold text-center">Boards</h3>

      {/* Botones de selección de filtro */}
      <div className="flex space-x-2 mb-4">
        <button
          className={`p-1 rounded-md font-semibold ${
            filterChange === 1 ? "bg-yellow-800 text-white" : "bg-gray-700 text-white"
          }`}
          onClick={() => handleFilterChange(1)}
        >
          By Me
        </button>
        <button
          className={`p-1 rounded-md font-semibold ${
            filterChange === 2 ? "bg-yellow-800 text-white" : "bg-gray-700 text-white"
          }`}
          onClick={() => handleFilterChange(2)}
        >
          Authorized
        </button>
        <button
          className={`p-1 rounded-md font-semibold ${
            filterChange === 3 ? "bg-yellow-800 text-white" : "bg-gray-700 text-white"
          }`}
          onClick={() => handleFilterChange(3)}
        >
          All
        </button>
      </div>

      {/* Contenedor para centrar el botón */}
      <div className="flex justify-center mt-4 flex-row justify-between items-center">
        <div className="flex space-x-4 items-center">
          <label className="text-white">Filter by:</label>
          <select
            className="p-1 bg-gray-800 text-white"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="id">ID</option>
          </select>
        </div>

        <input
          type="text"
          placeholder={`Search by ${filterType}`}
          className="p-1 bg-gray-800 text-white border-b-2 border-yellow-700"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="mt-4 space-y-4 h-[calc(100vh-400px)] overflow-y-auto w-full min-w-[500px]">
        {isLoading ? (
          <div className="text-center text-gray-400">Loading boards...</div> 
        ) : pbbData.length > 0 ? (
          pbbData.map((pbb, index) => (
            <div 
              key={index} 
              onClick={() => handleBoardClick(pbb)}
              className={`p-3 border-y-2 border-gray-500 ${
                selectedBoardId === pbb.id
                  ? "bg-yellow-950" // Color de fondo cuando está seleccionado
                  : "bg-primary hover:bg-gray-700" // Color de fondo predeterminado
              }`}
            >
              <p className="text-yellow-700 font-semibold mb-1">ID: <span className="text-gray-400 font-normal">{generateShortSHA256(pbb.id)}</span></p>
              <p className="text-yellow-700 font-semibold mb-1">Name: <span className="text-gray-400 font-normal">{pbb.name}</span></p>
              <p className="text-yellow-700 font-semibold mb-1">Created By: <span className="text-gray-400 font-normal">{pbb.creator.id}</span></p>
              <p className="text-yellow-700 font-semibold">Date: <span className="text-gray-400 font-normal">{formatDate(pbb.timestamp)}</span></p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-20">No boards available</div>
        )}
      </div>

      <div className="flex space-x-2 mt-4 justify-center flex-row items-center">
        <button 
          onClick={handlePreviousPage}
          className={`bg-gray-700 hover:bg-yellow-900 text-white py-1 px-2 rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>

        <button 
          onClick={handleNextPage}
          className={`bg-gray-700 hover:bg-yellow-900 text-white py-1 px-2 rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      <hr className="border-t-0 border border-yellow-800 my-4" />
      
      <div className='flex justify-center items-center'>
        <button 
          className="bg-yellow-900 hover:bg-yellow-950 text-white py-1 px-24 rounded font-bold" 
          onClick={handleShowForm}
        >
          New board
        </button>
      </div>
    </div>
  );
};

export default PBBContainer;
