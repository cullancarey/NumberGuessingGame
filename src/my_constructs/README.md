# Python CDK Constructs for AWS Services

This repository contains Python CDK constructs for various AWS services such as ACM, CloudFront, and S3.

## Table of Contents

- [AcmCertificate](#acmcertificate)
- [CloudfrontDistribution](#cloudfrontdistribution)
- [S3Bucket](#s3bucket)

## AcmCertificate

This construct creates an ACM certificate for a given domain name and associates it with a Route53 hosted zone.

### Parameters

- `domain_name`: The domain name for the certificate.
- `hosted_zone`: The Route53 hosted zone.

### Features

- Creates an ACM certificate.
- Enables transparency logging.

## CloudfrontDistribution

This construct creates a CloudFront distribution for either an S3 bucket or an HTTP origin.

### Parameters

- `domain_name`: The domain name for the CloudFront distribution.
- `origin_type`: The type of origin (either "s3" or "http").
- `certificate`: The ACM certificate.
- `website_s3_bucket`: The S3 bucket for the website (optional).
- `backup_website_s3_bucket`: The backup S3 bucket (optional).
- `api_gateway`: The API Gateway (optional).

### Features

- Creates a CloudFront distribution.
- Sets up origin access control for S3.
- Configures response headers and geo-restrictions.

## S3Bucket

This construct creates an S3 bucket with specific configurations.

### Features

- Creates an S3 bucket with versioning enabled.
- Blocks public access.
- Adds a lifecycle rule for noncurrent versions.