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

  constructor(private httpCarte: HttpClient) { }
  getCartes() {
    return this.httpCarte.get<Carte>(this.url)
    .pipe(catchError(this.handleError));
  }
  private handleError(errorResponse: HttpErrorResponse): Observable<any> {
    console.error('An error occurred', errorResponse);
    return throwError(errorResponse.error);
  }
  
}
