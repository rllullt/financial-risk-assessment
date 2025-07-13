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
Username puede ser `admin`, email address puede ser cualquiera, password puede ser `holapassword`.

Ejecutar el servidor:
```bash
python3 manage.py runserver
```

Ingresar al admin en `http://localhost:8000/admin` para crearle un rut al admin en User profiles, y crear otro usuario no admin para fines de testing, al que también hay que crearle un rut.
Estos ruts deben ser:
```bash
admin: 12345678-1
user: 12345678-2
```
¿Por qué estos ruts? Porque hay `scores` hardcodeados con estos ruts en backend/apps/scoring/views.py


### Frontend

El frontend fue construido con Vite + React.
Nuevamente, es recomendable usar un ambiente virtual de ptyhon.

```bash
cd frontend/
python3 -m venv env
source env/bin/activate
python3 -m pip install nodeenv
nodeenv --python-virtualenv --node=lts
npm install
npm run dev
```

La página es básicamente un login, que una vez que se obtiene el token
(hay que haberlo creado previamente manualmente en Django, se sugiere en el Django admin),
redirige a la página de ruts, donde se pregunta por un rut y se devuelve el valor.


## Technologías

### Backend: Djanto REST

Lo elegí porque es un framework para backend que conozco, y que viene con usuarios pre definidos, para cumplir el desafío en el plazo de las 4 horas.
Además, conocía la aplicación SimpleJWT para este framework.

### Frontend: Vite + React

Lo elegí porque es un framework que conozco. En este caso usé Vanilla JavaScript para agilizar un poco el desarrollo dado el límite de tiempo.


## Problemas conocidos

Hay un commit de las 19:05 que completa un MVP de los requerimientos.
Sin embargo, como el tiempo límite eran las 19:00, se tiene un problema conocido (si es que no se considera este commit de fix):
- En el login del frontend, el token no se guarda correctamente en una variable localStorage, generando que no se pueda enviar correctamente al backendal momento de solicitar la información de scoring según el rut entregado.

Otros problemas no resueltos:
- No hay manejo de error en el front cuando el usuario no existe o no tiene autorización.
- Los scores son fijos: no se calculan según el rut ingresado. Se asume que en algún momento «fueron calculados».
