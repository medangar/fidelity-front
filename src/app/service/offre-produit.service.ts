import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OffreProduit } from '../entity/offre-produit';

@Injectable({
  providedIn: 'root'
})
export class OffreProduitService {

  private url ='/api/offreProduit';

  constructor(private httpClient: HttpClient) { }

  getOffresProduit() {
    return this.httpClient.get<OffreProduit>(this.url)
    .pipe(catchError(this.handleError));
  }

  save(offreProduit:OffreProduit){
    return this.httpClient.post<OffreProduit>(this.url,offreProduit)
    .pipe(catchError(this.handleError));
  }
  edit(offreProduit:OffreProduit){
    return this.httpClient.put<OffreProduit>(this.url,offreProduit)
    .pipe(catchError(this.handleError));
  }

  deleteOffreProduit(id:number){
    return this.httpClient.delete<OffreProduit>(this.url+'/'+id)
    .pipe(catchError(this.handleError));
  }

  deleteOffresProduit(ids:number[]){
    const body = { ids: ids };
    return this.httpClient.delete<OffreProduit>(this.url,{body})
    .pipe(catchError(this.handleError));
  }

private handleError(errorResponse: HttpErrorResponse): Observable<any> {
  console.error('An error occurred', errorResponse);
  return throwError(errorResponse.error);
}
}
