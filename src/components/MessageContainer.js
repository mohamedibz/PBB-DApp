import React, { useState } from 'react';
import manageIcon from '../assets/manageAccounts.png';
import writeIcon from '../assets/writeIcon.png';

const MessageContainer = ({ messages, handleShowMessageForm, boardName, handleShowManageForm }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('author');

  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp) * 1000); 
    return date.toLocaleDateString('en-GB') + ' ' + date.toLocaleTimeString('en-GB');
  };

  // Filtrar los mensajes según el tipo de filtro y el término de búsqueda
  const filteredMessages = messages.filter((message) => {
    if (filterType === 'content') {
      return message.content.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return message.sender.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="bg-gray-800 p-8 shadow-md w-full h-full">
      <h3 className="text-white text-lg font-semibold text-center">{boardName}</h3>
      
      <div className="flex flex-row justify-between items-center mt-4">
        <div className="flex space-x-4 items-center">
          <label className="text-white">Filter by:</label>
          <select
            className="p-1 bg-gray-800 text-white"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="Author">author</option>
            <option value="Content">content</option>
          </select>
        </div>

        <input
          type="text"
          placeholder={`Search by ${filterType}`}
          className="p-1 bg-gray-800 text-white border-b-2 border-yellow-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="flex flex-row">
          <button className="bg-yellow-900 hover:bg-red-950 text-white font-bold rounded-lg m-1 p-1 flex items-center justify-center" onClick={() => handleShowMessageForm(true)}>
            <img src={writeIcon} alt="icono" className="h-8 w-8" />
          </button>
          <button className="bg-yellow-900 hover:bg-red-950 text-white font-bold rounded-lg m-1 p-1 flex items-center justify-center" onClick={() => {handleShowManageForm(true)}}>
            <img src={manageIcon} alt="icono" className="h-8 w-8" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-4 max-h-[calc(100vh-330px)] overflow-y-auto">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message, index) => (
            <div 
              key={index} 
              className="bg-primary p-4 border-y-2 border-gray-500"
              onClick={() => {}}
            >
              <p className="text-yellow-700 font-semibold mb-1">Author: <span className="text-gray-400 font-normal">{message.sender}</span></p>
              <p className="text-yellow-700 font-semibold mb-1">Date: <span className="text-gray-400 font-normal">{formatDate(message.date)}</span></p>
              <p className="text-yellow-700 font-semibold">Content:</p>
              <p className="text-gray-400 ml-4">{message.content}</p>
              <a 
                href={`https://sepolia.etherscan.io/tx/${message.txHash}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-300 underline mt-2 inline-block"
              >
                verify in Etherscan
              </a>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center text-gray-500 text-2xl h-full">Empty Board</div>
        )}
      </div>
    </div>
  );
};

export default MessageContainer;
