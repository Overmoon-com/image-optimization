import { Stack, StackProps } from 'aws-cdk-lib'
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines'
import { Construct } from 'constructs'
import { PROD_ACCOUNT_ID, REGION } from './aws-accounts.js'
import { GitHubRepo, GitHupBranch, ServiceDescription } from './service-config.js'
import { ImageOptimizationStack } from './image-optimization-stack.js'
import { ServiceStage } from './service-stage.js'

export class ServicePipeline extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, { description: `Pipeline for "${ServiceDescription}""`, ...props })

    const synth = new ShellStep('Synth', {
      input: CodePipelineSource.gitHub(GitHubRepo, GitHupBranch),
      commands: ['npm ci', 'npm run build', 'npx cdk synth'],
    })

    const pipeline = new CodePipeline(this, `Pipeline`, {
      dockerEnabledForSynth: true,
      crossAccountKeys: true,
      synth,
    })

    // pipeline.addStage(
    //   new ServiceStage(this, `Stage-FromPipeline`, {
    //     env: { account: STAGE_ACCOUNT_ID, region: REGION },
    //     deploymentType: DeploymentType.Staging,
    //   })
    // )

    pipeline.addStage(
      new ServiceStage(this, `Prod-FromPipeline`, {
        env: { account: PROD_ACCOUNT_ID, region: REGION },
        s3ImageBucketName: 'overmoon-unit-images',
      })
    )

    // productionStage.addPre(new ManualApprovalStep('ProductionRelease'))
  }
}
