CREATE USER vuelos_user WITH PASSWORD 'admin123';
CREATE DATABASE vuelos_db OWNER vuelos_user;

\c vuelos_db

ALTER SCHEMA public OWNER TO vuelos_user;
GRANT ALL ON SCHEMA public TO vuelos_user;
GRANT CREATE ON SCHEMA public TO vuelos_user;

ALTER DEFAULT PRIVILEGES FOR USER vuelos_user IN SCHEMA public
GRANT ALL ON TABLES TO vuelos_user;

ALTER DEFAULT PRIVILEGES FOR USER vuelos_user IN SCHEMA public
GRANT ALL ON SEQUENCES TO vuelos_user;

ALTER DEFAULT PRIVILEGES FOR USER vuelos_user IN SCHEMA public
GRANT ALL ON FUNCTIONS TO vuelos_user;


mkdir aereopuerto_api
cd aereopuerto_api
python3 -m venv venv
source venv/bin/activate

django-admin startproject config .
python manage.py startapp vuelos

npm create vite@latest vuelos-ui -- --template react-ts
cd vuelos-ui
npm install

npx create-expo-app@latest vuelos-rn --template
cd vuelos-rn
npm install


git config --global user.email "earielp2000@hotmail.com"
  git config --global user.name "Arielp22"