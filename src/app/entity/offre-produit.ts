import { Offre } from "./offre";
import { Product } from "./product";

export class OffreProduit { 
    id: number;
    name:string;
    valeur:number;
    statut:String;
    validite:Date;
    offre:Offre;
    produits:Product[];

}
