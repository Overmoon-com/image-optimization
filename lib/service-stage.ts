import { Stage, StageProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { ServiceName } from './service-config.js'
import { ImageOptimizationStack } from './image-optimization-stack.js'

export interface ImageOptimizationStageProps extends StageProps {
  s3ImageBucketName: string
}

export class ServiceStage extends Stage {
  constructor(scope: Construct, id: string, props: ImageOptimizationStageProps) {
    super(scope, id, props)
    new ImageOptimizationStack(this, ServiceName, {
      s3ImageBucketName: props.s3ImageBucketName,
    })
  }
}
