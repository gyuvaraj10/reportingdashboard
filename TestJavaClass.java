package com.gbg.cucumber;

import com.gbg.test.utilities.RESTAssuredAPI;
import com.google.gson.Gson;
import com.sun.xml.internal.messaging.saaj.soap.Envelope;
import io.cucumber.gherkin.Gherkin;
import io.cucumber.messages.Messages;
import io.restassured.response.Response;
import lombok.Data;
import org.apache.commons.io.FileUtils;
import org.apache.maven.plugin.surefire.log.api.ConsoleLoggerDecorator;
import org.apache.maven.plugins.surefire.report.ReportTestCase;
import org.apache.maven.plugins.surefire.report.ReportTestSuite;
import org.apache.maven.plugins.surefire.report.TestSuiteXmlParser;
import org.junit.Ignore;
import org.junit.Test;

import java.io.File;
import java.net.URLEncoder;
import java.util.*;

public class TestJavaClass {

    @Test
    @Ignore
    public void testJava() throws Exception {
        TestSuiteXmlParser  xmlParser = new TestSuiteXmlParser(new ConsoleLoggerDecorator(this));
        File directory = new File("C:\\Users\\yuvaraj.gunisetti\\drteeth\\verificationaudit\\testsuites\\gbg-unified-test-verhis\\reports\\UKDL");
        List<ReportTestSuite> testSuites = new ArrayList<>();
        for(File file: directory.listFiles()) {
            testSuites.addAll(xmlParser.parse(file.getPath()));
        }
        List<Report> reports = new ArrayList<>();
        for(ReportTestSuite testSuite: testSuites) {
            for (ReportTestCase reportTestCase : testSuite.getTestCases()) {
                Report report = new Report();
                report.setServicename("UKDL");
                report.setClassName(reportTestCase.getClassName());
                report.setFullClassName(reportTestCase.getFullClassName());
                report.setFailed(reportTestCase.hasError() || reportTestCase.hasFailure());
                report.setFailureDetail(reportTestCase.getFailureDetail());
                report.setFailureType(reportTestCase.getFailureType());
                report.setFailureMessage(reportTestCase.getFailureMessage());
                report.setName(reportTestCase.getName());
                report.setSkipped(reportTestCase.hasSkipped());
                report.setPassed(reportTestCase.isSuccessful());
                if(reportTestCase.isSuccessful()) {
                    report.setStatus("passed");
                } else if(reportTestCase.hasFailure() || reportTestCase.hasError()) {
                    report.setStatus("failed");
                } else if(reportTestCase.hasSkipped()) {
                    report.setStatus("skipped");
                }
                reports.add(report);
            }
        }
//        http://localhost:8983/solr/gettingstarted/select?q=servicename:Match&stats=true&stats.field={!func}termfreq(%27status%27,%20%27passed%27)&rows=200&indent=true
        String testCases = new Gson().toJson(reports);
        RESTAssuredAPI restAssuredAPI = new RESTAssuredAPI();
        String url = "http://localhost/solr/gettingstarted/update?commit=true";
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        Response response = restAssuredAPI.post(testCases, headers, url);
        System.out.println(response.getStatusCode());
        System.out.println(response.getBody().asString());
    }

    @Test
    @Ignore
    public void deleteData() {
        RESTAssuredAPI restAssuredAPI = new RESTAssuredAPI();
        String url = "http://localhost/solr/gettingstarted/update?stream.body=<delete><query>servicename:UKDL</query></delete>&commit=true";
        Response response = restAssuredAPI.get(url);
        System.out.println(response.getStatusCode());
        System.out.println(response.getBody().asString());
    }

    @Test
    @Ignore
    public void parseGherkin() {
        List<Messages.Wrapper> envelopes = Gherkin.fromPaths(Collections.singletonList(
                "C:\\Users\\yuvaraj.gunisetti\\drteeth\\verificationaudit\\testsuites\\gbg-unified-test-verhis\\target\\cucumber.json"),
                false, true, false);
        Messages.GherkinDocument document = envelopes.get(0).getGherkinDocument();
    }
    @Data
    class Report {
        private String servicename;
        private String fullClassName;
        private String className;
        private String name;
        private String failureMessage;
        private String failureType;
        private String failureDetail;
        private boolean failed;
        private boolean skipped;
        private boolean passed;
        private String status;
    }
}
