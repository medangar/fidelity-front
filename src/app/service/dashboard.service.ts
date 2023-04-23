import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { DashboardAdmin } from '../entity/dashboard-admin';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private url ='/api/dashboard';

  constructor(private httpClient: HttpClient) { }
  getDataDashboards() {
    return this.httpClient.get<DashboardAdmin>(this.url)
    .pipe(catchError(this.handleError));
  }
  private handleError(errorResponse: HttpErrorResponse): Observable<any> {
    console.error('An error occurred', errorResponse);
    return throwError(errorResponse.error);
  }
}
