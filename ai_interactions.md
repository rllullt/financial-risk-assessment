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
