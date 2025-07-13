# Interacciones con IA

## Gemini

- Prompt: add more fields to django rest users
- Código:
```python
2. Creating a separate User Profile Model with a OneToOneField:
This approach is suitable when you need to add a few extra fields to an existing default Django user model without replacing it entirely.
Create a Profile Model: Define a new model (e.g., UserProfile) to store the additional fields.
Link to User: Add a OneToOneField in your UserProfile model that links to Django's built-in User model, with on_delete=models.CASCADE.
Create Serializers:
Define a ModelSerializer for your UserProfile model.
If you want to include profile fields when serializing a User, you can nest the UserProfileSerializer within your UserSerializer or use a SerializerMethodField to access and return profile data.
Example (using OneToOneField):
Python

# models.py
from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20, blank=True)
    address = models.CharField(max_length=255, blank=True)

# serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('phone_number', 'address')

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(source='userprofile', read_only=True) # Assuming 'userprofile' is the related_name

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'profile')
```
- ¿Cómo lo integré? Añadí el modelo UserProfile y UserProfileSerializer. Pero le puse el campo rut.

- Prompt: ¿Por qué puede ser este error? Estructura: proyecto llamado backend, app llamada users

django.core.exceptions.ImproperlyConfigured: Cannot import 'users'. Check that 'backend.users.apps.UsersConfig.name' is correct.
- Hablamos durante un rato, finalmente el problema era que estaba importando mal el módulo en settings.py.
Para corregirlo, moví las aplicaciones (users y scoring) a la carpeta apps/, en el mismo nivel raíz que el proyecto backend.
Además ajusté los imports en los archivos relevantes.
```
Tree carpeta backend:
backend/
    asgi.py
    settings.py
    ursl.py
    wsgi.py
apps/
    scoring/
    users/
```


## ChatGPT

- Prompt:¿Puedes crear una página de inicio con un formulario de login que consulta a una api que tengo en localhost:8000, para pasar a otra página que pregunta por un rut para preguntarle por ese rut a la api y que me retorne datos, por favor? En React con Vite

-
```
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RutQueryPage from './pages/RutQueryPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/rut-query" element={<RutQueryPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate('/rut-query');
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Entrar</button>
      </form>
    </div>
  );
};

export default LoginPage;

// src/pages/RutQueryPage.jsx
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
      const response = await fetch(`http://localhost:8000/api/rut/${rut}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Error al consultar el RUT');

      const data = await response.json();
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
```