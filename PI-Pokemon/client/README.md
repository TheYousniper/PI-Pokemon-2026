# 🎮 Pokémon PI — PokéWorld

Aplicación web interactiva inspirada en el universo Pokémon. Permite explorar Pokémon, consultar sus características, buscar por nombre, aplicar filtros, ordenar resultados y crear nuevos Pokémon almacenados en una base de datos PostgreSQL.

## ✨ Funcionalidades

- **Pokédex:** listado de Pokémon obtenidos desde PokeAPI y desde la base de datos propia.
- **Búsqueda:** búsqueda de Pokémon por nombre.
- **Filtros:** filtrado por tipo y origen (PokeAPI o base de datos).
- **Ordenamiento:** orden alfabético y por nivel de ataque, ascendente y descendente.
- **Paginación:** visualización de 12 Pokémon por página.
- **Detalle:** consulta de estadísticas, imagen, identificador y tipos.
- **Creación:** formulario para registrar Pokémon personalizados.
- **Persistencia:** almacenamiento de Pokémon propios en PostgreSQL.
- **Pruebas automatizadas:** pruebas de componentes, rutas y modelos.

## 🛠️ Tecnologías utilizadas

### Frontend
- React
- Vite
- Redux Toolkit
- React Redux
- React Router DOM
- Axios
- CSS

### Backend
- Node.js
- Express
- Sequelize
- PostgreSQL
- Axios

### Testing
- Jest
- Supertest
- Vitest
- React Testing Library
- Jest DOM
- User Event

### API externa
- [PokéAPI](https://pokeapi.co/)

## 📁 Estructura del proyecto

```text
pokemon-app/
│
├── api/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── typesController.js
│   │   │   ├── pokemonsController.js
│   │   │   ├── searchPokemonController.js
│   │   │   ├── pokemonDetailController.js
│   │   │   └── createPokemonController.js
│   │   ├── models/
│   │   │   ├── Pokemon.js
│   │   │   ├── Type.js
│   │   │   └── index.js
│   │   ├── routes/
│   │   │   ├── typesRoutes.js
│   │   │   ├── pokemonsRoutes.js
│   │   │   └── searchPokemonRoutes.js
│   │   └── test/
│   │       ├── models/
│   │       │   └── Pokemon.test.js
│   │       └── routes/
│   │           └── api.test.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── index.js
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── test/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## ⚙️ Requisitos previos

Antes de instalar el proyecto, asegúrate de tener:

- Node.js
- npm
- PostgreSQL
- Git

## 🚀 Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone URL_DE_TU_REPOSITORIO
```

Ingresar a la carpeta:

```bash
cd pokemon-app
```

### 2. Configurar la base de datos

Abre PostgreSQL y crea la base de datos:

```sql
CREATE DATABASE pokemon;
```

### 3. Configurar el Backend

Ingresar a la carpeta:

```bash
cd api
```

Instalar dependencias:

```bash
npm install
```

Crear un archivo `.env` dentro de `api/`:

```env
DB_NAME=pokemon
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD
DB_HOST=localhost
DB_PORT=5432
PORT=3001
```

Iniciar el servidor:

```bash
npm run dev
```

El backend estará disponible en:

```text
http://localhost:3001
```

### 4. Configurar el Frontend

Abre otra terminal y entra a la carpeta:

```bash
cd client
```

Instalar dependencias:

```bash
npm install
```

Crear un archivo `.env` dentro de `client/`:

```env
VITE_API_URL=http://localhost:3001
```

Iniciar la aplicación:

```bash
npm run dev
```

Vite mostrará la dirección local para acceder a PokéWorld desde el navegador.

## 🔗 Endpoints del Backend

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/pokemons` | Obtiene los Pokémon de PokeAPI y de PostgreSQL. |
| GET | `/pokemons/:idPokemon` | Obtiene el detalle de un Pokémon. |
| GET | `/pokemons/name?name=pikachu` | Busca un Pokémon por nombre. |
| POST | `/pokemons` | Crea un Pokémon personalizado. |
| GET | `/types` | Obtiene los tipos Pokémon. |

### Ejemplo de creación de Pokémon

**POST** `/pokemons`

```json
{
  "name": "Electromax",
  "image": "https://URL_DE_LA_IMAGEN",
  "hp": 80,
  "attack": 95,
  "defense": 75,
  "speed": 100,
  "height": 15,
  "weight": 450,
  "types": ["electric"]
}
```

## 🧪 Pruebas automatizadas

El proyecto cuenta con pruebas automatizadas para verificar el funcionamiento del backend y frontend.

### Backend

Desde la carpeta `api`:

```bash
npm test
```

Pruebas realizadas:
- Validación del modelo Pokémon.
- Validación de atributos obligatorios.
- Generación de identificadores UUID.
- Verificación de las rutas del servidor.
- Verificación del endpoint de tipos.

### Frontend

Desde la carpeta `client`:

```bash
npm test
```

Pruebas realizadas:
- Renderizado del nombre del Pokémon.
- Visualización de sus tipos.
- Visualización de estadísticas.
- Identificación del origen del Pokémon.
- Funcionamiento del evento de clic.
- Navegación mediante teclado.

**Resultado de las pruebas durante el desarrollo:**

- Backend: 11 pruebas aprobadas.
- Frontend: 6 pruebas aprobadas.
- Total: 17 pruebas aprobadas.

## 🔐 Seguridad

Los archivos `.env` contienen información privada y no deben publicarse en GitHub.

Asegúrate de incluir en los `.gitignore`:

```gitignore
node_modules/
.env
```

No compartas contraseñas ni credenciales de PostgreSQL.

## 🎨 Diseño

PokéWorld utiliza una interfaz inspirada en los videojuegos Pokémon, con una temática oscura, efectos visuales y elementos interactivos para ofrecer una experiencia dinámica.

## 👨‍💻 Autor

Proyecto desarrollado como parte del **Proyecto Individual (PI) Pokémon**.

**PokéWorld — ¡Atrápalos a todos!**