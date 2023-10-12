from aws_cdk import (
    Stack,
    aws_s3 as s3,
    aws_cloudfront as cloudfront,
    aws_route53 as route53,
    aws_route53_targets as route53_targets,
    aws_s3_deployment as s3deploy,
    aws_logs as logs,
    aws_iam as iam,
    aws_certificatemanager as acm,
)
from constructs import Construct
from my_constructs.cloudfront_distribution import CloudfrontDistribution
from my_constructs.s3_bucket import S3Bucket


class MainStack(Stack):
    def __init__(
        self,
        scope: Construct,
        id: str,
        account_id: str,
        domain_name: str,
        source_file_path: str,
        certificate: acm.Certificate,
        backup_bucket: s3.Bucket,
        **kwargs,
    ) -> None:
        super().__init__(scope, id, **kwargs)

        _hosted_zone = route53.HostedZone.from_lookup(
            self, f"{id}-HostedZone", domain_name=domain_name
        )

        def _add_route53_record(record_name: str, cf_dist: cloudfront.Distribution):
            route53.ARecord(
                self,
                f"{record_name}-Record",
                record_name=record_name,
                zone=_hosted_zone,
                target=route53.RecordTarget.from_alias(
                    route53_targets.CloudFrontTarget(cf_dist)
                ),
            )

        bucket = S3Bucket(self, f"Bucket")

        main_distribution = CloudfrontDistribution(
            self,
            f"Distribution",
            domain_name=domain_name,
            origin_type="s3",
            certificate=certificate,
            _s3_bucket=bucket.bucket,
            backup__s3_bucket=backup_bucket,
        )

        bucket_policy_statement = iam.PolicyStatement(
            sid="AllowCloudFrontServicePrincipalReadOnly",
            effect=iam.Effect.ALLOW,
            principals=[iam.ServicePrincipal("cloudfront.amazonaws.com")],
            actions=["s3:GetObject"],
            resources=[
                f"{bucket.bucket.bucket_arn}/*",
            ],
            conditions={
                "StringEquals": {
                    "AWS:SourceArn": f"arn:aws:cloudfront::{account_id}:distribution/{main_distribution.cf_distribution.distribution_id}"
                }
            },
        )

        bucket.bucket.add_to_resource_policy(bucket_policy_statement)

        # Add main domain
        _add_route53_record(
            record_name=domain_name, cf_dist=main_distribution.cf_distribution
        )
        # Add sub domain
        _add_route53_record(
            record_name=f"www.{domain_name}",
            cf_dist=main_distribution.cf_distribution,
        )

        s3deploy.BucketDeployment(
            self,
            f"{id}-FilesDeployment",
            sources=[s3deploy.Source.asset(source_file_path)],
            destination_bucket=bucket.bucket,
            distribution=main_distribution.cf_distribution,
            log_retention=logs.RetentionDays.ONE_YEAR,
            retain_on_delete=False,
        )

        s3deploy.BucketDeployment(
            self,
            f"{id}-BackupFilesDeployment",
            sources=[s3deploy.Source.asset(source_file_path)],
            destination_bucket=backup_bucket,
            distribution=main_distribution.cf_distribution,
            log_retention=logs.RetentionDays.ONE_YEAR,
            retain_on_delete=False,
        )
