import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {SolrclientService} from '../solrclient.service';
import { ActivatedRoute } from '@angular/router';
import {TestSummary} from '../models/TestSummary';

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
  buildNumber = "";
  tests=[];
  testSummary:TestSummary;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  progress=100;
  @Output() scenarioChange = new EventEmitter();
  scenario = {scenario: ''}; //intial value
  totalExecutionTime=0;

  constructor(private solrClient: SolrclientService, private route: ActivatedRoute) {   }
  
  ngOnInit() {
    let name = this.route.snapshot.paramMap.get('name')
    let buildNumber = this.route.snapshot.paramMap.get("buildNumber")
    this.buildNumber = buildNumber;
    this.projectName = name;
    this.updateTestSummary(name, this.buildNumber)
  }
 
  /**
  * udpates the test summary for a service
  * @param name nameof the service
  */
  updateTestSummary(name: string, buildNumber: string) {
    this.solrClient.getStats(name, buildNumber)
    .then(resp => {
      if(resp && resp['response']) {
        var docs = resp['response'].docs;
        this.tests = docs;
        this.tests.forEach((test)=> this.totalExecutionTime =  this.totalExecutionTime + parseFloat(test.executionTime))
        var passCases = docs.filter(x=> x.passed);
        var skipped = docs.filter(x=>x.skipped);
        var totalPass = passCases.length;
        this.testSummary = {
          totalTests: docs.length,
          totalPass: totalPass,
          totalFail: (docs.length-(totalPass+skipped)),
          totalSkipped: skipped.length,
          passPercentage: ((totalPass/docs.length)*100).toFixed(1),
          failPercentage: (((docs.length-(totalPass+skipped))/docs.length)*100).toFixed(1),
          buildNumber: "",
          timeStamp: null
        }
        this.collectionSize = this.tests.length;
      }
    }).catch(error => {
      this.testSummary = {
        totalTests:0,
        totalPass:0,
        totalFail:0,
        totalSkipped:0,
        passPercentage:"0",
        failPercentage:"0",
        buildNumber: "",
        timeStamp: null
      }
      console.log(error);
    })
  }
  getTestStatsByServiceAndScenario(serviceName, scenarioName) {
    if(scenarioName === ''|| !scenarioName) {
      this.updateTestSummary(serviceName, this.buildNumber);
    } else {
      this.solrClient.getStatsByTestName(serviceName, scenarioName,this.buildNumber).then(resp => {
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

  getTestStatsByServiceAndError(serviceName, errorString) {
    if(errorString === ''|| !errorString) {
      this.updateTestSummary(serviceName, this.buildNumber);
    } else {
      this.solrClient.getStatsByError(serviceName, errorString,this.buildNumber).then(resp => {
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

  getTestStatsUrlByServiceAndStatus(serviceName, status) {
    if(status === ''|| !status) {
      this.updateTestSummary(serviceName, this.buildNumber);
    } else {
      this.solrClient.getTestStatsUrlByServiceAndStatus(serviceName, status, this.buildNumber).then(resp => {
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
    var rate = parseFloat(this.testSummary['passPercentage']);
    if(rate == 100) {
      return "alert alert-success";
    } else if(rate <100 && rate >60) {
      return "alert alert-warning";
    } else if(rate <60) {
      return "alert alert-error";
    }
  }

  onKey(value: string) {
    this.updateTestSummary(value, this.buildNumber);
  }
  
  assignScenarioToDisplay(scenarioToDisplay) {
    console.log(scenarioToDisplay);
    this.scenario = scenarioToDisplay;
    this.scenarioChange.emit(this.scenario);
  }
}
