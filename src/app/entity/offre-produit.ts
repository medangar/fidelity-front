import { Product } from "./product";

export class OffreProduit { 
    id: number;
    name:string;
    valeur:number;
    statut:String;
    validite:Date;
    produits:Product[];

}
