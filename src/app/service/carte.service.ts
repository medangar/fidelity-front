import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { Carte } from '../entity/carte';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CarteService {
  private url ='/api/carte';

  constructor(private httpClient: HttpClient) { }
  getCartes() {
    return this.httpClient.get<Carte>(this.url)
    .pipe(catchError(this.handleError));
  }
  saveCarte(carte:Carte){
    return this.httpClient.post<Carte>(this.url,carte)
    .pipe(catchError(this.handleError));
  }
  editCarte(carte:Carte){
    return this.httpClient.put<Carte>(this.url,carte)
    .pipe(catchError(this.handleError));
  }

  deleteCarte(id:number){
    return this.httpClient.delete<Carte>(this.url+'/'+id)
    .pipe(catchError(this.handleError));
  }

  deleteCartes(ids:number[]){
    const body = { ids: ids };
    return this.httpClient.delete<Carte>(this.url,{body})
    .pipe(catchError(this.handleError));
  }

  private handleError(errorResponse: HttpErrorResponse): Observable<any> {
    console.error('An error occurred', errorResponse);
    return throwError(errorResponse.error);
  }
  
}
