import { Offre } from "./offre";

export class Carte {
  carteId: number;
  dateValidite:Date;
  nbPoints:GLfloat;
  derniereVisite:Date;
  statut:String;
  offre:Offre;
}
