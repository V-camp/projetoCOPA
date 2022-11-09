import { IGruposTimes } from 'model/interfaces/GruposDosTimes';
import { IMatchDay } from 'model/interfaces/MatchDay';

export class Utils {
    public criarTabelaMatchDay(gruposTimes: IGruposTimes) {
        const day1: IMatchDay = {
            disputaGrupoA: [[gruposTimes.timesNoGrupoA[0].nomedopais, gruposTimes.timesNoGrupoA[1].nomedopais],
            [gruposTimes.timesNoGrupoA[2].nomedopais, gruposTimes.timesNoGrupoA[3].nomedopais]],

            disputaGrupoB: [[gruposTimes.timesNoGrupoB[0].nomedopais, gruposTimes.timesNoGrupoB[1].nomedopais],
            [gruposTimes.timesNoGrupoB[2].nomedopais, gruposTimes.timesNoGrupoB[3].nomedopais]],

            disputaGrupoC: [[gruposTimes.timesNoGrupoC[0].nomedopais, gruposTimes.timesNoGrupoC[1].nomedopais],
            [gruposTimes.timesNoGrupoC[2].nomedopais, gruposTimes.timesNoGrupoC[3].nomedopais]],

            disputaGrupoD: [[gruposTimes.timesNoGrupoD[0].nomedopais, gruposTimes.timesNoGrupoD[1].nomedopais],
            [gruposTimes.timesNoGrupoD[2].nomedopais, gruposTimes.timesNoGrupoD[3].nomedopais]],

            disputaGrupoE: [[gruposTimes.timesNoGrupoE[0].nomedopais, gruposTimes.timesNoGrupoE[1].nomedopais],
            [gruposTimes.timesNoGrupoE[2].nomedopais, gruposTimes.timesNoGrupoE[3].nomedopais]],

            disputaGrupoF: [[gruposTimes.timesNoGrupoF[0].nomedopais, gruposTimes.timesNoGrupoF[1].nomedopais],
            [gruposTimes.timesNoGrupoF[2].nomedopais, gruposTimes.timesNoGrupoF[3].nomedopais]],

            disputaGrupoG: [[gruposTimes.timesNoGrupoG[0].nomedopais, gruposTimes.timesNoGrupoG[1].nomedopais],
            [gruposTimes.timesNoGrupoG[2].nomedopais, gruposTimes.timesNoGrupoG[3].nomedopais]],

            disputaGrupoH: [[gruposTimes.timesNoGrupoH[0].nomedopais, gruposTimes.timesNoGrupoH[1].nomedopais],
            [gruposTimes.timesNoGrupoH[2].nomedopais, gruposTimes.timesNoGrupoH[3].nomedopais]],
        };

        const day2: IMatchDay = {
            disputaGrupoA: [[gruposTimes.timesNoGrupoA[0].nomedopais, gruposTimes.timesNoGrupoA[2].nomedopais],
            [gruposTimes.timesNoGrupoA[3].nomedopais, gruposTimes.timesNoGrupoA[1].nomedopais]],

            disputaGrupoB: [[gruposTimes.timesNoGrupoB[0].nomedopais, gruposTimes.timesNoGrupoB[2].nomedopais],
            [gruposTimes.timesNoGrupoB[3].nomedopais, gruposTimes.timesNoGrupoB[1].nomedopais]],

            disputaGrupoC: [[gruposTimes.timesNoGrupoC[0].nomedopais, gruposTimes.timesNoGrupoC[2].nomedopais],
            [gruposTimes.timesNoGrupoC[3].nomedopais, gruposTimes.timesNoGrupoC[1].nomedopais]],

            disputaGrupoD: [[gruposTimes.timesNoGrupoD[0].nomedopais, gruposTimes.timesNoGrupoD[2].nomedopais],
            [gruposTimes.timesNoGrupoD[3].nomedopais, gruposTimes.timesNoGrupoD[1].nomedopais]],

            disputaGrupoE: [[gruposTimes.timesNoGrupoE[0].nomedopais, gruposTimes.timesNoGrupoE[2].nomedopais],
            [gruposTimes.timesNoGrupoE[3].nomedopais, gruposTimes.timesNoGrupoE[1].nomedopais]],

            disputaGrupoF: [[gruposTimes.timesNoGrupoF[0].nomedopais, gruposTimes.timesNoGrupoF[2].nomedopais],
            [gruposTimes.timesNoGrupoF[3].nomedopais, gruposTimes.timesNoGrupoF[1].nomedopais]],

            disputaGrupoG: [[gruposTimes.timesNoGrupoG[0].nomedopais, gruposTimes.timesNoGrupoG[2].nomedopais],
            [gruposTimes.timesNoGrupoG[3].nomedopais, gruposTimes.timesNoGrupoG[1].nomedopais]],

            disputaGrupoH: [[gruposTimes.timesNoGrupoH[0].nomedopais, gruposTimes.timesNoGrupoH[2].nomedopais],
            [gruposTimes.timesNoGrupoH[3].nomedopais, gruposTimes.timesNoGrupoH[1].nomedopais]],
        };

        const day3: IMatchDay = {
            disputaGrupoA: [[gruposTimes.timesNoGrupoA[3].nomedopais, gruposTimes.timesNoGrupoA[0].nomedopais],
            [gruposTimes.timesNoGrupoA[1].nomedopais, gruposTimes.timesNoGrupoA[2].nomedopais]],

            disputaGrupoB: [[gruposTimes.timesNoGrupoB[3].nomedopais, gruposTimes.timesNoGrupoB[0].nomedopais],
            [gruposTimes.timesNoGrupoB[1].nomedopais, gruposTimes.timesNoGrupoB[2].nomedopais]],

            disputaGrupoC: [[gruposTimes.timesNoGrupoC[3].nomedopais, gruposTimes.timesNoGrupoC[0].nomedopais],
            [gruposTimes.timesNoGrupoC[1].nomedopais, gruposTimes.timesNoGrupoC[2].nomedopais]],

            disputaGrupoD: [[gruposTimes.timesNoGrupoD[3].nomedopais, gruposTimes.timesNoGrupoD[0].nomedopais],
            [gruposTimes.timesNoGrupoD[1].nomedopais, gruposTimes.timesNoGrupoD[2].nomedopais]],

            disputaGrupoE: [[gruposTimes.timesNoGrupoE[3].nomedopais, gruposTimes.timesNoGrupoE[0].nomedopais],
            [gruposTimes.timesNoGrupoE[1].nomedopais, gruposTimes.timesNoGrupoE[2].nomedopais]],

            disputaGrupoF: [[gruposTimes.timesNoGrupoF[3].nomedopais, gruposTimes.timesNoGrupoF[0].nomedopais],
            [gruposTimes.timesNoGrupoF[1].nomedopais, gruposTimes.timesNoGrupoF[2].nomedopais]],

            disputaGrupoG: [[gruposTimes.timesNoGrupoG[3].nomedopais, gruposTimes.timesNoGrupoG[0].nomedopais],
            [gruposTimes.timesNoGrupoG[1].nomedopais, gruposTimes.timesNoGrupoG[2].nomedopais]],

            disputaGrupoH: [[gruposTimes.timesNoGrupoH[3].nomedopais, gruposTimes.timesNoGrupoH[0].nomedopais],
            [gruposTimes.timesNoGrupoH[1].nomedopais, gruposTimes.timesNoGrupoH[2].nomedopais]],
        };

        return {
            day1,
            day2,
            day3,
        };
    }
}
