import { IdadosTime } from "./DadosTime";
import { ITimesDadosCompletos } from "./TimeDadosCompletos";

export interface IGruposTimes {
    timesNoGrupoA: Array<IdadosTime | ITimesDadosCompletos>,
    timesNoGrupoB: Array<IdadosTime | ITimesDadosCompletos>;
    timesNoGrupoC: Array<IdadosTime | ITimesDadosCompletos>;
    timesNoGrupoD: Array<IdadosTime | ITimesDadosCompletos>;
    timesNoGrupoE: Array<IdadosTime | ITimesDadosCompletos>;
    timesNoGrupoF: Array<IdadosTime | ITimesDadosCompletos>;
    timesNoGrupoG: Array<IdadosTime | ITimesDadosCompletos>;
    timesNoGrupoH: Array<IdadosTime | ITimesDadosCompletos>;
}