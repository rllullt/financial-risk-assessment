import React, { useState } from 'react';

const RutQueryPage = () => {
  const [rut, setRut] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleQuery = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/score/${rut}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      if (!response.ok) throw new Error('Error al consultar el RUT');
      
      const data = await response.json();
      console.log('response:', response);
      setResult(data);
    } catch (err) {
      setError('No se pudo obtener información del RUT');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <form onSubmit={handleQuery} className="bg-white p-6 rounded shadow-md w-96 mb-4">
        <h2 className="text-xl font-bold mb-4">Consulta por RUT</h2>
        <input
          type="text"
          placeholder="12345678-9"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Consultar</button>
      </form>

      {result && (
        <div className="bg-white p-4 rounded shadow-md w-96">
          <h3 className="font-semibold mb-2">Resultado:</h3>
          <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default RutQueryPage;
