import app from "./src/app.js";
import { database, env } from "./src/config/index.js";

await database.connect();

app.listen(env.server.port, () => {
  console.log(`🚀 => Server ready at http://localhost:${env.server.port}`);
});
