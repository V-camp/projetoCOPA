import { CopaController } from '../src/controller/copaController';
import { prismaMock } from '../singleton'
import input from "../temp/dadosParaSalvarNoDB.json"

describe("Teste do buscar Vencedores Dos MatchDays No Db", () => {
    afterEach(() => {
        jest.resetAllMocks();
    })

    const copaController = new CopaController()

    test('buscar Vencedores Dos MatchDays No Db... Teste ', async () => {
      
        // @ts-ignore
        // prismaMock.times.findMany.mockRejectedValue(input)

        const result = await copaController.buscarVencedoresDosMatchDaysNoDb()
        expect(result).toBeDefined()
      })
})
