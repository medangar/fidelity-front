import { Component } from '@angular/core';
import { HistoTransaction } from 'src/app/entity/histo-transaction';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
    selector: 'app-dashboard-admin',
    templateUrl: './dashboard-admin.component.html',
    styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent {


    numberUserPerDay: number;
    numberTransactionsPerDay: number
    totalPoints: number;
    pieOptions: any;
    barOptions: any;
    barData: any;
    carteByClient: any;
    transactions: HistoTransaction[];
    gendre: any;
    users: any[] ;
    constructor(private dashboardService: DashboardService) { }
    ngOnInit() {
        
        this.dashboardService.getDataDashboards().subscribe({
            next: (res) => {
                this.barData = {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [
                        {
                            label: 'Points consommées',
                            backgroundColor: 'rgb(255, 99, 132)',
                            borderColor: 'rgb(255, 99, 132)',
                            data: [65, 59, 80, 81, 56, 55, 40]
                        },
                        {
                            label: 'Points cumulées',
                            backgroundColor: 'rgb(54, 162, 235)',
                            borderColor: 'rgb(54, 162, 235)',
                            data: [28, 48, 40, 19, 86, 27, 90]
                        }
                    ]
                };
                this.barData.labels = res.statPoint.mois;
                this.barData.datasets[0].data = res.statPoint.pointConsommer;
                this.barData.datasets[1].data = res.statPoint.pointCumuler;
                this.numberUserPerDay = res.userPerDay;
                this.numberTransactionsPerDay = res.transactionPerDay;
                this.totalPoints = res.totalPoints;
                this.transactions = res.transactions;
                this.gendre = {
                    labels: ['Homme', 'Femme'],
                    datasets: [
                        {
                            data: [res.nbTransactionHomme, res.nbTransactionFemme],
                            backgroundColor: [
                                'rgb(54, 162, 235)',
                                'rgb(255, 99, 132)'
                            ]
                        }]
                };
                this.users = res.users;
                this.carteByClient = {
                    labels: ['<18 ans', '>18 ans et <30 ans', '>30 ans et <50 ans','>50 ans'],
                    datasets: [
                        {
                            data: [res.carteByClient.nbMoins18, res.carteByClient.nb18et30, res.carteByClient.nb30et50, res.carteByClient.nbPlus50],
                            backgroundColor: [
                                'rgb(54, 162, 235)',
                                'rgb(255, 99, 132)',
                                'rgb(255, 205, 86)',
                                'rgb(75, 192, 192)'
                            ]
                        }]
                };
                console.log('transactions ',this.transactions);
            },
            error: (err) => {
                console.log(err);
            }
        });
        this.barOptions = {
            plugins: {
                legend: {
                    labels: {
                        fontColor: '#A0A7B5'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#A0A7B5'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    }
                },
                y: {
                    ticks: {
                        color: '#A0A7B5'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    }
                },
            }
        };

        

        

        this.pieOptions = {
            plugins: {
                legend: {
                    labels: {
                        fontColor: '#A0A7B5'
                    }
                }
            }
        };
    }


}
