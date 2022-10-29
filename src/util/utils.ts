import { IdadosTime } from 'model/interfaces/DadosTime';

export class Utils {
    public timeVencedor (timesJogando: Array<string>): string {
        const gerarIndexAleatorio = Math.floor(Math.random() * timesJogando.length);

        return timesJogando[gerarIndexAleatorio];
    }
}