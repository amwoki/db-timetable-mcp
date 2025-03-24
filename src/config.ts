import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Lade Umgebungsvariablen
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Konfigurationswerte
export const config = {
	server: {
		name: "DB Timetables MCP Server",
		version: "1.0.0",
		transportType: process.env.TRANSPORT_TYPE || "stdio", // 'stdio' oder 'sse'
		port: Number.parseInt(process.env.PORT || "8080", 10),
		endpoint: process.env.SSE_ENDPOINT || "/sse",
	},
	api: {
		baseUrl:
			"https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1",
		clientId: process.env.DB_TIMETABLE_CLIENT_ID || "",
		clientSecret: process.env.DB_TIMETABLE_CLIENT_SECRET || "",
	},
	logging: {
		level: process.env.LOG_LEVEL || "info",
	},
};

if (!config.api.clientId || !config.api.clientSecret) {
	console.error(
		"API-Zugangsdaten fehlen! Bitte setze DB_TIMETABLE_CLIENT_ID und DB_TIMETABLE_CLIENT_SECRET in .env",
	);
	process.exit(1);
}

export default config;
