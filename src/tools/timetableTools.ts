import { z } from "zod";
import { timetableApi } from "../api/timetableApi.js";
import type {
	PlanParams,
	StationParams,
	TimetableParams,
} from "../api/types.js";
import { ValidationError, asyncErrorHandler } from "../utils/errorHandling.js";
import { type LogMetadata, logger } from "../utils/logger.js";

const TimetableParamsSchema = z.object({
	evaNo: z
		.string()
		.min(1)
		.describe("EVA-Nummer der Station (z.B. 8000105 für Frankfurt Hbf)"),
});

const PlanParamsSchema = z.object({
	evaNo: z
		.string()
		.min(1)
		.describe("EVA-Nummer der Station (z.B. 8000105 für Frankfurt Hbf)"),
	date: z
		.string()
		.regex(/^\d{6}$/)
		.describe("Datum im Format YYMMDD (z.B. 230401 für 01.04.2023)"),
	hour: z
		.string()
		.regex(/^([0-1][0-9]|2[0-3])$/)
		.describe("Stunde im Format HH (z.B. 14 für 14 Uhr)"),
});

const StationParamsSchema = z.object({
	pattern: z
		.string()
		.min(1)
		.describe("Suchmuster für Stationen (z.B. Frankfurt oder 8000105)"),
});

export const getCurrentTimetableTool = {
	name: "getCurrentTimetable",
	description: "Ruft aktuelle Fahrplandaten für eine Bahnhofsstation ab",
	parameters: TimetableParamsSchema,
	execute: asyncErrorHandler(async (args) => {
		logger.info("Rufe aktuelle Fahrplandaten ab", args as LogMetadata);

		const validateResult = TimetableParamsSchema.safeParse(args);
		if (!validateResult.success) {
			throw new ValidationError(
				"Ungültige Parameter für getCurrentTimetable",
				validateResult.error.format(),
			);
		}

		const result = await timetableApi.getCurrentTimetable(
			args as TimetableParams,
		);
		return result;
	}),
};

export const getRecentChangesTool = {
	name: "getRecentChanges",
	description: "Ruft aktuelle Änderungen für eine Bahnhofsstation ab",
	parameters: TimetableParamsSchema,
	execute: asyncErrorHandler(async (args) => {
		logger.info("Rufe aktuelle Änderungen ab", args as LogMetadata);

		const validateResult = TimetableParamsSchema.safeParse(args);
		if (!validateResult.success) {
			throw new ValidationError(
				"Ungültige Parameter für getRecentChanges",
				validateResult.error.format(),
			);
		}

		const result = await timetableApi.getRecentChanges(args as TimetableParams);
		return result;
	}),
};

export const getPlannedTimetableTool = {
	name: "getPlannedTimetable",
	description:
		"Ruft geplante Fahrplandaten für eine bestimmte Station und Zeitspanne ab",
	parameters: PlanParamsSchema,
	execute: asyncErrorHandler(async (args) => {
		logger.info("Rufe geplante Fahrplandaten ab", args as LogMetadata);

		const validateResult = PlanParamsSchema.safeParse(args);
		if (!validateResult.success) {
			throw new ValidationError(
				"Ungültige Parameter für getPlannedTimetable",
				validateResult.error.format(),
			);
		}

		const result = await timetableApi.getPlannedTimetable(args as PlanParams);
		return result;
	}),
};

export const findStationsTool = {
	name: "findStations",
	description: "Sucht nach Bahnhofsstationen anhand eines Musters",
	parameters: StationParamsSchema,
	execute: asyncErrorHandler(async (args) => {
		logger.info("Suche nach Stationen", args as LogMetadata);

		const validateResult = StationParamsSchema.safeParse(args);
		if (!validateResult.success) {
			throw new ValidationError(
				"Ungültige Parameter für findStations",
				validateResult.error.format(),
			);
		}

		const result = await timetableApi.findStations(args as StationParams);
		return result;
	}),
};
