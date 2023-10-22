#!/usr/bin/env python3
"""Module import for cdk and other required packages"""
import os
from aws_cdk import App, Environment, Tags, Stack
from stacks.main_stack import MainStack
from stacks.acm_certificates_stack import ACMCertificates
from stacks.backup_bucket_stack import BackupBucket


def add_tags(
    stack: Stack = None,
    app: App = None,
    default_tags: dict = None,
):
    if app:
        for k, v in default_tags.items():
            Tags.of(app).add(k, v)
    if stack:
        Tags.of(stack).add("stack_name", stack.stack_name)


app = App()

cloudfront_region = "us-east-1"

environment = os.environ.get("ENVIRONMENT")
# environment = "development"
environment_config = app.node.try_get_context(environment)
account_id = environment_config.get("account_id")
region = environment_config.get("region")
domain_name = environment_config.get("domain_name")
source_file_path = environment_config.get("file_path")


env = Environment(account=account_id, region=region)

cloudfront_env = Environment(account=account_id, region=cloudfront_region)

# Default tags for all stacks
default_tags = {
    "environment": environment,
    "project": "NumberGuessingGame",
    "website": domain_name,
    "owner": "Cullan Carey",
}

add_tags(app=app, default_tags=default_tags)

certificates = ACMCertificates(
    scope=app,
    id="ACMCertificateStack",
    domain_name=domain_name,
    env=cloudfront_env,
    cross_region_references=True,
    description=f"Stack to create ACM certificates in {cloudfront_env.region} for Cloufront",
)

backup_bucket = BackupBucket(
    scope=app,
    id="BackupBucketStack",
    env=cloudfront_env,
    cross_region_references=True,
    description=f"Stack to deploy the websites failover bucket in {cloudfront_env.region}",
)

MainStack(
    scope=app,
    id="MainStack",
    account_id=account_id,
    domain_name=domain_name,
    source_file_path=source_file_path,
    certificate=certificates.website_certificate.certificate,
    backup_bucket=backup_bucket.backup_bucket.bucket,
    env=env,
    cross_region_references=True,
    description="Stack to deploy the number guessing game resources",
)

app.synth()
