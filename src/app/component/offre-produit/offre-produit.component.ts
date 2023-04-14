import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Offre } from 'src/app/entity/offre';
import { OffreProduit } from 'src/app/entity/offre-produit';
import { Product } from 'src/app/entity/product';
import { OffreProduitService } from 'src/app/service/offre-produit.service';
import { OffreService } from 'src/app/service/offre.service';
import { ProductService } from 'src/app/service/product.service';


@Component({
  selector: 'app-offre-produit',
  templateUrl: './offre-produit.component.html',
  styleUrls: ['./offre-produit.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class OffreProduitComponent {
  offreProduitDialog: boolean;

  deleteOffreProduitDialog: boolean = false;

  deleteOffresProduitDialog: boolean = false;

  offresProduit: OffreProduit[] = [];

  offreProduit: OffreProduit;

  selectedOffresProduit: OffreProduit[];

  offres: Offre[];


  filteredOffres: any[];

  selectedOffreAdvanced: any[];

  submitted: boolean;

  cols: any[];

  statut: any[];

  rowsPerPageOptions = [5, 10, 20];
  minDateValue: any;

  products: Product[];

  constructor(private offreProduitService: OffreProduitService,private offreService: OffreService, private productService: ProductService, private messageService: MessageService, private confirmationService: ConfirmationService) {

  }

  ngOnInit() {
    this.offreProduitService.getOffresProduit().subscribe({
      next: (res) => {
        this.offresProduit = res;
        console.log("list", this.offresProduit);
      },
      error: (err) => {
        console.log(err);
        this.offresProduit = [];
        console.log(this.minDateValue);
      }
    });

    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = res;
        console.log("list", this.products);
      },
      error: (err) => {
        console.log(err);
        this.products = [];
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
      { field: 'statut', header: 'Statut' },
    ];

    this.statut = [
      { label: 'Activer', value: 'activer' },
      { label: 'Desactiver', value: 'desactiver' },
    ];
  }

  openNew() {
    this.offreProduit = new OffreProduit();
    this.submitted = false;
    this.offreProduitDialog = true;
  }

  deleteSelectedOffresProduit() {
    this.deleteOffresProduitDialog = true;
  }

  editOffreProduit(offreProduit: OffreProduit) {
    this.offreProduit = { ...offreProduit };
    this.offreProduitDialog = true;
  }

  deleteOffreProduit(offreProduit: OffreProduit) {
    this.deleteOffreProduitDialog = true;
    this.offreProduit = { ...offreProduit };
  }

  confirmDeleteSelected() {
    const ids: number[] = this.selectedOffresProduit.flatMap((offreProduit: OffreProduit) => offreProduit.id)
    this.offreProduitService.deleteOffresProduit(ids).subscribe({
      next: () => {
        this.offresProduit = this.offresProduit.filter(val => !this.selectedOffresProduit.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Offerts Deleted', life: 3000 });
        this.selectedOffresProduit = [];
        this.deleteOffresProduitDialog = false;
      },
      error: (err: any) => {
        console.log(err, 'delete offerts failed');
      }
    });
  }

  confirmDelete() {
    this.deleteOffreProduitDialog = false;
    this.offreProduitService.deleteOffreProduit(this.offreProduit.id).subscribe({
      next: () => {
        this.offresProduit = this.offresProduit.filter(val => val.id !== this.offreProduit.id);
        console.log('delete successfuly');
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Offert Deleted', life: 3000 });
        this.offreProduit = new OffreProduit();
      },
      error: (err: any) => {
        console.log(err, 'delete failed');
      }
    });

  }

  hideDialog() {
    this.offreProduitDialog = false;
    this.submitted = false;
  }

  saveOffreProduit() {
    this.submitted = true;
    if (this.offreProduit.id) {
      this.offreProduitService.edit(this.offreProduit).subscribe({
        next: (res) => {
          this.offresProduit[this.findOffreProduitById(this.offreProduit.id)] = this.offreProduit;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'offert Updated', life: 3000 });
          this.offreProduitDialog = false;
        },
        error: (err: any) => {

          console.log(err, 'edit product-offert failed');
        }
      });
      // @ts-ignore


    } else {
      this.offreProduitService.save(this.offreProduit).subscribe({
        next: (res) => {
          this.offreProduitDialog = false;
          this.offresProduit.push(res);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Offert Created', life: 3000 });
        },
        error: (err: any) => {
          console.log(err, 'edit product-offert failed');
        }
      });
    }


  }

  findOffreProduitById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.offresProduit.length; i++) {
      if (this.offresProduit[i].id === id) {
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
