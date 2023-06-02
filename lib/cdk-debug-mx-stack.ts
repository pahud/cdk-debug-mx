import * as cdk from 'aws-cdk-lib';
import {
  aws_stepfunctions as stfn,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class CdkDebugMxStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const waitX = new stfn.Wait(this, 'Wait X Seconds', {
      time: stfn.WaitTime.secondsPath('$.waitSeconds'),
    });
    
    const jobFailed = new stfn.Fail(this, 'Job Failed', {
      cause: 'AWS Batch Job Failed',
      error: 'DescribeJob returned FAILED',
    });
    
    const definition = waitX
      .next(jobFailed);
    
    new stfn.StateMachine(this, 'StateMachine', {
      definition,
      timeout: cdk.Duration.minutes(5),
    });


  }
}
