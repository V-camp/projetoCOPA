import { tipoDePartidasEnum } from "./enums/TipoDePartidas";
import { IInputFinais, IOutputFinais } from "./interfaces/Finais";
import { ITimesFinais } from "./interfaces/InputTimeFinais";

export class FinaisInput implements IInputFinais{
    tipoDeQualificacao: tipoDePartidasEnum;
    times: ITimesFinais[];
    constructor(tipoDeQualificacao: tipoDePartidasEnum, times: ITimesFinais[]) {
        this.tipoDeQualificacao = tipoDeQualificacao;
        this.times = times;
    }

}

export class FinaisOutput implements IOutputFinais{
    proximaEtapa: tipoDePartidasEnum;
    times: ITimesFinais[];
    constructor(proximaEtapa: tipoDePartidasEnum, times: ITimesFinais[]) {
        this.proximaEtapa = proximaEtapa;
        this.times = times;
    }
}
