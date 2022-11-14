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

export interface IOutputFinail {
    proximaEtapa: string,
    campeao: Array<ITimesFinais>
    segundo: Array<ITimesFinais>
}

export interface IOutputTerceiro {
    proximaEtapa: string,
    terceiro: Array<ITimesFinais>
}
