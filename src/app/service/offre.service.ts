import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Offre } from '../entity/offre';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class OffreService {
  private url ='/api/offre';

  constructor(private httpClient: HttpClient) { }

  getOffres() {
    return this.httpClient.get<Offre>(this.url)
    .pipe(catchError(this.handleError));
  }

  save(offre:Offre){
    return this.httpClient.post<Offre>(this.url,offre)
    .pipe(catchError(this.handleError));
  }
  edit(offre:Offre){
    return this.httpClient.put<Offre>(this.url,offre)
    .pipe(catchError(this.handleError));
  }

  deleteOffre(id:number){
    return this.httpClient.delete<Offre>(this.url+'/'+id)
    .pipe(catchError(this.handleError));
  }

  deleteOffres(ids:number[]){
    const body = { ids: ids };
    return this.httpClient.delete<Offre>(this.url,{body})
    .pipe(catchError(this.handleError));
  }

private handleError(errorResponse: HttpErrorResponse): Observable<any> {
  console.error('An error occurred', errorResponse);
  return throwError(errorResponse.error);
}
}

