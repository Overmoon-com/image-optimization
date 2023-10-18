#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ImageOptimizationStack } from '../lib/image-optimization-stack';
import { ServicePipeline } from '../lib/service-pipeline';
import { ServiceName } from '../lib/service-config';
import { CODE_PIPELINE_ACCOUNT_ID, REGION } from '../lib/aws-accounts';


const app = new cdk.App();
new ServicePipeline(app, `${ServiceName}Pipeline`, {
  env: {
    account: CODE_PIPELINE_ACCOUNT_ID,
    region: REGION,
  },
})

new ImageOptimizationStack(app, `Dev-${ServiceName}`, {
  s3ImageBucketName: 'overmoon-unit-images-jessehull'
})

