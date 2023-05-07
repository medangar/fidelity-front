import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HistoTransaction } from '../entity/histo-transaction';

@Injectable({
  providedIn: 'root'
})
export class HistoTransactionService {
  

  private urlPoint = '/api/transaction';
  private url = '/api/transactions';

  constructor(private httpClient: HttpClient) { }

  getHistoTransactions() {
    return this.httpClient.get<HistoTransaction>(this.url)
      .pipe(catchError(this.handleError));
  }
  getHistoTransactionsByClient(idClient: number) {
    return this.httpClient.get<HistoTransaction>(this.url+'/client/'+idClient)
      .pipe(catchError(this.handleError));
}
  usePoint(id: number, points: number) {
    return this.httpClient.post<HistoTransaction>(this.urlPoint, { carteId: id, nbPoints: points })
      .pipe(catchError(this.handleError));
  }
  addPoint(total: number, carteId: number, productsIds: number[]) {
    return this.httpClient.post<HistoTransaction>(this.urlPoint + "/ajouter", { carteId: carteId, total: total, productsIds: productsIds })
      .pipe(catchError(this.handleError));
  }
  private handleError(errorResponse: HttpErrorResponse): Observable<any> {
    console.error('An error occurred', errorResponse);
    return throwError(errorResponse.error);
  }

}
