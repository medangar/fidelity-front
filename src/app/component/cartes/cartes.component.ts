import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table/table';
import { Carte } from 'src/app/entity/carte';
import { Offre } from 'src/app/entity/offre';
import { CarteService } from 'src/app/service/carte.service';
import { OffreService } from 'src/app/service/offre.service';

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

    offres: Offre[];


    filteredOffres: any[];

    selectedOffreAdvanced: any[];

    selectedCartes: Carte[];

    submitted: boolean;

    cols: any[];

    statuts: any[];

    rowsPerPageOptions = [5, 10, 20];
    statut: { label: string; value: string; }[];

    constructor(private carteService: CarteService,private offreService: OffreService, private messageService: MessageService, private confirmationService: ConfirmationService) {
        
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

      this.offreService.getOffres().subscribe({
        next: (res) => {        
          this.offres = res;               
              
        },
        error: (err) => {
          console.log(err);
          this.offres=[]; 
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
      this.deleteCartesDialog = true;
  }

  editCarte(carte: Carte) { 
    console.log('for edit',carte) ;  
      this.carte = { ...carte };
      this.carteDialog = true;
  }

  deleteCarte(carte: Carte) {
      this.deleteCarteDialog = true;
      this.carte = { ...carte };
  }

  confirmDeleteSelected() {
    const ids : number[] = this.selectedCartes.flatMap((carte: Carte) => carte.carteId)        
        this.carteService.deleteCartes(ids).subscribe({
            next: () => {
                this.cartes = this.cartes.filter(val => !this.selectedCartes.includes(val));
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Cartes Deleted', life: 3000 });
                this.selectedCartes = [];
                this.deleteCartesDialog = false;
            },
            error: (err: any) => {
              console.log(err,'delete cartes failed');
            }
          });
  }

  confirmDelete() {
    this.deleteCarteDialog = false;       
    this.carteService.deleteCarte(this.carte.carteId).subscribe({
        next: () => {
          this.cartes = this.cartes.filter(val => val.carteId !== this.carte.carteId);
          console.log('delete successfuly');
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'carte Deleted', life: 3000 });
          this.carte = new Carte();
        },
        error: (err: any) => {
          console.log(err,'delete failed');
        }
      });      
  }

  hideDialog() {
      this.carteDialog = false;
      this.submitted = false;
  }

  saveCarte() {
      this.submitted = true;
      console.log(this.carte);
          if (this.carte.carteId) {
            console.log('edit');
            this.carteService.editCarte(this.carte).subscribe({
                next: (res) => {
                    this.cartes[this.findCarteById(this.carte.carteId)] = this.carte;
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Card Updated', life: 3000 });
                    this.carteDialog = false;                     
                },
                error: (err: any) => {
                  
                  console.log(err,'edit Card failed');
                }
              });
          } else {
              
            console.log('new');
            this.carteService.saveCarte(this.carte).subscribe({
                next: (res) => {
                    this.carteDialog = false;
                    this.cartes.push(res);
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Card Created', life: 3000 });
              },
                error: (err: any) => {                      
                  console.log(err,'Save Card failed');
                }
              });
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


  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  filterOffres(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.offres.length; i++) {
        const offre = this.offres[i];
        if (offre.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(offre);
        }
    }

    this.filteredOffres = filtered;
}
}

