import { CopaController } from '../src/controller/copaController';
import { prismaMock } from '../singleton'
import input from "../temp/dadosParaSalvarNoDB.json"

describe("Teste do Buscar times vencedores", () => {
    afterEach(() => {
        jest.resetAllMocks();
    })

    const copaController = new CopaController()

    test('Buscar times vencedores... Teste ', async () => {
      
        // @ts-ignore
        // prismaMock.times.findMany.mockRejectedValue(input)

        const result = await copaController.buscarTimesVendores()
        expect(result).toBeDefined()
      })
})
