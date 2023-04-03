import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import {Table} from 'primeng/table';
import { Offre } from 'src/app/entity/offre';
import { OffreService } from 'src/app/service/offre.service';
@Component({
  selector: 'app-offres',
  templateUrl: './offres.component.html',
  styleUrls: ['./offres.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class OffresComponent {
  offreDialog: boolean;

    deleteOffreDialog: boolean = false;

    deleteOffresDialog: boolean = false;

    offres: Offre[]=[]; 

    offre: Offre;

    selectedOffres: Offre[];

    submitted: boolean;

    cols: any[];

    statut: any[];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private offreService: OffreService, private messageService: MessageService, private confirmationService: ConfirmationService) {
        
    }

    ngOnInit() {
        this.offreService.getOffres().subscribe({
          next: (res) => {        
            this.offres = res;
            console.log("list",this.offres);                  
          },
          error: (err) => {
            console.log(err);
            this.offres=[]; 
          }
        });

        this.cols = [
            { field: 'id', header: 'Id' },
            { field: 'name', header: 'Name' },
            { field: 'validite', header: 'Validite' },
            { field: 'statut', header: 'statut' },
        ];

        this.statut = [
            { label: 'Active', value: 'active' },
            { label: 'Non', value: 'non' },
        ];
    }

    openNew() {
        this.offre = new Offre();
        this.submitted = false;
        this.offreDialog = true;
    }

    deleteSelectedOffres() {
        this.deleteOffresDialog = true;
    }

    editOffre(offre: Offre) {
        this.offre = { ...offre };
        this.offreDialog = true;
    }

    deleteOffre(offre: Offre) {
        this.deleteOffreDialog = true;
        this.offre = { ...offre };
    }

    confirmDeleteSelected() {
        const ids : number[] = this.selectedOffres.flatMap((offre: Offre) => offre.id)        
        this.offreService.deleteOffres(ids).subscribe({
            next: () => {
                this.offres = this.offres.filter(val => !this.selectedOffres.includes(val));
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Offerts Deleted', life: 3000 });
                this.selectedOffres = [];
                this.deleteOffresDialog = false;
          },
            error: (err: any) => {
              console.log(err,'delete offerts failed');
            }
          });
    }

    confirmDelete() {
        this.deleteOffreDialog = false;       
        this.offreService.deleteOffre(this.offre.id).subscribe({
            next: () => {
              this.offres = this.offres.filter(val => val.id !== this.offre.id);
              console.log('delete successfuly');
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Offert Deleted', life: 3000 });
              this.offre = new Offre();
            },
            error: (err: any) => {
              console.log(err,'delete failed');
            }
          });      
        
    }

    hideDialog() {
        this.offreDialog = false;
        this.submitted = false;
    }

    saveOffre() {
        this.submitted = true;
        console.log(this.offre);
        this.offre.validite = null;
        
            if (this.offre.id) {
              console.log('edit');
                this.offreService.edit(this.offre).subscribe({
                    next: (res) => {
                        this.offres[this.findOffreById(this.offre.id)] = this.offre;
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Offert Updated', life: 3000 });
                        this.offreDialog = false;                     
                    },
                    error: (err: any) => {
                      
                      console.log(err,'edit offert failed');
                    }
                  });
                // @ts-ignore
                
                
            } else {
              console.log('new');
                this.offreService.save(this.offre).subscribe({
                    next: (res) => {
                        this.offreDialog = false;
                        this.offres.push(res);
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Offert Created', life: 3000 });
                  },
                    error: (err: any) => {                      
                      console.log(err,'edit offert failed');
                    }
                  });                
            }
          
        
    }

    findOffreById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.offres.length; i++) {
            if (this.offres[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

}
