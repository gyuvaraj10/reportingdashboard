export interface TestSummary {
    totalTests: number;
    totalPass: number;
    totalFail: number;
    totalSkipped: number;
    passPercentage: string;
    failPercentage: string;
    buildNumber: string;
    timeStamp: Date;
  }  