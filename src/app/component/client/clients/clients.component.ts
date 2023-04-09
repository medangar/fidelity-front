import {Component, OnInit} from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import {Table} from 'primeng/table';
import { Client } from 'src/app/entity/client';
import { ClientService } from 'src/app/service/client.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ClientsComponent {

  clientDialog: boolean;

    deleteClientDialog: boolean = false;

    deleteClientsDialog: boolean = false;

    clients: Client[]=[]; 

    client: Client;

    selectedClients: Client[];

    submitted: boolean;

    cols: any[];

    roles: any[];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private clientService: ClientService, private messageService: MessageService, private confirmationService: ConfirmationService) {
        
    }

    ngOnInit() {
        this.clientService.getClients().subscribe({
          next: (res) => {        
            this.clients = res;
            console.log("list",this.clients);                  
          },
          error: (err) => {
            console.log(err);
            this.clients=[]; 
          }
        });

        this.cols = [
            { field: 'identifiant', header: 'Identifiant' },
            { field: 'nom', header: 'Nom' },
            { field: 'prenom', header: 'Prénom' },
            { field: 'email', header: 'Email' },
            { field: 'role', header: 'Role' }
        ];

        this.roles = [
            { label: 'Admin', value: 'admin' },
            { label: 'Client', value: 'client' },
            { label: 'Caissier', value: 'caissier' }
        ];
    }

    openNew() {
        this.client = new Client();
        this.submitted = false;
        this.clientDialog = true;
    }

    deleteSelectedClients() {
        this.deleteClientsDialog = true;
    }

    editClient(client: Client) {
        this.client = { ...client };
        this.clientDialog = true;
    }

    deleteClient(client: Client) {
        this.deleteClientDialog = true;
        this.client = { ...client };
    }

    confirmDeleteSelected() {
        const ids : number[] = this.selectedClients.flatMap((client: Client) => client.id)        
        this.clientService.deleteClients(ids).subscribe({
            next: () => {
                this.clients = this.clients.filter(val => !this.selectedClients.includes(val));
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Clients Deleted', life: 3000 });
                this.selectedClients = [];
                this.deleteClientsDialog = false;
             },
            error: (err: any) => {
              console.log(err,'delete clients failed');
            }
          });
    }

    confirmDelete() {
        this.deleteClientDialog = false;       
        this.clientService.deleteClient(this.client.id).subscribe({
            next: () => {
              this.clients = this.clients.filter(val => val.id !== this.client.id);
              console.log('delete successfuly');
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'client Deleted', life: 3000 });
              this.client = new Client();
            },
            error: (err: any) => {
              console.log(err,'delete failed');
            }
          });      
        
    }

    hideDialog() {
        this.clientDialog = false;
        this.submitted = false;
    }

    saveClient() {
        this.submitted = true;

        if (this.client.nom?.trim()) {
            if (this.client.id) {
                this.clientService.edit(this.client).subscribe({
                    next: (res) => {
                        this.clients[this.findClientById(this.client.id)] = this.client;
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'client Updated', life: 3000 });
                        this.clientDialog = false;                     
                    },
                    error: (err: any) => {
                      
                      console.log(err,'edit cleint failed');
                    }
                  });
                // @ts-ignore
                
                
            } else {
                this.client.password = "changeme";
                this.clientService.save(this.client).subscribe({
                    next: (res) => {
                        this.clientDialog = false;
                        this.clients.push(res);
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Client Created', life: 3000 });
                    },
                    error: (err: any) => {                      
                      console.log(err,'edit client failed');
                    }
                  });                
            }
           // this.clients = [...this.clients];
           
            //this.client = new Client();
        }
    }

    findClientById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.clients.length; i++) {
            if (this.clients[i].id === id) {
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
