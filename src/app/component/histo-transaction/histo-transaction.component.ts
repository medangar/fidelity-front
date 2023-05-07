import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { HistoTransaction } from 'src/app/entity/histo-transaction';
import { HistoTransactionService } from 'src/app/service/histo-transaction.service';

@Component({
    selector: 'app-histo-transaction',
    templateUrl: './histo-transaction.component.html',
    styleUrls: ['./histo-transaction.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class HistoTransactionComponent {
    histoTransactionDialog: boolean;

    deleteHistoTransactionDialog: boolean = false;

    deleteHistoTransactionsDialog: boolean = false;

    histoTransactions: HistoTransaction[] = [];

    histoTransaction: HistoTransaction;

    selectedHistoTransactions: HistoTransaction[];

    submitted: boolean;

    cols: any[];

    types: any[];

    rowsPerPageOptions = [5, 10, 20];

    isAdmin:boolean;
  idClient:number;

    constructor(private histoTransactionService: HistoTransactionService, private messageService: MessageService, private confirmationService: ConfirmationService) {

    }

    ngOnInit() {
        this.isAdmin =(localStorage.getItem("isAdmin")=="true");
    this.idClient=Number(localStorage.getItem("id"));
    if(this.isAdmin){
        this.histoTransactionService.getHistoTransactions().subscribe({
            next: (res) => {
                this.histoTransactions = res;
                console.log(res);
            },
            error: (err) => {
                console.log(err);
                this.histoTransactions = [];
            }
        });
    }else{
        this.histoTransactionService.getHistoTransactionsByClient(this.idClient).subscribe({
            next: (res) => {
                this.histoTransactions = res;
                console.log(res);
            },
            error: (err) => {
                console.log(err);
                this.histoTransactions = [];
            }
        });
    }

        this.cols = [
            { field: 'id', header: 'id' },
            { field: 'soldeInit', header: 'SoldeInit' },
            { field: 'soldeFnl', header: 'SoldeFnl' },
            { field: 'dateTransaction', header: 'DateTransaction' },
            { field: 'typeTransaction', header: 'TypeTransaction' }
        ];

        this.types = [
            { label: 'Debiteur', value: 'debiteur' },
            { label: 'Crediteur', value: 'crediteur' },
        ];
    }

    openNew() {
        this.histoTransaction = new HistoTransaction();
        this.submitted = false;
        this.histoTransactionDialog = true;
    }

    deleteSelectedHistoTransactions() {
        this.deleteHistoTransactionDialog = true;
    }

    editHistoTransaction(histoTransaction: HistoTransaction) {
        this.histoTransaction = { ...histoTransaction };
        this.histoTransactionDialog = true;
    }

    deleteHistoTransaction(histoTransaction: HistoTransaction) {
        this.deleteHistoTransactionDialog = true;
        this.histoTransaction = { ...histoTransaction };
    }

    confirmDeleteSelected() {
        this.deleteHistoTransactionsDialog = false;
        this.histoTransactions = this.histoTransactions.filter(val => !this.selectedHistoTransactions.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'HistoTransactions Deleted', life: 3000 });
        this.selectedHistoTransactions = [];
    }

    confirmDelete() {
        this.deleteHistoTransactionDialog = false;
        this.histoTransactions = this.histoTransactions.filter(val => val.id !== this.histoTransaction.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'histoTransaction Deleted', life: 3000 });
        this.histoTransaction = new HistoTransaction();
    }

    hideDialog() {
        this.histoTransactionDialog = false;
        this.submitted = false;
    }

    saveHistoTransaction() {
        this.submitted = true;

        if (this.histoTransaction.id) {
            if (this.histoTransaction.id) {
                // @ts-ignore
                this.histoTransactions[this.findHistoTransactiontById(this.histoTransaction.id)] = this.histoTransaction;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'histoTransaction Updated', life: 3000 });
            } else {
                this.histoTransaction.id = this.createId();
                // @ts-ignore
                this.histoTransactions.push(this.histoTransaction);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'histoTransaction Created', life: 3000 });
            }

            this.histoTransactions = [...this.histoTransactions];
            this.histoTransactionDialog = false;
            this.histoTransaction = new HistoTransaction();
        }
    }

    findClientById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.histoTransactions.length; i++) {
            if (this.histoTransactions[i].id == id) {
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
