import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { OffreAchat } from 'src/app/entity/offre-achat';
import { OffreAchatService } from 'src/app/service/offre-achat.service';

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

  offresAchat: OffreAchat[]=[]; 

  offreAchat: OffreAchat;

  selectedOffresAchat: OffreAchat[];

  submitted: boolean;

  cols: any[];

  statut: any[];

  rowsPerPageOptions = [5, 10, 20];

  constructor(private offreAchatService: OffreAchatService, private messageService: MessageService, private confirmationService: ConfirmationService) {
      
  }

  ngOnInit() {
      this.offreAchatService.getOffresAchat().subscribe({
        next: (res) => {        
          this.offresAchat = res;
          console.log("list",this.offresAchat);                  
        },
        error: (err) => {
          console.log(err);
          this.offresAchat=[]; 
        }
      });

      this.cols = [
          { field: 'id', header: 'Id' },
          { field: 'name', header: 'Name' },{ field: 'name', header: 'Name' },
          { field: 'valeur', header: 'Valeur' },
          { field: 'validite', header: 'Validite' },
          { field: 'sommeMin', header: 'SommeMin' },
          { field: 'statut', header: 'Statut' },
      ];

      this.statut = [
          { label: 'Active', value: 'active' },
          { label: 'Non', value: 'non' },
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
      const ids : number[] = this.selectedOffresAchat.flatMap((offreAchat: OffreAchat) => offreAchat.id)        
      this.offreAchatService.deleteOffresAchat(ids).subscribe({
          next: () => {
              this.offresAchat = this.offresAchat.filter(val => !this.selectedOffresAchat.includes(val));
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Offerts Deleted', life: 3000 });
              this.selectedOffresAchat = [];
              this.deleteOffresAchatDialog = false;
        },
          error: (err: any) => {
            console.log(err,'delete offerts failed');
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
            console.log(err,'delete failed');
          }
        });      
      
  }

  hideDialog() {
      this.offreAchatDialog = false;
      this.submitted = false;
  }

  saveOffreAchat() {
      this.submitted = true;

      if (this.offreAchat.id) {
          if (this.offreAchat.id) {
              this.offreAchatService.edit(this.offreAchat).subscribe({
                  next: (res) => {
                      this.offresAchat[this.findOffreAchatById(this.offreAchat.id)] = this.offreAchat;
                      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'offert Updated', life: 3000 });
                      this.offreAchatDialog = false;                     
                  },
                  error: (err: any) => {
                    
                    console.log(err,'edit offert failed');
                  }
                });
              // @ts-ignore
              
              
          } else {
              this.offreAchatService.save(this.offreAchat).subscribe({
                  next: (res) => {
                      this.offreAchatDialog = false;
                      this.offresAchat.push(res);
                      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Offert Created', life: 3000 });
                },
                  error: (err: any) => {                      
                    console.log(err,'edit offert failed');
                  }
                });                
          }
        
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


}
