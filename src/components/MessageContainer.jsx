import React, { useState, useEffect } from 'react';
import manageIcon from '../assets/manageAccounts.png';
import writeIcon from '../assets/writeIcon.png';
import { useEthereum } from "../context/EthereumContext";

const MessageContainer = ({ messages, handleShowMessageForm, boardName, handleShowManageForm, fetchTopics, selectedBoard }) => {
  const { pbbService } = useEthereum();

  const [authorizedUsers, setAuthorizedUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true); // Estado de carga
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('author');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (selectedBoard !== -1) {
        try {
          const users = await pbbService.getAuthorizedUsersByPBB(selectedBoard);
          setAuthorizedUsers(users || []);
        } catch (error) {
          console.error("Error al obtener usuarios autorizados:", error);
          setAuthorizedUsers([]);
        } finally {
          setIsLoadingUsers(false); // Marcar como cargado
        }
      }
    };
    fetchUsers();
  }, [selectedBoard, pbbService]);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const fetchedTopics = await fetchTopics();
        setTopics(fetchedTopics || []);
      } catch (err) {
        console.error("Error al cargar los tópicos:", err);
        setTopics([]);
      }
    };

    loadTopics();
  }, [fetchTopics]);

  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('en-GB') + ' ' + date.toLocaleTimeString('en-GB');
  };

  const filteredMessages = messages.filter((message) => {
    const term = searchTerm.toLowerCase();

    if (filterType === 'content') {
      return message.content.toLowerCase().includes(term);
    }

    if (filterType === 'topic') {
      return selectedTopic ? message.topic === selectedTopic : true;
    }

    return message.sender.id.toLowerCase().includes(term);
  });

  // Mostrar indicador de carga si los usuarios aún no están listos
  if (isLoadingUsers) {
    return (
      <div className="flex items-center justify-center text-gray-500 text-2xl h-full">
        Loading users...
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-8 shadow-md w-full h-full">
      <h3 className="text-white text-lg font-semibold text-center">{boardName}</h3>
      
      <div className="flex flex-row justify-between items-center mt-4">
        <div className="flex space-x-4 items-center">
          <label className="text-white">Filter by:</label>
          <select
            className="p-1 bg-gray-800 text-white"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              if (e.target.value !== 'topic') {
                setSelectedTopic('');
              }
            }}
          >
            <option value="author">Author</option>
            <option value="content">Content</option>
            <option value="topic">Topic</option>
          </select>
        </div>

        {filterType === 'topic' ? (
          <select
            className="p-1 bg-gray-800 text-white"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option value="">All Topics</option>
            {topics.map((topic, index) => (
              <option key={index} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            placeholder={`Search by ${filterType}`}
            className="p-1 bg-gray-800 text-white border-b-2 border-yellow-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}

        <div className="flex flex-row">
          <button 
            className="bg-yellow-900 hover:bg-red-950 text-white font-bold rounded-lg m-1 p-1 flex items-center justify-center" 
            onClick={() => handleShowMessageForm(true)}
          >
            <img src={writeIcon} alt="icono" className="h-8 w-8" />
          </button>
          <button 
            className="bg-yellow-900 hover:bg-red-950 text-white font-bold rounded-lg m-1 p-1 flex items-center justify-center" 
            onClick={() => {handleShowManageForm(true)}}
          >
            <img src={manageIcon} alt="icono" className="h-8 w-8" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-4 max-h-[calc(100vh-330px)] overflow-y-auto">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message, index) => {
            const isAuthorized = authorizedUsers.includes(message.sender.id);
            return (
              <div 
                key={index} 
                className={`p-4 border-y-2 ${!isAuthorized ? 'bg-red-950' : 'bg-primary'} border-gray-500`}
                onClick={() => {}}
              >
                <p className={`font-semibold mb-1 ${isAuthorized ? 'text-white' : 'text-yellow-700'}`}>
                  Author: <span className={`font-normal ${isAuthorized ? 'text-gray-200' : 'text-gray-400'}`}>{message.sender.id}</span>
                </p>
                <p className="text-yellow-700 font-semibold mb-1">Date: <span className="text-gray-400 font-normal">{formatDate(message.timestamp)}</span></p>
                <p className="text-yellow-700 font-semibold mb-1">Topic: <span className="text-gray-400 font-normal">{message.topic}</span></p>
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
            );
          })
        ) : (
          <div className="flex items-center justify-center text-gray-500 text-2xl h-full">Empty Board</div>
        )}
      </div>
    </div>
  );
};

export default MessageContainer;
