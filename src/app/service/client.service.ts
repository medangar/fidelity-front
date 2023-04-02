import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Client } from '../entity/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private url ='/api/client';

  constructor(private httpClient: HttpClient) { }

  getClients() {
    return this.httpClient.get<Client>(this.url)
    .pipe(catchError(this.handleError));
  }

  save(client:Client){
    return this.httpClient.post<Client>(this.url,client)
    .pipe(catchError(this.handleError));
  }
  edit(client:Client){
    return this.httpClient.put<Client>(this.url,client)
    .pipe(catchError(this.handleError));
  }

  deleteClient(id:number){
    return this.httpClient.delete<Client>(this.url+'/'+id)
    .pipe(catchError(this.handleError));
  }

  deleteClients(ids:number[]){
    const body = { ids: ids };
    return this.httpClient.delete<Client>(this.url,{body})
    .pipe(catchError(this.handleError));
  }

private handleError(errorResponse: HttpErrorResponse): Observable<any> {
  console.error('An error occurred', errorResponse);
  return throwError(errorResponse.error);
}
}
