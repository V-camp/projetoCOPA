export class CopaController {
    public async apresentarTimes(timeEmJogo: any): Promise<Array<object>> {
        return [
            { Time: "Brasil" },
            { Time: "EUA" }
        ]
    }

    public async cadastrarTime(cadastroTime: any): Promise<object> {
        return { message: "salvo" }
    }

    public async atualizarTime(time: any): Promise<object> {
        return { Time: "Brasil", etapa: "final" }
    }

    public async eliminarTime(timePerdedor: any): Promise<object> {
        return { Time: "Eua", Venceu: false, Eliminado: true  }
    }
}
