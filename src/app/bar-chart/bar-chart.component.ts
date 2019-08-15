import { Component, OnInit, Input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SolrclientService } from '../solrclient.service';
import {TestSummary} from '../models/TestSummary';
import { keyframes } from '@angular/animations';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

  private solrClient: SolrclientService;
  view: any[] = [500, 200];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Build Number';
  showYAxisLabel = true;
  yAxisLabel = 'Test Count';
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  totalSummary= [];
  
  @Input() buildNumber;
  data;
  summary;

  constructor(solrClient: SolrclientService) { 
    this.solrClient = solrClient;
  }

  ngOnInit() {
    var stats = new Map();
    this.solrClient.getTestExecutionSumamryByService("VerifyDocument").then((response)=> {
      var pivot = response['facet_counts'].facet_pivot;
      var servicesStats = pivot['servicename,buildNumber,status,tags'];
      var serviceStats = servicesStats[0];
      for(var item of serviceStats.pivot) { //pivot with buildNumber
        var items = [];
        for(var nextItem of item.pivot) {  //pivot with status
          if(nextItem.value === "passed") {
            items.push({"name": "Passed Tests", "value": nextItem.count});
          } else if(nextItem.value === "failed") {
            items.push({"name": "Failed Tests", "value": nextItem.count});
          } else if(nextItem.value === "skipped") {
            var pivots = nextItem.pivot; //pivot with tags
            var manualPivot = pivots.find(pivot=> {
              return pivot.value.toLowerCase()== "manual";
            });
            items.push({"name": "Manual Tests", "value": manualPivot.count});
            items.push({"name": "Skipped Tests", "value": nextItem.count-manualPivot.count});
          }
        }
        stats.set(item.value, items);
      }
      var summary = new Map([...stats.entries()].sort());
      this.single = this.formData(summary)
      summary.forEach((value, key, summary) => {
        if(key === this.buildNumber) {
          this.data = value;
        }
      })
    }).catch((error)=> {
      console.log(error)
    });
  }

  onSelect(event) {
    console.log(event);
  }
  private formData(stats: Map<any, any>) {
    var items =  []
    stats.forEach((value, key, map) => {
     var data = {
        "name": key,
        "series": value
      }
      items.push(data);
    });
    console.log(items);
    return items;
  }

  single = [
    {
      "name": "0.1",
      "series": [
        {
          "name": "2010",
          "value": 7300000
        },
        {
          "name": "2011",
          "value": 8940000
        }
      ]
    }
  ]

}
