import React, { useState, useEffect } from 'react';

function MessageForm({ handleCancel, handleSend, boardName, fetchTopics }) {
  const [message, setMessage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [topics, setTopics] = useState([]);


  useEffect(() => {
    const loadTopics = async () => {
      try {
        const fetchedTopics = await fetchTopics(); // Espera la resolución de la función asincrónica
        setTopics(fetchedTopics || []); // Asegúrate de establecer un array vacío si fetchTopics retorna null/undefined
      } catch (err) {
        console.error("Error al cargar los tópicos:", err);
        setTopics([]); // En caso de error, establece un array vacío
      }
    };

    loadTopics(); // Llama a la función de carga de tópicos al montar el componente
  }, [fetchTopics]);


  const closeForm = () => {
    setError(null);
    handleCancel(false);
  };

  const handleTopicChange = (e) => {
    const value = e.target.value;
    if (value === 'new') {
      setSelectedTopic(''); // Resetea el tópico seleccionado
      setNewTopic(''); // Limpia el campo de nuevo tópico
    } else {
      setSelectedTopic(value);
      setNewTopic('');
    }
  };

  const handleNewTopicChange = (e) => {
    setNewTopic(e.target.value);
    setSelectedTopic(''); // Desactiva la selección de un tópico existente
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
          {/* Campo para seleccionar o escribir un tópico */}
          <div>

            <label htmlFor="topic" className="block text-sm font-medium leading-6 text-white">
              Select or write a topic
            </label>

            <div className="mt-2">
              <select
                id="topic"
                name="topic"
                value={selectedTopic || (newTopic && 'new')}
                onChange={handleTopicChange}
                disabled={isLoading}
                className="block w-full px-2 bg-gray-700 rounded-md border-0 py-1.5 text-white shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
              
                <option value="">Select a topic...</option>

                {topics.map((topic, index) => (
                  <option key={index} value={topic}>
                    {topic}
                  </option>
                ))}
                <option value="new">Write a new topic</option>

              </select>
            </div>

            {selectedTopic === '' && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Write your topic here..."
                  value={newTopic}
                  onChange={handleNewTopicChange}
                  disabled={isLoading}
                  className="block w-full px-2 bg-gray-700 rounded-md border-0 py-1.5 text-white shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            )}
          </div>

          {/* Campo para escribir el mensaje */}
          <div>
            
            <label htmlFor="topic" className="block text-sm font-medium leading-6 text-white">
              Message
            </label>

            <label htmlFor="message" className="block text-sm font-medium leading-6 text-white">
              {boardName}
            </label>
            <div className="mt-2">
              <textarea
                id="message"
                name="message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
                className={`px-2 bg-gray-700 block w-full rounded-md border-0 py-1.5 text-white shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6
                  ${isLoading ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : ''}`}
                rows="5"
                style={{ resize: 'none', overflow: 'auto' }}
              ></textarea>
            </div>
          </div>

          {/* Mensajes de espera o error */}
          {isLoading && (
            <p className="text-center text-yellow-500">Esperando confirmación de la transacción...</p>
          )}
          {error && (
            <p className="text-center text-red-500">Transacción fallida: {error}. Intente de nuevo.</p>
          )}

          {/* Botones */}
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
                if (message.length > 0 && (selectedTopic || newTopic)) {
                  setIsLoading(true);
                  setError(null);
                  try {
                    handleSend(
                      message,
                      selectedTopic || newTopic, // Envía el tópico seleccionado o nuevo
                    );
                    closeForm();
                  } catch (error) {
                    console.error('Error al enviar el mensaje:', error);
                    setError('La transacción no fue confirmada');
                  } finally {
                    setIsLoading(false);
                  }
                } else {
                  console.log('Por favor, completa todos los campos.');
                }
              }}
              type="button"
              disabled={isLoading}
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
