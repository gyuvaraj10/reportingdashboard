import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { Observable, interval, timer } from 'rxjs';
import { environment } from './../environments/environment';
import {TestSummary} from './models/TestSummary';
import {switchMap, map, flatMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SolrclientService {

  constructor(private http: HttpClient) { }

  host= "http://localhost:8983";

  baseUrl = this.host+"/solr/gettingstarted/select";
  
  statsUrl=this.host+"/solr/gettingstarted/select?q=servicename:Match&stats=true&stats.field={!func}termfreq(%27status%27,%20%27passed%27)&stats.field={!func}termfreq(%27status%27,%27failed%27)&stats.field={!func}termfreq(%27status%27,%27skipped%27)&rows=200&indent=true";
  
  summaryOfTestExecutionResults_facet_pivot_url=this.host+"/solr/gettingstarted/select?q=servicename:*&facet=true&facet.sort=buildNumber&facet.field=servicename&facet.pivot=servicename,buildNumber,status,tags&indent=true&rows=0&&stats=true&stats.field=executionTime";
  testSummaryByService_facet_pivot_url=this.host+"/solr/gettingstarted/select?q=servicename:{servicename}&facet=true&facet.field=servicename&facet.pivot=servicename,buildNumber,status,tags&indent=true&rows=0";

  serviceTestStatsByStatus=this.host+ "/solr/gettingstarted/select?q=servicename:{servicename}&fq=buildNumber:{%build}&fq=status:{%status}&rows=20000&indent=true";
  
  moreLikeThis = this.host+"/solr/gettingstarted/select?q=servicename:*&&qf=failureMessage:{message}&mlt.fl=failureMessage&mlt=true&mlt.match.include=true&mlt.count=1000&mlt.mintf=1";

  getTestExecutionSumamry() {
    return timer(1000, 60*1000).pipe(switchMap(()=> {
      return this.http.get<TestSummary>(this.summaryOfTestExecutionResults_facet_pivot_url);
    })) 
  }

  getTestExecutionSumamryByService(serviceName: string) {
      return this.http.get<TestSummary>(this.testSummaryByService_facet_pivot_url.replace("{servicename}", serviceName)).toPromise();
  }

  getStats(serviceName: string, buildNumber: string) {
    let url = this.baseUrl+"?q=servicename:"+serviceName+"&fq=buildNumber:"+buildNumber+"&stats=true&stats.field={!func}termfreq(%27status%27,%20%27passed%27)&stats.field={!func}termfreq(%27status%27,%27failed%27)&stats.field={!func}termfreq(%27status%27,%27skipped%27)&stats.field=executionTime&rows=2000&indent=true";
    return this.http.get(url).toPromise();
  }
  getStatsByTestName(serviceName: string, testName: string, buildNumber: string) {
    let url = this.baseUrl+"?q=servicename:"+serviceName+"&fq=buildNumber:"+buildNumber+"&fq=scenarioName:"+testName+"&stats=true&stats.field={!func}termfreq(%27status%27,%20%27passed%27)&stats.field={!func}termfreq(%27status%27,%27failed%27)&stats.field={!func}termfreq(%27status%27,%27skipped%27)&rows=2000&indent=true";
    return this.http.get(url).toPromise();
  }
  getStatsByError(serviceName: string, errorString: string, buildNumber: string) {
    let url = this.baseUrl+"?q=servicename:"+serviceName+"&fq=buildNumber:"+buildNumber+"&fq=failureMessage:"+errorString+"&stats=true&stats.field={!func}termfreq(%27status%27,%20%27passed%27)&stats.field={!func}termfreq(%27status%27,%27failed%27)&stats.field={!func}termfreq(%27status%27,%27skipped%27)&rows=2000&indent=true";
    return this.http.get(url).toPromise();
  }
  
  getTestStatsUrlByServiceAndStatus(servicename: string, status: string, buildNumber: string) {
    let url = this.serviceTestStatsByStatus.replace("{servicename}", servicename).replace("{%status}", status).replace("{%build}", buildNumber);
    return this.http.get(url).toPromise();
  }

  getSimilarTests(errorMessage: string) {
    let url = this.moreLikeThis.replace("{message}", errorMessage);
    return this.http.get(url).toPromise();
  }
}
