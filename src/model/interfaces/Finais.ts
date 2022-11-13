import { ITimesFinais } from './InputTimeFinais';
import { tipoDePartidasEnum } from '../enums/TipoDePartidas';

export interface IInputFinais {
    tipoDeQualificacao: tipoDePartidasEnum,
    times: Array<ITimesFinais>
}

export interface IOutputFinais {
    proximaEtapa: string,
    times: Array<ITimesFinais>
}
