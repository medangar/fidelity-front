import { Component, OnInit } from '@angular/core';
import { Carte } from 'src/app/entity/carte';
import { Client } from 'src/app/entity/client';
import { CarteService } from 'src/app/service/carte.service';
import { HistoTransactionService } from 'src/app/service/histo-transaction.service';
import { Product } from 'src/app/entity/product';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-add-pts',
  templateUrl: './add-pts.component.html',
  styleUrls: ['./add-pts.component.scss']
})
export class AddPtsComponent implements OnInit {
  products: Product[] = [];
  selectedProducts: Product[]=[];
  carte: Carte = new Carte();
  cartes: Carte[] = [];
  client: Client = new Client();
  clients: Client[];
  filteredCartes: any[];
  totaleCmd: number;
  filteredProducts: any[];
  constructor(private carteService: CarteService, private histoTransactionService: HistoTransactionService, private productService: ProductService) {
  }
  ngOnInit() {
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
  addPoints() { 
    this.histoTransactionService.addPoint(this.totaleCmd,this.carte.carteId,this.selectedProducts.map(product=>product.id)).subscribe({
    
      next: (res) => {
        console.log("res", res);

      },


      error: (err) => {
        console.log(err);
      }
    });
  }
  doOnSelect(event: any) {
    console.log(event);
    this.client = event.client;
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
