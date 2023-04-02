import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HistoTransaction } from '../entity/histo-transaction';

@Injectable({
  providedIn: 'root'
})
export class HistoTransactionService {
  

  private url ='/api/transactions';

  constructor(private httpClient: HttpClient) { }

  getHistoTransactions() {
    return this.httpClient.get<HistoTransaction>(this.url)
    .pipe(catchError(this.handleError));
}

private handleError(errorResponse: HttpErrorResponse): Observable<any> {
  console.error('An error occurred', errorResponse);
  return throwError(errorResponse.error);
}


}
