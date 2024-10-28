import React, { useState } from 'react';

function MessageForm({ handleCancel, handleSend, boardName }) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Estado para el mensaje de error

  const closeForm = () => {
    setError(null); // Reinicia el mensaje de error al cerrar el formulario
    handleCancel(false);
  };

  return (
    <div className="bg-primary flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 rounded-lg">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Write Message
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={() => {}} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-white">
              {boardName}
            </label>
            <div className="mt-2">
              <textarea
                id="name"
                name="name"
                required
                autoComplete="name"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading} // Deshabilita el campo mientras se espera la transacción
                className={`px-2 bg-gray-700 block w-full rounded-md border-0 py-1.5 text-white shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6
                  ${isLoading ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : ''}`} // Estilo deshabilitado
                rows="5"
                style={{ resize: 'none', overflow: 'auto' }}
              ></textarea>
            </div>
          </div>

          {/* Mensaje de espera o error */}
          {isLoading && (
            <p className="text-center text-yellow-500">Esperando confirmación de la transacción...</p>
          )}
          {error && (
            <p className="text-center text-red-500">Transacción fallida: {error}. Intente de nuevo.</p>
          )}

          <div className="flex flex-row m-4 space-x-8">
            <button
              type="button"
              onClick={closeForm}
              disabled={isLoading} // Deshabilita el botón mientras se espera la transacción
              className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm
                ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-yellow-800 hover:bg-red-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'}`}
            >
              Cancel
            </button>            
            
            <button
              onClick={async (e) => {
                e.preventDefault();
                if (message.length > 0) {
                  setIsLoading(true); // Activa el modo de carga
                  setError(null); // Reinicia cualquier mensaje de error anterior
                  try {
                    handleSend(message); // Espera la confirmación
                    closeForm(); // Cierra el formulario después de confirmar
                  } catch (error) {
                    console.error('Error al enviar el mensaje:', error);
                    setError('La transacción no fue confirmada'); // Muestra un mensaje de error
                  } finally {
                    setIsLoading(false); // Desactiva el modo de carga
                  }
                } else {
                  console.log('Por favor, introduce un mensaje.');
                }
              }}
              type="button"
              disabled={isLoading} // Deshabilita el botón mientras se espera la transacción
              className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm
                ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-yellow-800 hover:bg-red-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'}`}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MessageForm;
