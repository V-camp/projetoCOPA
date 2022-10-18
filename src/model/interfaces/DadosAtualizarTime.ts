import { timesEmJogo } from "model/enums/TimesEmJogo";

export interface dadosAtualizarTime { 
    id: string,
    nomeDoPais: string,
    qtdDeJogadores: number,
    lider: string,
    emJogos: timesEmJogo,
}