export class CopaController {
    public async apresentarTimes(timeEmJogo): Promise<Array<object>> {
        return [
            { Time: "Brasil" },
            { Time: "EUA" }
        ]
    }

    public async cadastrarTime(cadastroTime): Promise<object> {
        return { message: "salvo" }
    }

    public async atualizarTime(time): Promise<object> {
        return { Time: "Brasil", etapa: "final" }
    }

    public async eliminarTime(timePerdedor): Promise<object> {
        return { Time: "Eua", Venceu: false, Eliminado: true  }
    }
}
