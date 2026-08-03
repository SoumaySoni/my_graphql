import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server),
);

// Serve static files from the React client dist folder
app.use(express.static(path.join(__dirname, "../client/dist")));

// Fallback for React routing
app.get("*", (req, res, next) => {
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    } else {
        next();
    }
});

const PORT = 4000;
await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

console.log(`🚀 GraphQL API ready at http://localhost:${PORT}/graphql`);
console.log(`🚀 Client Web App ready at http://localhost:${PORT}/`);
