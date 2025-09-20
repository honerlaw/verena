import { clerkMiddleware } from "@clerk/express";
import express from "express";
import path from "path";
import { contextMiddleware } from "./context.mjs";
import { logger, register } from "@onerlaw/framework/backend/logger";
import { expressTRPCMiddleware } from "./network/rpc/index.mjs";
import { config } from "./network/http/index.mjs";
import { plaidWebhook } from "./network/http/webhook/plaid/webhook.mjs";

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

app.use("/api/webhook/plaid", express.json(), plaidWebhook);

// Serve static files from public directory (including .well-known)
app.use(express.static(path.join(process.cwd(), "../public")));

// serve static files from static directory (the app itself)
app.use(express.static(path.join(process.cwd(), "../static")));

// for unhandled paths, serve the index.html of the app
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(process.cwd(), "../static/index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
