import { ITimesFinais } from "./interfaces/InputTimeFinais";
//@ts-ignore
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class TimeInputFinais implements ITimesFinais {
    idPais: number;
    qtdGol: number;
    qtdCartaoAmarelo?: number | undefined;
    qtdCartaoVermelho?: number | undefined;

    constructor(idPais:number, qtdgol:number, qtdcartaovermelho:number, qtdcartaoamarelo:number) {
        this.idPais = idPais;
        this.qtdGol = qtdgol;
        this.qtdCartaoVermelho = qtdcartaovermelho;
        this.qtdCartaoAmarelo = qtdcartaoamarelo;
    }
}


