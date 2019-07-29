import { Component, OnInit } from '@angular/core';
import {SolrclientService} from '../solrclient.service';
import { ActivatedRoute } from '@angular/router';

interface TestStat {
  index?: number;
  fullClassName: string;
  name: string;
  status: string;
  failureMessage: string;
}

@Component({
  selector: 'app-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.scss']
})
export class ProjectDashboardComponent implements OnInit {

  title = 'reporting';
  projectName = "";
  tests=[];
  testSummary = {};
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  progress=100;
  
  constructor(private solrClient: SolrclientService, private route: ActivatedRoute) {   }
  
  ngOnInit() {
    let name = this.route.snapshot.paramMap.get('name')
    this.projectName = name;
    this.solrClient.getStats(name)
    .then(resp => {
      if(resp && resp['response']) {
        var docs = resp['response'].docs;
        this.tests = docs;
        var passCases = docs.filter(x=> x.passed);
        var skipped = docs.filter(x=>x.skipped);
        var totalPass = passCases.length;
        this.testSummary = {
          totalTests:docs.length,
          totalPass: totalPass,
          totalFail: (docs.length-(totalPass+skipped)),
          totalSkipped: skipped.length,
          passPercentage: ((totalPass/docs.length)*100).toFixed(1),
          failPercentage: (((docs.length-(totalPass+skipped))/docs.length)*100).toFixed(1)
        }
        this.collectionSize = this.tests.length;
      }
      
    }).catch(error => {
      this.testSummary = {
        totalTests:0,
        totalPass: 0,
        totalFail: 0,
        totalSkipped: 0,
        passPercentage: 0,
        failPercentage: 0
      }
      console.log(error);
    })
  }
 
  getTestStatsUrlByServiceAndStatus(serviceName, status) {
    console.log(status);
    if(status=='total') {
      this.solrClient.getStats(serviceName).then(resp => {
        if(resp && resp['response']) {
          var docs = resp['response'].docs;
          this.tests = docs;
          this.collectionSize = this.tests.length;
        }
      }).catch(error => {
        console.log(error);
      })
    } else {
      this.solrClient.getTestStatsUrlByServiceAndStatus(serviceName, status).then(resp => {
        if(resp && resp['response']) {
          var docs = resp['response'].docs;
          this.tests = docs;
          this.collectionSize = this.tests.length;
        }
      }).catch(error => {
        console.log(error);
      })
    }
  }
  get teststats(): TestStat[] {
    var teststats= this.tests.map((stat, i) => ({index: i + 1, ...stat}))
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    return teststats;
  }

  getAlertStyle() {
    var rate = this.testSummary['passPercentage'];
    if(rate ==100) {
      return "alert alert-success";
    } else if(rate <100 && rate >60) {
      return "alert alert-warning";
    } else if(rate <60) {
      return "alert alert-error";
    }
  }

}
