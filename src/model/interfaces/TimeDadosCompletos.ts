import { timesEmJogo } from './../enums/TimesEmJogo';

export interface ITimesDadosCompletos{
    id: number,               
    nomedopais: string,         
    qtddejogadores: number,      
    treinador: string,           
    capitao: string             
    estaemjogo: string          
    grupopertencente: string    
    qtdgol: number              
    qtdcartaovermelho: number   
    qtdcartaoamarelo: number    
    pontuacao: number           
    tipodepartida: string       
}
