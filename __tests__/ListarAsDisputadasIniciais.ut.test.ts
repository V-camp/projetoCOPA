import { CopaController } from '../src/controller/copaController';
import { prismaMock } from '../singleton'
import input from "../temp/dadosParaSalvarNoDB.json"

describe("Teste do listar as disputadas iniciais", () => {
    afterEach(() => {
        jest.resetAllMocks();
    })

    const copaController = new CopaController()

    test('listar as disputadas iniciais... Teste ', async () => {
      
        // @ts-ignore
        // prismaMock.times.findMany.mockRejectedValue(input)

        const result = await copaController.listarAsDisputadasIniciais()
        expect(result).toBeDefined()
      })
})
