import { IdadosTime } from 'model/interfaces/DadosTime';

export class Utils {
    public timeVencedor (timesJogando: Array<string>): string {
        console.log(timesJogando);
        
        const gerarIndexAleatorio = Math.floor(Math.random() * 4);

        return timesJogando[gerarIndexAleatorio];
    }
}
