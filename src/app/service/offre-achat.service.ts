import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OffreAchat } from '../entity/offre-achat';

@Injectable({
  providedIn: 'root'
})
export class OffreAchatService {
  private url ='/api/offreAchat';

  constructor(private httpClient: HttpClient) { }

  getOffresAchat() {
    return this.httpClient.get<OffreAchat>(this.url)
    .pipe(catchError(this.handleError));
  }

  save(offreAchat:OffreAchat){
    return this.httpClient.post<OffreAchat>(this.url,offreAchat)
    .pipe(catchError(this.handleError));
  }
  edit(offreAchat:OffreAchat){
    return this.httpClient.put<OffreAchat>(this.url,offreAchat)
    .pipe(catchError(this.handleError));
  }

  deleteOffreAchat(id:number){
    return this.httpClient.delete<OffreAchat>(this.url+'/'+id)
    .pipe(catchError(this.handleError));
  }

  deleteOffresAchat(ids:number[]){
    const body = { ids: ids };
    return this.httpClient.delete<OffreAchat>(this.url,{body})
    .pipe(catchError(this.handleError));
  }

private handleError(errorResponse: HttpErrorResponse): Observable<any> {
  console.error('An error occurred', errorResponse);
  return throwError(errorResponse.error);
}
}
