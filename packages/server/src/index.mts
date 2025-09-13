import { clerkMiddleware } from "@clerk/express";
import express from "express";
import { contextMiddleware } from "./context.mjs";
import { logger, register } from "@onerlaw/framework/backend/logger";
import { expressTRPCMiddleware } from "./network/rpc/index.mjs";
import { config } from "./network/http/index.mjs";
import { quiltt } from "./network/http/webhook/quiltt/index.mjs";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  clerkMiddleware({
    debug: true,
    enableHandshake: true,
  }),
);

app.use(contextMiddleware());

register({ app: app as unknown as express.Express, logger });

app.get("/api/health", express.json(), (req, res) =>
  res.status(200).send("OK"),
);

app.use("/api/trpc", express.json(), expressTRPCMiddleware);

app.use("/api/app/config", express.json(), config);

app.use("/api/webhook/quiltt", express.json(), quiltt);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
