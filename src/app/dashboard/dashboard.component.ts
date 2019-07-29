import { Component, OnInit } from '@angular/core';
import { SolrclientService } from '../solrclient.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  services = [];

  constructor(private serviceClient: SolrclientService) { 
    serviceClient.getTestExecutionSumamry().then(response => {
      var pivot = response['facet_counts'].facet_pivot;
      var servicesStats = pivot['servicename,status'];
      servicesStats.forEach(serviceStats=> {
        var name = serviceStats.value;
        var totalTests = serviceStats.count;
        var passedTests = 0;
        var failedTests = 0
        var skippedTests = 0;
        for(var item of serviceStats.pivot) {
          if(item.value === "passed") {
            passedTests = item.count;
          } else if(item.value === "failed") {
            failedTests = item.count;
          } else if(item.value === "skipped") {
            skippedTests = item.count;
          }
        }
        var testSummary = {
          name: name,
          totalTests: totalTests,
          totalPass: passedTests,
          totalFail: failedTests,
          totalSkipped: skippedTests,
          passPercentage: ((passedTests/totalTests)*100).toFixed(1),
          failPercentage: ((failedTests/totalTests)*100).toFixed(1)
        };
        this.services.push(testSummary);
      })
    }).catch(error => {
      console.log(error);
    })
  }

  ngOnInit() {
  }

}
