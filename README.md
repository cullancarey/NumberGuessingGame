# NumberGuessingGame

## About

[Numberguessinggame.com](https://numberguessinggame.com) is similar to Wordle, but with a twist—it uses numbers! Players get six attempts to guess a three-digit number. After each guess, the game provides feedback, helping narrow down the possible numbers and boosting the player's odds of success. The game also tracks statistics such as games played and games won. I embarked on this project as an introductory step to delve into JavaScript and web design, and it served as a valuable learning experience.

## Demo
![numberguessinggame_demo](https://github.com/cullancarey/NumberGuessingGame/assets/14019001/bb779716-157c-4ee8-9b49-b0fa90e24578)





## Automation

The automation for this repository's deployment utilizes AWS StackSets configured for my AWS organization. My [AWS Deployment Roles](https://github.com/cullancarey/aws_deployment_roles) repository contains CDK code that defines the CloudFormation StackSet, which deploys the deployment roles to the member accounts of my organization. I have created an OIDC GitHub Actions user in my management account. GitHub Actions assume this role first and then use it to assume the deployment roles in the member accounts. For more details, see [GitHub Actions Workflows](./.github/workflows).

## CDK Infrastructure

The website infrastructure is fully managed by AWS CDK. The CDK code is organized into constructs and stacks.

### Constructs

- [ACMCertificates](src/my_constructs/acm_certificate.py): Manages ACM certificates.
- [CloudfrontDistribution](src/my_constructs/cloudfront_distribution.py): Manages CloudFront distributions.
- [S3Bucket](src/my_constructs/s3_bucket.py): Creates and configures S3 buckets.

For more details, see [Constructs](src/my_constructs/).

### Stacks

- [ACMCertificates](src/stacks/acm_certificates.py): ACM certificates stack.
- [BackupBucket](src/stacks/backup_website_bucket.py): Backup bucket stack.
- [Main](src/stacks/website.py): Main stack.

For more details, see [Stacks](src/stacks/).

### Entry Point

- [app.py](src/app.py): The entry point for the CDK application.

