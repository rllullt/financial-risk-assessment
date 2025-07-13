# financial-risk-assessment

Simple API to simulate the assess of financial risk associated with Chilean RUTs


## Instalación

Esta aplicación fue testeada en linux.

Para descargar la app desde GitHub:

```bash
git clone git@github.com:rllullt/financial-risk-assessment.git
cd financial-risk-assessment/
```

### Backend

El backend fue construido en Django REST.
Es recomendable usar un ambiente virtual de python.

```bash
cd backend/
python3 -m venv env
source env/bin/activate
python3 manage.py makemigrations  # se usa sqlite
python3 manage.py migrate
```

Es importante crear un superusuario.
```bash
python3 manage.py createsuperuser
```
Username puede ser admin, email address puede ser cualquiera, password puede ser holapassword.

Ejecutar el servidor:
```bash
python3 manage.py runserver
```

Ingresar al admin para crearle un rut al admin en User profiles, y crear otro usuario no admin para fines de testing, al que también hay que crearle un rut.


## Technologías

### Backend: Djanto REST

Lo elegí porque es un framework para backend que conozco, y que viene con usuarios pre definidos, para cumplir el desafío en el plazo de las 4 horas.
Además, conocía la aplicación SimpleJWT para este framework.
