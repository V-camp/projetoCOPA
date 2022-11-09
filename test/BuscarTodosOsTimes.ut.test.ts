import { CopaController } from '../src/controller/copaController';

describe("Teste do buscarTodosOsTimes", () => {
    afterEach(() => {
        jest.resetAllMocks();
    })

    const copaController = new CopaController()

    test("Test de buscarTodosOsTimes", async () => {
        const result = await copaController.buscarTodosOsTimes();

        expect(result).toBeDefined();
    })
})