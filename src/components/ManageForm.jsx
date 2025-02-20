import React, { useState, useEffect } from 'react';
import { useEthereum } from "../context/EthereumContext";
import Papa from 'papaparse';


function AuthorizationForm({ selectedBoard, handleCancel }) {
  const { pbbService } = useEthereum();

  const [searchTerm, setSearchTerm] = useState('');
  const [newUserAddress, setNewUserAddress] = useState('');
  const [authorizedUsers, setAuthorizedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(authorizedUsers);
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewType, setViewType] = useState("authorized");
  const [csvUsers, setCsvUsers] = useState([]);


  const fetchUsers = async () => {
    setAuthorizedUsers(await pbbService.getAuthorizedUsersByPBB(selectedBoard));
  };

  const fetchAdmins = async () => {
    setAdmins(await pbbService.getAdminsByPBB(selectedBoard));
  };


  useEffect(() => {

    fetchAdmins();
    fetchUsers();

  }, []);

  // Filtra los usuarios autorizados según el término de búsqueda
  useEffect(() => {
    setFilteredUsers(
      (viewType === "authorized" ? authorizedUsers : admins).filter(user =>
        user.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, authorizedUsers, admins, viewType]);

  // Función para manejar la carga del archivo CSV
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const addresses = results.data.map(row => row.adresses).filter(elem => elem.length > 0);
        setCsvUsers(addresses);
      },
    });
  };

  return (
    <div className="bg-primary flex flex-1 flex-col justify-center px-6 py-0 lg:px-0">

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Manage User Authorization
        </h2>
      </div>

      <div className="flex justify-center mt-4 p-0 w-full max-w-md mx-auto h-[35px] divide-x-2">
        
        <button
          className={`w-1/2 flex items-center justify-center px-6 py-2 transition-all duration-300 text-center hover:bg-gray-700 border-b-2 ${
            viewType === "authorized" ? "bg-gray-700 text-white" : "text-gray-300"
            }`}
            onClick={() => setViewType("authorized")}
          >
          Users
        </button>

        <button
        className={`w-1/2 flex items-center justify-center px-6 py-2 transition-all duration-300 text-center hover:bg-gray-700 border-b-2 ${
          viewType === "admins" ? "bg-gray-700 text-white" : "text-gray-300"
          }`}
          onClick={() => setViewType("admins")}
          >
          Administrators
        </button>

      </div>

    <div className="mt-4 mx-8 space-y-4">

      {/* Formulario para agregar una nueva dirección */}
      {viewType === "authorized" && (
        <>
        <div>
            <label htmlFor="new-user" className="block text-sm font-medium leading-6 text-white">
              Add New User
            </label>
            <div className="mt-2 flex">
              <input
                id="new-user"
                name="newUser"
                type="text"
                placeholder="0x..."
                value={newUserAddress}
                onChange={(e) => setNewUserAddress(e.target.value)}
                className="pl-2 block w-full rounded-l-md border-0 py-1.5 text-white shadow-sm ring-0 bg-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <button
                onClick={async () => {
                  await pbbService.authorizeUserToPBB(selectedBoard, 1, newUserAddress);
                  await fetchUsers()
                  setNewUserAddress('');
                }}
                className="w-48 bg-green-900 hover:bg-green-800 px-4 rounded-r-md text-white"
              >
                Authorize
              </button>
            </div>
        </div>

        <div>
            <label htmlFor="file" className="block text-sm font-medium leading-6 text-white">
              Upload CSV with Authorized Users
            </label>
            <div className="mt-2 flex items-center gap-4">
              <input
                id="file"
                name="file"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isLoading}
                className={`block w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold 
                  ${isLoading ? 'file:bg-gray-500 cursor-not-allowed' : 'file:bg-yellow-900 hover:file:bg-indigo-500'}`}
              />
                <button
                  onClick={async () => { await pbbService.authorizeUsersToPBB(selectedBoard, 1, csvUsers) } }
                  className={`px-2 py-1 rounded-md transition-all text-white w-48 
                    ${csvUsers.length === 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-900 hover:bg-green-800'}`}
                >
                  Authorize Users
                </button>
            </div>
      </div>

        </>
      )}

      {/* Formulario para agregar una nueva dirección */}
      {viewType === "admins" && (
        <>
        <div>
            <label htmlFor="new-user" className="block text-sm font-medium leading-6 text-white">
              Add New Admin
            </label>
            <div className="mt-2 flex">
              <input
                id="new-user"
                name="newUser"
                type="text"
                placeholder="0x..."
                value={newUserAddress}
                onChange={(e) => setNewUserAddress(e.target.value)}
                className="pl-2 block w-full rounded-l-md border-0 py-1.5 text-white shadow-sm ring-0 bg-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <button
                onClick={async () => {
                  await pbbService.addAdminToPBB(selectedBoard, 1, newUserAddress);
                  await fetchAdmins();
                  setNewUserAddress('');
                }}
                className="w-48 bg-green-900 hover:bg-green-800 px-4 rounded-r-md text-white"
              >
                Add Admin
              </button>
            </div>
        </div>

        <div style={{ visibility: "hidden", height: "67px" }}></div>

        </>
      )}

      {/* Búsqueda entre usuarios autorizados */}
      <div className='flex flex-col items-center'>
          <input
            id="search"
            type="text"
            placeholder="Search by address"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-2 mt-2 block w-full border-b-2 border-yellow-700 py-1.5 text-white shadow-sm ring-0 bg-primary placeholder:text-gray-400 "
          />
      </div>

      {/* Lista de usuarios autorizados con opción para revocar */}
      <div className="mt-4">
          <ul className="mt-2 h-[200px] w-full overflow-y-auto bg-gray-700 p-4 rounded-md shadow-md space-y-2">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-800 p-3 rounded-md border border-gray-600 hover:bg-gray-900 transition-all">
                  <span className="text-sm text-gray-300 font-mono truncate">{user}</span>
                  <button
                    onClick={async () => {
                      if (viewType == 'authorized') {
                        await pbbService.revokeUserToPBB(selectedBoard, 1, user);
                        await fetchUsers();
                      } else {
                        await pbbService.revokeAdminFromPBB(selectedBoard, 1, user);
                        await fetchAdmins();
                      }
                    }}
                    className="text-sm text-white font-semibold px-4 py-1 rounded-md bg-red-900 hover:bg-red-800 transition-all"
                  >
                    Revoke
                  </button>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No authorized users found</li>
            )}
          </ul>
      </div>

      {/* Botón para cancelar */}
      <div className="flex justify-start space-x-4 mt-6">
          <button
            onClick={() => handleCancel()}
            className="flex justify-center rounded-md px-4 py-1 bg-yellow-800 text-white hover:bg-gray-500 mb-4"
          >
            Cancel
          </button>
      </div>

      </div>

    </div>
  );
}

export default AuthorizationForm;
