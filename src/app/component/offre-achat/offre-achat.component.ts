import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Offre } from 'src/app/entity/offre';
import { OffreAchat } from 'src/app/entity/offre-achat';
import { OffreAchatService } from 'src/app/service/offre-achat.service';
import { OffreService } from 'src/app/service/offre.service';

@Component({
  selector: 'app-offre-achat',
  templateUrl: './offre-achat.component.html',
  styleUrls: ['./offre-achat.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class OffreAchatComponent {
  offreAchatDialog: boolean;

  deleteOffreAchatDialog: boolean = false;

  deleteOffresAchatDialog: boolean = false;

  offresAchat: OffreAchat[] = [];

  offreAchat: OffreAchat;

  selectedOffresAchat: OffreAchat[];
  offres: Offre[];


    filteredOffres: any[];

    selectedOffreAdvanced: any[];


  submitted: boolean;

  cols: any[];

  statut: any[];

  rowsPerPageOptions = [5, 10, 20];
  minDateValue: any;


  constructor(private offreAchatService: OffreAchatService,private offreService: OffreService, private messageService: MessageService, private confirmationService: ConfirmationService) {

  }

  ngOnInit() {
    this.offreAchatService.getOffresAchat().subscribe({
      next: (res) => {
        this.offresAchat = res;
        console.log("list", this.offresAchat);
      },
      error: (err) => {
        console.log(err);
        this.offresAchat = [];
        console.log(this.minDateValue);
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
      { field: 'id', header: 'Id' },
      { field: 'name', header: 'Name' }, { field: 'name', header: 'Name' },
      { field: 'valeur', header: 'Valeur' },
      { field: 'validite', header: 'Validite' },
      { field: 'sommeMin', header: 'SommeMin' },
      { field: 'statut', header: 'Statut' },
    ];

    this.statut = [
      { label: 'Activer', value: 'activer' },
      { label: 'Desactiver', value: 'desactiver' },
    ];
  }

  openNew() {
    this.offreAchat = new OffreAchat();
    this.submitted = false;
    this.offreAchatDialog = true;
  }

  deleteSelectedOffresAchat() {
    this.deleteOffresAchatDialog = true;
  }

  editOffreAchat(offreAchat: OffreAchat) {
    this.offreAchat = { ...offreAchat };
    this.offreAchatDialog = true;
  }

  deleteOffreAchat(offreAchat: OffreAchat) {
    this.deleteOffreAchatDialog = true;
    this.offreAchat = { ...offreAchat };
  }

  confirmDeleteSelected() {
    const ids: number[] = this.selectedOffresAchat.flatMap((offreAchat: OffreAchat) => offreAchat.id)
    this.offreAchatService.deleteOffresAchat(ids).subscribe({
      next: () => {
        this.offresAchat = this.offresAchat.filter(val => !this.selectedOffresAchat.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Offerts Deleted', life: 3000 });
        this.selectedOffresAchat = [];
        this.deleteOffresAchatDialog = false;
      },
      error: (err: any) => {
        console.log(err, 'delete offerts failed');
      }
    });
  }

  confirmDelete() {
    this.deleteOffreAchatDialog = false;
    this.offreAchatService.deleteOffreAchat(this.offreAchat.id).subscribe({
      next: () => {
        this.offresAchat = this.offresAchat.filter(val => val.id !== this.offreAchat.id);
        console.log('delete successfuly');
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Offert Deleted', life: 3000 });
        this.offreAchat = new OffreAchat();
      },
      error: (err: any) => {
        console.log(err, 'delete failed');
      }
    });

  }

  hideDialog() {
    this.offreAchatDialog = false;
    this.submitted = false;
  }

  saveOffreAchat() {
    this.submitted = true;
    console.log(this.offreAchat);

    if (this.offreAchat.id) {
      console.log('edit');
      this.offreAchatService.edit(this.offreAchat).subscribe({
        next: (res) => {
          this.offresAchat[this.findOffreAchatById(this.offreAchat.id)] = this.offreAchat;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Offert Updated', life: 3000 });
          this.offreAchatDialog = false;
        },
        error: (err: any) => {

          console.log(err, 'edit offert failed');
        }
      });
      // @ts-ignore


    } else {
      console.log('new');
      this.offreAchatService.save(this.offreAchat).subscribe({
        next: (res) => {
          this.offreAchatDialog = false;
          this.offresAchat.push(res);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Offert Created', life: 3000 });
        },
        error: (err: any) => {
          console.log(err, 'edit offert failed');
        }
      });
    }

  }

  findOffreAchatById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.offresAchat.length; i++) {
      if (this.offresAchat[i].id === id) {
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
