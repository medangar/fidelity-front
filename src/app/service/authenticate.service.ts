import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable,throwError } from 'rxjs';
import { Connexion } from '../entity/connexion';
import { Inscription } from '../entity/inscription';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  private url ='/api/v1/auth';

  constructor(private httpClient: HttpClient) { }

  connexion(connexion: Connexion) {
    console.log("service",connexion);
         return this.httpClient.post<any>(this.url + '/authenticate',connexion)
           .pipe(catchError(this.handleError));
 
       }

       inscription(inscription: Inscription): Observable<void>{
        console.log("service",inscription);
        return this.httpClient.post<void>(this.url + '/register',inscription)
         .pipe(catchError(this.handleError));
      }
 
     private handleError(errorResponse: HttpErrorResponse): Observable<any> {
       console.error('An error occurred', errorResponse);
       return throwError(errorResponse.error);
     }
}
