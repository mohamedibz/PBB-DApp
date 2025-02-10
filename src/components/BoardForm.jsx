import React, { useState } from 'react';
import Papa from 'papaparse';

function BoardForm({ handleCancel, handleCreate }) {
  
  const [name, setName] = useState('');
  const [authorizedUsers, setAuthorizedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para manejar la carga del archivo CSV
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const addresses = results.data.map(row => row.adresses).filter(elem => elem.length > 0);
        setAuthorizedUsers(addresses);
        console.log(addresses);
      },
    });
  };

  const closeForm = () => {
    setError(null);
    handleCancel(false);
  };

  return (
    <div className="bg-primary flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 rounded-lg">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-8 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          NEW BOARD
        </h2>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={() => {}} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-white">
              Name
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className={`pl-2 block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6
                  ${isLoading ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700'}`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-medium leading-6 text-white">
              Upload CSV with Authorized Users
            </label>
            <div className="mt-2">
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
            </div>
          </div>

          {isLoading && (
            <p className="text-center text-yellow-500">Esperando confirmación de la transacción...</p>
          )}
          {error && (
            <p className="text-center text-red-500">Transacción fallida: {error}. Intente de nuevo.</p>
          )}

          <div>
            <h3 className="mt-4 text-lg font-bold leading-6 text-white">Authorized Users</h3>
            <ul className="mt-2 max-h-48 w-full overflow-y-auto bg-gray-700 p-4 rounded-md shadow-md space-y-2">
              {authorizedUsers.length > 0 ? (
                authorizedUsers.map((user, index) => (
                  <li 
                    key={index} 
                    className="flex justify-between items-center bg-gray-800 p-3 rounded-md border border-gray-600 hover:bg-gray-900 transition-all"
                  >
                    <span className="text-sm text-gray-300 font-mono truncate">{user}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No users found</li>
              )}
            </ul>
          </div>

          <div className="flex flex-row m-4 space-x-8">
            <button
              type="button"
              onClick={closeForm}
              disabled={isLoading}
              className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm
                ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-yellow-800 hover:bg-red-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'}`}
            >
              Cancel
            </button>            
            
            <button
              onClick={async (e) => {
                e.preventDefault();
                if (name && authorizedUsers.length > 0) {
                  setError(null);
                  try {
                    setIsLoading(true);
                    handleCreate(name, authorizedUsers);
                    closeForm();
                  } catch (error) {
                    console.error('Error al crear el board:', error);
                    setError('La transacción no fue confirmada');
                  } finally {
                    setIsLoading(false);
                  }
                } else {
                  console.log('Por favor, introduce un nombre y usuarios autorizados.');
                }
              }}
              type="button"
              disabled={isLoading}
              className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm
                ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-yellow-800 hover:bg-red-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'}`}
            >
              Create Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BoardForm;
