# Python CDK Stacks for AWS Services

This repository contains Python CDK stacks for various AWS services such as ACM, S3, CloudFront.

## Table of Contents

- [ACMCertificates](#acmcertificates)
- [BackupBucket](#backupbucket)
- [Main](#main)

## ACMCertificates

This stack creates ACM certificates for a given domain name.

### Parameters

- `account_id`: AWS account ID.
- `domain_name`: The domain name for the certificates.

### Features

- Creates an ACM certificate for the main domain.
- Associates the certificates with a Route53 hosted zone.

## BackupBucket

This stack creates an S3 bucket that serves as a backup for the game.

### Features

- Creates an S3 bucket with specific configurations.

## Main

This stack sets up the infrastructure for the game, including S3 buckets, CloudFront distributions, and API Gateway.

### Parameters

- `account_id`: AWS account ID.
- `region`: AWS region.
- `domain_name`: The domain name for the game.
- `source_file_path`: The path to the source files for the game.
- `environment`: The environment (e.g., dev, prod).
- `certificate`: The ACM certificate for the game.
- `contact_form_certificate`: The ACM certificate for the contact form.
- `backup_bucket`: The backup S3 bucket.

### Features

- Creates an S3 bucket for the game.
- Sets up a CloudFront distribution for the game.
- Sets up an API Gateway and Lambda function for the contact form.
- Creates a CloudFront distribution for the contact form API.
- Deploys game files to the S3 bucket.
- Deploys backup game files to the backup S3 bucket.