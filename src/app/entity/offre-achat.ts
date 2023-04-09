import { Offre } from "./offre";

export class OffreAchat {
    id: number;
    name:string;
    sommeMin: number;
    valeur:number;
    statut:string;
    validite:Date;
    offre:Offre;
}
