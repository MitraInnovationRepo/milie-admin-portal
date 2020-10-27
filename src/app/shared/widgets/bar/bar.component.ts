import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-widget-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {

  chartOptions:{};


  constructor() { }

  ngOnInit() {
    /* this.chartOptions={
      chart: {
          type: 'bar'
      },
      title: {
          text: 'Products sold'
      },
      xAxis: {
          categories: ['Meat', 'Vegetables', 'Fruits', 'Dairy', 'DryProducts']
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Total products sold'
          }
      },
      legend: {
          reversed: true
      },
      plotOptions: {
          series: {
              stacking: 'normal'
          }
      },
      series: [{
          name: 'keels bandaragama',
          data: [5, 3, 4, 7, 2]
      }, {
          name: 'keels moratuwa',
          data: [2, 2, 3, 2, 1]
      }, {
          name: 'keels bambalapitiya',
          data: [3, 4, 4, 2, 5]
      }]
    } */
  }

}
