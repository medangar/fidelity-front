import { Component } from '@angular/core';
import { Carte } from 'src/app/entity/carte';
import { Client } from 'src/app/entity/client';
import { CarteService } from 'src/app/service/carte.service';
import { Table } from 'primeng/table/table';


@Component({
  selector: 'app-use-pts',
  templateUrl: './use-pts.component.html',
  styleUrls: ['./use-pts.component.scss']
  
})
export class UsePtsComponent {

  carte: Carte;
  cartes: Carte[] = [];
  client: Client;
  clients: Client[];
  filteredCartes: any[];
  nbPoints: number;
  carteIds:any[];
  constructor(private carteService: CarteService) {

  }
  ngOnInit() {
    this.carteService.getCartes().subscribe({
      next: (res) => {
        this.cartes = res;
        this.carte=new Carte();
        this.carte.name="";
        console.log("list", this.cartes);
        
      },
      
      error: (err) => {
        console.log(err);
        this.cartes = [];
      }
    });
    this.carteIds = [
      { label: 'Admin', value: 'admin' },
      { label: 'Client', value: 'client' },
      { label: 'Caissier', value: 'caissier' }
    ];
  }
  usePoints() { }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  filterCartes(event) {
    const filtered: Carte[] = [];
    const query = event.query;
    for (let i = 0; i < this.cartes.length; i++) {
      const client = this.cartes[i];
      if (this.carte.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(this.carte);
      }
    }
    this.filteredCartes = filtered;
  }

  getLabel(item: Carte): string {
    return `${item.name} `;
  }
}

