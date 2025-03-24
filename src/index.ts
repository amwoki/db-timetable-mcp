import { FastMCP } from "fastmcp";
import { config } from "./config.js";
import { resources } from "./resources/index.js";
import { tools } from "./tools/index.js";
import { logger } from "./utils/logger.js";

const server = new FastMCP({
	name: config.server.name,
	version: config.server.version as `${number}.${number}.${number}`,
});

for (const tool of tools) {
	logger.info(`Tool hinzugefügt: ${tool.name}`);
	// @ts-ignore
	server.addTool(tool);
}

for (const resource of resources) {
	logger.info(`Ressource hinzugefügt: ${resource.name}`);
	// @ts-ignore
	server.addResource(resource);
}

logger.info(`Starte ${config.server.name} v${config.server.version}`);

if (config.server.transportType === "sse") {
	logger.info(`Server startet im SSE-Modus auf Port ${config.server.port}`);

	const endpoint = config.server.endpoint.startsWith("/")
		? config.server.endpoint
		: `/${config.server.endpoint}`;

	server.start({
		transportType: "sse",
		sse: {
			endpoint: endpoint as `/${string}`,
			port: config.server.port,
		},
	});
} else {
	logger.info("Server startet im stdio-Modus");
	server.start({
		transportType: "stdio",
	});
}

server.on("connect", (event) => {
	// @ts-ignore - FastMCP Session-Typ hat möglicherweise keine id-Eigenschaft
	const sessionId = event.session?.id || "unbekannt";
	logger.info("Client verbunden", { sessionId });
});

server.on("disconnect", (event) => {
	// @ts-ignore - FastMCP Session-Typ hat möglicherweise keine id-Eigenschaft
	const sessionId = event.session?.id || "unbekannt";
	logger.info("Client getrennt", { sessionId });
});

process.on("SIGINT", () => {
	logger.info("Server wird beendet (SIGINT)");
	process.exit(0);
});

process.on("SIGTERM", () => {
	logger.info("Server wird beendet (SIGTERM)");
	process.exit(0);
});

process.on("uncaughtException", (error) => {
	logger.error("Unbehandelte Ausnahme", { error });
	process.exit(1);
});

process.on("unhandledRejection", (reason) => {
	logger.error("Unbehandelte Promise-Ablehnung", { reason });
});

export default server;
