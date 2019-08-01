import { Component, OnInit } from '@angular/core';
import { SolrclientService } from '../solrclient.service';
import {TestSummary} from '../models/TestSummary';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  services = [];
  progress = 0;
  isFulfilled = false;
  error;

  constructor(private serviceClient: SolrclientService) { 
    var testSumamryPromise =  serviceClient.getTestExecutionSumamry();
    this.isFulfilled = false;
    testSumamryPromise.subscribe(
      (response: TestSummary) => {
            var pivot = response['facet_counts'].facet_pivot;
            var servicesStats = pivot['servicename,status,tags'];
            this.services = [];
            servicesStats.forEach(serviceStats=> {
              var name = serviceStats.value;
              var totalTests = serviceStats.count;
              var passedTests = 0;
              var failedTests = 0
              var skippedTests = 0;
              var manualTests = 0;
              for(var item of serviceStats.pivot) {
                if(item.value === "passed") {
                  passedTests = item.count;
                } else if(item.value === "failed") {
                  failedTests = item.count;
                } else if(item.value === "skipped") {
                  var pivots = item.pivot;
                  var manualPivot = pivots.find(pivot=> {
                    return pivot.value.toLowerCase()== "manual";
                  });
                  manualTests = manualPivot.count;
                  skippedTests = item.count-manualTests;
                }
              }
              var testSummary = {
                name: name,
                totalTests: totalTests,
                totalPass: passedTests,
                totalFail: failedTests,
                totalManual: manualTests,
                totalSkipped: skippedTests,
                passPercentage: ((passedTests/totalTests)*100).toFixed(1),
                failPercentage: ((failedTests/totalTests)*100).toFixed(1)
              };
              this.services.push(testSummary);
          });
          this.isFulfilled = true;
    },
   (error) => {
    console.log(error);
    this.error = error;
   }
  );
  this.updateProgressBar();
  }
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  private async updateProgressBar() {
    if(this.isFulfilled) {
      this.progress = 100;
    } else {
      while (!this.isFulfilled) {
        console.log(this.isFulfilled);
        this.progress = this.progress+10;
        await this.delay(100);
      }
    }
  }
  ngOnInit() {
  }
  
}
