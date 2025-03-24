import { describe, test, expect, vi, beforeEach } from 'vitest';
import { tools } from '../tools/index.js';
import { resources } from '../resources/index.js';

vi.mock('../api/timetableApi.js', () => ({
    timetableApi: {
        getCurrentTimetable: vi.fn().mockResolvedValue('<timetable>Current Data</timetable>'),
        getRecentChanges: vi.fn().mockResolvedValue('<timetable>Recent Changes</timetable>'),
        getPlannedTimetable: vi.fn().mockResolvedValue('<timetable>Planned Data</timetable>'),
        findStations: vi.fn().mockResolvedValue('<stations>Station Data</stations>')
    }
}));

const mockMcpServer = {
    addTool: vi.fn(),
    addResource: vi.fn(),
    executeTool: vi.fn(),
    loadResource: vi.fn()
};

mockMcpServer.executeTool.mockImplementation((toolId, _args) => {
    if (toolId === 'db-timetable:getCurrentTimetable') {
        return Promise.resolve('<timetable>Current Data</timetable>');
    }
    if (toolId === 'db-timetable:findStations') {
        return Promise.resolve('<stations>Station Data</stations>');
    }
    return Promise.resolve(null);
});

mockMcpServer.loadResource.mockImplementation((uri) => {
    if (uri === 'db-api:timetable/current/8000105') {
        return Promise.resolve('<timetable>Current Data</timetable>');
    }
    if (uri === 'db-api:station/Frankfurt') {
        return Promise.resolve('<stations>Station Data</stations>');
    }
    return Promise.reject(new Error(`Resource nicht gefunden: ${uri}`));
});

describe('MCP Server Integration', () => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let server: any;

    beforeEach(() => {
        server = mockMcpServer;

        vi.clearAllMocks();
    });

    describe('Tool Ausführung', () => {
        test('kann getCurrentTimetable ausführen', async () => {
            for (const tool of tools) {
                server.addTool(tool);
            }

            const result = await server.executeTool('db-timetable:getCurrentTimetable', { evaNo: '8000105' });
            expect(result).toBe('<timetable>Current Data</timetable>');
            expect(server.addTool).toHaveBeenCalled();
        });

        test('kann findStations ausführen', async () => {
            const result = await server.executeTool('db-timetable:findStations', { pattern: 'Frankfurt' });
            expect(result).toBe('<stations>Station Data</stations>');
        });
    });

    describe('Resource Anfragen', () => {
        test('kann die aktuelle Fahrplantafel abrufen', async () => {
            for (const resource of resources) {
                server.addResource(resource);
            }

            const result = await server.loadResource('db-api:timetable/current/8000105');
            expect(result).toBe('<timetable>Current Data</timetable>');
            expect(server.addResource).toHaveBeenCalled();
        });

        test('kann Stationen suchen', async () => {
            const result = await server.loadResource('db-api:station/Frankfurt');
            expect(result).toBe('<stations>Station Data</stations>');
        });

        test('liefert einen Fehler bei ungültigem Ressourcen-URI', async () => {
            await expect(server.loadResource('db-api:invalid')).rejects.toThrow();
        });
    });
}); 