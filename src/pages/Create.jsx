import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PBBContainer from '../components/BoardContainer';
import MessageContainer from '../components/MessageContainer';
import { useEthereum } from "../context/EthereumContext";
import BoardForm from '../components/BoardForm';
import { useNavigate } from 'react-router-dom';
import MessageForm from '../components/MessageForm';
import ManageForm from '../components/ManageForm';


function Create() {
  const { account, pbbService, factoryService, connectWallet } = useEthereum();
  const [allBoards, setAllBoards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [boardsToShow, setBoardsToShow] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(-1);
  const [boardName, setBoardName] = useState("Messages");
  const [messages, setMessages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [showManageForm, setShowManageForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const boardsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState(3);

  const navigate = useNavigate();

  useEffect(() => {
    if (!account) {
      navigate("/");
    }
  }, [account, navigate]);

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!pbbService || selectedBoard === -1) return;
      try {
        const events = await pbbService.getMessagesByPBB(selectedBoard);
        setMessages(events);
      } catch (error) {
        console.error("Error al cargar Mensajes:", error);
        toast.error("Error al cargar mensajes");
      }
    };

    fetchMessages();
  }, [pbbService, selectedBoard]);

  const loadAllBoards = async () => {
    if (!pbbService) return;
    try {

      let pbbs = [];

      switch (filterType) {
        case 1:
          pbbs = await pbbService.getCreatedPBBsByUser(account);
          break;
        case 2:
          pbbs = await pbbService.getAuthorizedPBBsByUser(account);
          console.log("PORQUEEE: " + pbbs)
          break;
        case 3:
        default:
          pbbs = await pbbService.getAllPBBs();
          break;
      }

      setAllBoards(pbbs);
      applyFilterAndPaginate(1, searchTerm, pbbs);
      
    } catch (error) {
      console.error("Error al cargar boards:", error);
      toast.error("Error al cargar los boards");
    }
  };

  const applyFilterAndPaginate = (page, term = searchTerm, boards = allBoards) => {
    const filtered = boards.filter(board => 
      board.name.toLowerCase().includes(term.toLowerCase()) || 
      board.id.toString().includes(term)
    );

    setFilteredBoards(filtered);
    const totalPages = Math.ceil(filtered.length / boardsPerPage);

    const validPage = Math.min(page, totalPages);
    setCurrentPage(validPage);

    const start = (validPage - 1) * boardsPerPage;
    const end = start + boardsPerPage;
    setBoardsToShow(filtered.slice(start, end));
  };

  useEffect(() => {
    loadAllBoards();
  }, [pbbService, filterType]);

  const handleNextPage = () => {
    const totalPages = Math.ceil(filteredBoards.length / boardsPerPage);
    if (currentPage < totalPages) {
      applyFilterAndPaginate(currentPage + 1, searchTerm);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      applyFilterAndPaginate(currentPage - 1, searchTerm);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    applyFilterAndPaginate(1, term);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    setCurrentPage(1);
  };


  // FORMA NUEVA
  const handleCreateBoard2 = async (name, authorizedUsers) => {
    try {
      await factoryService.createPBB(1, name, authorizedUsers);
      loadAllBoards(); // Recargar boards al crearse uno nuevo
      toast.success("Board creado con éxito");
    } catch (error) {
      console.error("Error al crear el board:", error);
      toast.error("Error al crear el board");
    }
  };

  const handleSendMessage = async (message, topic) => {
    try {
      await pbbService.addMessageToPBB(selectedBoard, 1, message, topic);
      setShowMessageForm(false); // Cierra el formulario de mensajes
      const updatedMessages = await pbbService.getMessagesByPBB(selectedBoard); // Recargar mensajes
      setMessages(updatedMessages);
      toast.success("Mensaje enviado con éxito");
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      toast.error("Error al enviar mensaje");
    }
  };

  const handleAuthorizeUser = async (userAddress) => {
    try {
      await pbbService.authorizeUserToPBB(selectedBoard, 1, userAddress);
      toast.success(`Usuario ${userAddress} autorizado`);
    } catch (error) {
      console.error("Error al autorizar usuario:", error);
      toast.error("Error al autorizar usuario");
    }
  };

  const handleRevokeUser = async (userAddress) => {
    try {
      await pbbService.revokeUserToPBB(selectedBoard, 1, userAddress);
      toast.success(`Usuario ${userAddress} revocado`);
    } catch (error) {
      console.error("No tiene permiso para revocar usuario", error);
      toast.error("No tiene permiso para revocar usuario");
    }
  };

  const handleTransferAdmin = async (userAddress) => {
    try {
      await pbbService.transferAdminToPBB(selectedBoard, 1, userAddress);
      toast.success(`Usuario ${userAddress} autorizado`);
    } catch (error) {
      console.error("Error al autorizar usuario:", error);
      toast.error("Error al autorizar usuario");
    }
  };

  const fetchTopics = async () => {
    try {
      if(!pbbService) return
      return await pbbService.getTopicsByPBB(selectedBoard);
    } catch (error) {
      console.error("Error al cargar los topicos", error);
    }
  }

  return (
    <div>
      <div className="flex flex-row bg-gray-700 h-screen">
        
        <div className="w-120 bg-gray-800 flex flex-col items-center justify-center">
          <PBBContainer 
            pbbData={boardsToShow} 
            handleShowForm={setShowForm} 
            selectBoard={(id) => setSelectedBoard(id)} 
            setBoardName={(name) => setBoardName(name)} 
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
            currentPage={currentPage}
            totalPages={Math.ceil(filteredBoards.length / boardsPerPage)}
            onSearch={handleSearch}
            handleFilterChange={handleFilterChange}
            filterChange={filterType}
          />
        </div>
        
        <div className="flex-1 bg-gray-700 flex flex-col items-center justify-center">
          <MessageContainer 
            messages={messages} 
            handleShowMessageForm={setShowMessageForm} 
            boardName={boardName} 
            handleShowManageForm={setShowManageForm} 
            fetchTopics={fetchTopics}
            selectedBoard={selectedBoard}
          />
        </div>
        
      </div>

      {showForm && (
        <div>
          <div className="fixed inset-0 bg-transparent-700 bg-opacity-75 backdrop-blur-sm z-40 transition-opacity duration-5000 ease-in-out"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-yellow-800 p-1 rounded-lg shadow-lg w-[500px]">
              <BoardForm 
              handleCancel={() => setShowForm(false)} 
              handleCreate={handleCreateBoard2} />
            </div>
          </div>
        </div>
      )}

      {showMessageForm && (
        <div>
          <div className="fixed inset-0 bg-transparent-700 bg-opacity-75 backdrop-blur-sm z-40 transition-opacity duration-5000 ease-in-out"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-yellow-800 p-1 rounded-lg shadow-lg w-[500px]">
              <MessageForm 
              handleCancel={() => setShowMessageForm(false)} 
              handleSend={handleSendMessage} 
              fetchTopics={fetchTopics} />
            </div>
          </div>
        </div>
      )}

      {showManageForm && (
        <div>
          <div className="fixed inset-0 bg-transparent-700 bg-opacity-75 backdrop-blur-sm z-40 transition-opacity duration-5000 ease-in-out"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-yellow-800 p-1 rounded-lg shadow-lg w-[500px]">
              <ManageForm 
                handleCancel={() => setShowManageForm(false)} 
                authorizeUser={handleAuthorizeUser}
                revokeUser={handleRevokeUser}
                selectedBoard={selectedBoard}
                authorizeNewAdmin={handleTransferAdmin}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Create;
