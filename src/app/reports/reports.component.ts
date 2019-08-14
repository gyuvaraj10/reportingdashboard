import { Component, OnInit,ViewChild  } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { SolrclientService } from '../solrclient.service';
import {TestSummary} from '../models/TestSummary';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  
  public lineChartData: ChartDataSets[] = [{data: []}];
  public lineChartLabels: Label[] = [];
  public lineChartPlugins = [pluginAnnotations];
  public lineChartLegend = true;
  public lineChartType = 'line';

  error;
  totalTestSeries = [];
  buildNumberSeries =[];
  testBuildMap = new Map();
  passTestBuildMap = new Map();
  failTestBuildMap = new Map();
  skippedTestBuildMap = new Map();
  manualTestBuildMap = new Map();

  
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  constructor(private serviceClient: SolrclientService) { 
    var testSumamryPromise =  serviceClient.getTestExecutionSumamryByService("VerifyDocument");
    testSumamryPromise.subscribe(
      (response: TestSummary) => {
            var pivot = response['facet_counts'].facet_pivot;
            var servicesStats = pivot['servicename,buildNumber,status,tags'];
            servicesStats.forEach(serviceStats=> {
              var passedTests = 0;
              var failedTests = 0
              var skippedTests = 0;
              var manualTests = 0;
              for(var item of serviceStats.pivot) { //pivot with buildNumber
                this.totalTestSeries.push(item.count);
                this.buildNumberSeries.push(item.value);
                this.testBuildMap.set(item.value, item.count);
                for(var nextItem of item.pivot) {  //pivot with status
                  if(nextItem.value === "passed") {
                    passedTests = nextItem.count;
                    this.passTestBuildMap.set(item.value, passedTests);
                  } else if(nextItem.value === "failed") {
                    failedTests = nextItem.count;
                    this.failTestBuildMap.set(item.value, failedTests);
                  } else if(nextItem.value === "skipped") {
                    var pivots = nextItem.pivot; //pivot with tags
                    var manualPivot = pivots.find(pivot=> {
                      return pivot.value.toLowerCase()== "manual";
                    });
                    manualTests = manualPivot.count;
                    skippedTests = nextItem.count-manualTests;
                    this.skippedTestBuildMap.set(item.value, skippedTests);
                    this.manualTestBuildMap.set(item.value, manualTests);
                  }
                }
              }
            });
          this.lineChartLabels = this.buildNumberSeries;
          var totalTestMap = new Map<string, number>([...this.testBuildMap.entries()].sort());
          var passTestMap = new Map<string, number>([...this.passTestBuildMap.entries()].sort());
          var failTestMap = new Map<string, number>([...this.failTestBuildMap.entries()].sort());
          var skipTestMap = new Map<string, number>([...this.skippedTestBuildMap.entries()].sort());
          var manualTestMap = new Map<string, number>([...this.manualTestBuildMap.entries()].sort());
          this.totalTestSeries = Array.from(totalTestMap.values());
          var passTestSeries = Array.from(passTestMap.values());
          var failTestSeries = Array.from(failTestMap.values());
          var skipTestSeries = Array.from(skipTestMap.values());
          var manualTestSeries = Array.from(manualTestMap.values());
          this.buildNumberSeries = Array.from(totalTestMap.keys());
          this.lineChartData = [
            {data:  this.totalTestSeries, label: 'Total Tests'},
            {data:  passTestSeries, label: 'Passed Tests'},
            {data:  failTestSeries, label: 'Failed Tests'},
            {data:  skipTestSeries, label: 'Skipped Tests'},
            {data:  manualTestSeries, label: 'Manual Tests'},
          ];
          this.lineChartLabels = this.buildNumberSeries;
          console.log();
    },
   (error) => {
    console.log(error);
    this.error = error;
   }
  );
  }
   
  ngOnInit() {
  }

}
