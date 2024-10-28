import React, { useState, useEffect } from 'react';
import { useEthereum } from "../context/EthereumContext";

function AuthorizationForm({ selectedBoard, handleCancel, authorizeUser, revokeUser }) {
  const { pbbService } = useEthereum();

  const [searchTerm, setSearchTerm] = useState('');
  const [newUserAddress, setNewUserAddress] = useState('');
  const [authorizedUsers, setAuthorizedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(authorizedUsers);

  useEffect(() => {
    const fetchUsers = async () => {
        setAuthorizedUsers(await pbbService.getCurrentAuthorizedUsers(selectedBoard));
    };
    fetchUsers();
  }, []);

  // Filtra los usuarios autorizados según el término de búsqueda
  useEffect(() => {
    setFilteredUsers(
      authorizedUsers.filter(user =>
        user.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, authorizedUsers]);

  return (
    <div className="bg-primary flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 rounded-lg">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Manage User Authorization
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
        {/* Formulario para agregar una nueva dirección */}
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
              onClick={() => {
                authorizeUser(newUserAddress);
                setNewUserAddress('');
              }}
              className="bg-green-900 hover:bg-green-800 px-4 rounded-r-md text-white"
            >
              Authorize
            </button>
          </div>
        </div>

        {/* Búsqueda entre usuarios autorizados */}
        <div className='flex flex-col items-center'>
          <h3 className="text-lg font-bold text-white mb-0">Authorized Users</h3>
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
          <ul className="mt-2 max-h-48 min-h-48 w-full overflow-y-auto bg-gray-700 p-4 rounded-md shadow-md space-y-2">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-800 p-3 rounded-md border border-gray-600 hover:bg-gray-900 transition-all">
                  <span className="text-sm text-gray-300 font-mono truncate">{user}</span>
                  <button
                    onClick={() => revokeUser(user)}
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
            className="flex justify-center rounded-md px-4 py-1 bg-yellow-800 text-white hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthorizationForm;
