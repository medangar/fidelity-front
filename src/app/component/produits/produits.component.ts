import {Component, OnInit} from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import {Table} from 'primeng/table';
import { Product } from 'src/app/entity/product';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ProduitsComponent {



  productDialog: boolean;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[]=[]; 

    product: Product;

    selectedProducts: Product[];

    submitted: boolean;

    cols: any[];

    roles: any[];

    rowsPerPageOptions = [5, 10, 20];

    statuts: { label: string; value: string; }[];

    constructor(private productService: ProductService, private messageService: MessageService, private confirmationService: ConfirmationService) {
        
    }

    ngOnInit() {
        this.productService.getProducts().subscribe({
          next: (res) => {        
            this.products = res;
            console.log("list",this.products);                  
          },
          error: (err) => {
            console.log(err);
            this.products=[]; 
          }
        });

        this.cols = [
          { field: 'product', header: 'Product' },
          { field: 'price', header: 'Price' },
          { field: 'category', header: 'Category' },
          { field: 'statut', header: 'Statut' }
      ];

      this.statuts = [
        { label: 'active', value: 'true' },
        { label: 'desactive', value: 'false' }
    ];
    }

    openNew() {
        this.product = new Product();
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(client: Product) {
        this.product = { ...client };
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    confirmDeleteSelected() {
        const ids : number[] = this.selectedProducts.flatMap((product: Product) => product.id)        
        this.productService.deleteProducts(ids).subscribe({
            next: () => {
                this.products = this.products.filter(val => !this.selectedProducts.includes(val));
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
                this.selectedProducts = [];
                this.deleteProductsDialog = false;
            },
            error: (err: any) => {
              console.log(err,'delete products failed');
            }
          });
    }

    confirmDelete() {
        this.deleteProductDialog = false;       
        this.productService.deleteProduct(this.product.id).subscribe({
            next: () => {
              this.products = this.products.filter(val => val.id !== this.product.id);
              console.log('delete successfuly');
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'product Deleted', life: 3000 });
              this.product = new Product();
            },
            error: (err: any) => {
              console.log(err,'delete failed');
            }
          });      
        
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;
            if (this.product.id) {
                this.productService.edit(this.product).subscribe({
                    next: (res) => {
                        this.products[this.findProductById(this.product.id)] = this.product;
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'product Updated', life: 3000 });
                        this.productDialog = false;                     
                    },
                    error: (err: any) => {
                      
                      console.log(err,'edit product failed');
                    }
                  });
                // @ts-ignore
                
                
            } else {
                this.productService.save(this.product).subscribe({
                    next: (res) => {
                        this.productDialog = false;
                        this.products.push(res);
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
                },
                    error: (err: any) => {                      
                      console.log(err,'edit product failed');
                    }
                  });                
        
        }
    
  }

    findProductById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
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

