import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../entity/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private url ='/api/produit';

  constructor(private httpClient: HttpClient) { }

  getProducts() {
    return this.httpClient.get<Product>(this.url)
    .pipe(catchError(this.handleError));
  }

  save(product:Product){
    console.log(product);
    return this.httpClient.post<Product>(this.url,product)
    .pipe(catchError(this.handleError));
  }
  edit(product:Product){
    return this.httpClient.put<Product>(this.url,product)
    .pipe(catchError(this.handleError));
  }

  deleteProduct(id:number){
    return this.httpClient.delete<Product>(this.url+'/'+id)
    .pipe(catchError(this.handleError));
  }

  deleteProducts(ids:number[]){
    const body = { ids: ids };
    return this.httpClient.delete<Product>(this.url,{body})
    .pipe(catchError(this.handleError));
  }

private handleError(errorResponse: HttpErrorResponse): Observable<any> {
  console.error('An error occurred', errorResponse);
  return throwError(errorResponse.error);
}
    
  }
