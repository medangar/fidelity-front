import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table/table';
import { Carte } from 'src/app/entity/carte';
import { CarteService } from 'src/app/service/carte.service';

@Component({
  selector: 'app-cartes',
  templateUrl: './cartes.component.html',
  styleUrls: ['./cartes.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class CartesComponent {
  carteDialog: boolean;

    deleteCarteDialog: boolean = false;

    deleteCartesDialog: boolean = false;

    cartes: Carte[]=[]; 

    carte: Carte;

    selectedCartes: Carte[];

    submitted: boolean;

    cols: any[];

    statuts: any[];

    rowsPerPageOptions = [5, 10, 20];
    statut: { label: string; value: string; }[];
    constructor(private carteService: CarteService, private messageService: MessageService, private confirmationService: ConfirmationService) {
        
    }
    
    ngOnInit() {
      this.carteService.getCartes().subscribe({
        next: (res) => {                    
          this.cartes = res; 
                
        },
        error: (err) => {
          console.log(err);
          this.cartes=[]; 
        }
      });

      this.cols = [
          { field: 'carteId', header: 'CarteId' },
          { field: 'datevalidite', header: 'DateValidite' },
          { field: 'nbPoints', header: 'NbPoints' },
          { field: 'derniereVisite', header: 'DerniereVisite' },
          { field: 'statut', header: 'Statut' }
      ];

      this.statuts = [
          { label: 'Activer', value: 'activer' },
          { label: 'Desactiver', value: 'desactiver' },
      ];
  }

  openNew() {
      this.carte = new Carte();
      this.submitted = false;
      this.carteDialog = true;
  }

  deleteSelectedCartes() {
      this.deleteCarteDialog = true;
  }

  editCarte(carte: Carte) {
      this.carte = { ...carte };
      this.carteDialog = true;
  }

  deleteCarte(carte: Carte) {
      this.deleteCarteDialog = true;
      this.carte = { ...carte };
  }

  confirmDeleteSelected() {
      this.deleteCarteDialog = false;
      this.cartes = this.cartes.filter(val => !this.selectedCartes.includes(val));
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'cards Deleted', life: 3000 });
      this.selectedCartes = [];
  }

  confirmDelete() {
      this.deleteCarteDialog = false;
      this.cartes = this.cartes.filter(val => val.carteId !== this.carte.carteId);
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'card Deleted', life: 3000 });
      this.carte = new Carte();
  }

  hideDialog() {
      this.carteDialog = false;
      this.submitted = false;
  }

  saveCarte() {
      this.submitted = true;

      if (this.carte.carteId) {
          if (this.carte.carteId) {
              // @ts-ignore
              this.cartes[this.findCarteById(this.carte.carteId)] = this.carte;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'card Updated', life: 3000 });
          } else {
              this.carte.carteId = this.createId();
              // @ts-ignore
              this.cartes.push(this.carte);
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'card Created', life: 3000 });
          }

          this.cartes = [...this.cartes];
          this.carteDialog = false;
          this.carte = new Carte();
      }
  }

  findCarteById(carteId: number): number {
      let index = -1;
      for (let i = 0; i < this.cartes.length; i++) {
          if (this.cartes[i].carteId === carteId) {
              index = i;
              break;
          }
      }

      return index;
  }

  createId(): number {
  return Math.random();
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

}

