import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolrclientService {

  constructor(private http: HttpClient) { }

  baseUrl = "/solr/gettingstarted/select";
  
  statsUrl="/solr/gettingstarted/select?q=servicename:Match&stats=true&stats.field={!func}termfreq(%27status%27,%20%27passed%27)&stats.field={!func}termfreq(%27status%27,%27failed%27)&stats.field={!func}termfreq(%27status%27,%27skipped%27)&rows=200&indent=true";
  
  summaryOfTestExecutionResults_facet_pivot_url="/solr/gettingstarted/select?q=servicename:*&facet=true&facet.field=servicename&facet.pivot=servicename,status&indent=true";

  serviceTestStatsByStatus="/solr/gettingstarted/select?q=servicename:{%servicename}&fq=status:{%status}&rows=2000&indent=true";

  //dataUrl = environment.SOLRENDPOINT+"/solr/gettingstarted/select?q=servicename%3AVerificationHistory&rows=100";
  //statsWithFacet="http://localhost:8983/solr/gettingstarted/select?q=servicename:Match&facet=true&facet.field=servicename&stats=true&stats.field={!func}termfreq(%27status%27,%20%27passed%27)&stats.field={!func}termfreq(%27status%27,%27failed%27)&stats.field={!func}termfreq(%27status%27,%27skipped%27)&rows=200&indent=true";
  //facetUrl = "http://localhost:8983/solr/gettingstarted/select?q=*:*&facet=true&facet.field=servicename";
  
  getTestExecutionSumamry() {
    return this.http.get(this.summaryOfTestExecutionResults_facet_pivot_url).toPromise();
  }

  // getData() {
  //   return this.http.get(this.dataUrl).toPromise();
  // }

  getStats(serviceName: string) {
    let url = this.baseUrl+"?q=servicename:"+serviceName+"&stats=true&stats.field={!func}termfreq(%27status%27,%20%27passed%27)&stats.field={!func}termfreq(%27status%27,%27failed%27)&stats.field={!func}termfreq(%27status%27,%27skipped%27)&rows=2000&indent=true";
    return this.http.get(url).toPromise();
  }

  getTestStatsUrlByServiceAndStatus(servicename: string, status: string) {
    let url = this.serviceTestStatsByStatus.replace("{%servicename}", servicename).replace("{%status}", status);
    return this.http.get(url).toPromise();
  }
}
