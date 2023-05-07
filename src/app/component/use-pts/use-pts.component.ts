import { Component, OnInit } from '@angular/core';
import { cA } from '@fullcalendar/core/internal-common';
import { Carte } from 'src/app/entity/carte';
import { Client } from 'src/app/entity/client';
import { CarteService } from 'src/app/service/carte.service';
import { HistoTransactionService } from 'src/app/service/histo-transaction.service';

@Component({
  selector: 'app-use-pts',
  templateUrl: './use-pts.component.html',
  styleUrls: ['./use-pts.component.scss']

})
export class UsePtsComponent implements OnInit {
  carte: Carte=new Carte();
  cartes: Carte[] = [];
  client: Client=new Client();
  clients: Client[];
  filteredCartes: any[];
  nbPoints: number;
  constructor(private carteService: CarteService,private histoTransactionService: HistoTransactionService ) {

  }
  ngOnInit() {
    this.carteService.getCartes().subscribe({
      next: (res) => {
        this.cartes = res;
        console.log("list", this.cartes);

      },


      error: (err) => {
        console.log(err);
        this.cartes = [];
      }
    });

  }
  usePoints() { 
    console.log(this.nbPoints);
    this.histoTransactionService.usePoint(this.carte.carteId,this.nbPoints).subscribe({
    
      next: (res) => {
        console.log("res", res);

      },


      error: (err) => {
        console.log(err);
      }
    });
  }

  doOnSelect(event: any){
    console.log( event );
    this.client=event.client;
  }

  filterCartes(event) {
    console.log(event);
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.cartes.length; i++) {
      const carte = this.cartes[i];
      console.log(query);

      if (query == "" || carte.carteId == query) {
        filtered.push(carte);
      }
    }
    this.filteredCartes = filtered;
  }

  getLabel(item: any): string {
    return item.carteId;
  }
}

