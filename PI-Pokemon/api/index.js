
require("dotenv").config();

const app = require("./src/app");
const sequelize = require("./src/config/db");

require("./src/models");

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log("Conexión a PostgreSQL exitosa");

    await sequelize.sync();

    console.log("Modelos sincronizados correctamente");

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
};

startServer();
