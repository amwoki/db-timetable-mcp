import {
	PlannedTimetableResourceArgs,
	StationResourceArgs,
	TimetableResourceArgs,
	currentTimetableResource,
	plannedTimetableResource,
	recentChangesResource,
	stationResource,
} from "./timetableResources.js";

export const resources = [
	currentTimetableResource,
	recentChangesResource,
	plannedTimetableResource,
	stationResource,
];

export {
	currentTimetableResource,
	recentChangesResource,
	plannedTimetableResource,
	stationResource,
	TimetableResourceArgs,
	PlannedTimetableResourceArgs,
	StationResourceArgs,
};
