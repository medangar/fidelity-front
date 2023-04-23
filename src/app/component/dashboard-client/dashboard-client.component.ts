import { Component } from '@angular/core';
import {PrimeIcons} from 'primeng/api';
import { HistoTransaction } from 'src/app/entity/histo-transaction';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
    selector: 'app-dashboard-client',
    templateUrl: './dashboard-client.component.html',
    styleUrls: ['./dashboard-client.component.scss']
})
export class DashboardClientComponent {

    numberPointsUsedPerMonth: number;
    numberPointsAddedPerMonth: number
    totalPoints: number;
    identifiant:string;
    transactions: HistoTransaction[];
    

    constructor(private dashboardService: DashboardService) { }

    ngOnInit() {
        this.identifiant=localStorage.getItem("identifiant");
        this.dashboardService.getDataClientDashboards(this.identifiant).subscribe({
            next: (res) => {
                this.totalPoints = res.totalPoints;
                this.numberPointsUsedPerMonth = res.numberPointsUsedPerMonth;
                this.numberPointsAddedPerMonth = res.numberPointsAddedPerMonth;
                this.transactions = res.transactions;
            },
            error: (err) => {
                console.log(err);
            }
        });

    }
}
