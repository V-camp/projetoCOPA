import { CopaController } from '../src/controller/copaController';
import { prismaMock } from '../singleton'
import input from "../temp/dadosParaSalvarNoDB.json"

describe("Teste do timesEmCadaGrupo", () => {
    afterEach(() => {
        jest.resetAllMocks();
    })

    const copaController = new CopaController()

    test('TimesEmCadaGrupo... Teste ', async () => {
      
        // @ts-ignore
        // await prismaMock.times.create.mockResolvedValue(input[0])
        // @ts-ignore
        // await prismaMock.times.findMany.mockResolvedValue({input})

        // const result = await copaController.cadastrarTodosTimes(input)
        // console.log(result);

        const result = await copaController.timesEmCadaGrupo(input)

        expect(result).toBeDefined()
      })
})
