from aws_cdk import (
    aws_s3 as s3,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    aws_certificatemanager as acm,
    RemovalPolicy,
)

from constructs import Construct


class CloudfrontDistribution(Construct):
    def __init__(
        self,
        scope: Construct,
        id: str,
        domain_name: str,
        origin_type: str,
        certificate: acm.Certificate,
        _s3_bucket: s3.Bucket = None,
        backup__s3_bucket: s3.Bucket = None,
        **kwargs,
    ) -> None:
        super().__init__(scope, id, **kwargs)

        # Create OAC for cloudfront to access S3
        cf_oac = cloudfront.CfnOriginAccessControl(
            self,
            f"OriginAccessControlResource",
            origin_access_control_config=cloudfront.CfnOriginAccessControl.OriginAccessControlConfigProperty(
                name=f"NGGOriginAccessControl",
                origin_access_control_origin_type=origin_type,
                signing_behavior="always",
                signing_protocol="sigv4",
                # the properties below are optional
                description=f"Origin Access Control for {domain_name}.",
            ),
        )

        self.cf_distribution = cloudfront.Distribution(
            self,
            f"CloudfrontDistributionResource",
            default_behavior=cloudfront.BehaviorOptions(
                origin=origins.OriginGroup(
                    primary_origin=origins.S3Origin(bucket=_s3_bucket),
                    fallback_origin=origins.S3Origin(bucket=backup__s3_bucket),
                ),
                viewer_protocol_policy=cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                allowed_methods=cloudfront.AllowedMethods.ALLOW_GET_HEAD,
                cached_methods=cloudfront.CachedMethods.CACHE_GET_HEAD,
                cache_policy=cloudfront.CachePolicy.CACHING_OPTIMIZED,
                response_headers_policy=cloudfront.ResponseHeadersPolicy.SECURITY_HEADERS,
            ),
            error_responses=[
                cloudfront.ErrorResponse(
                    http_status=404,
                    response_page_path="/error.html",
                ),
                cloudfront.ErrorResponse(
                    http_status=403,
                    response_page_path="/error.html",
                ),
            ],
            domain_names=[domain_name, f"www.{domain_name}"],
            default_root_object="index.html",
            price_class=cloudfront.PriceClass.PRICE_CLASS_100,
            comment=f"Distribution for {domain_name}",
            certificate=certificate,
            enabled=True,
            geo_restriction=cloudfront.GeoRestriction.denylist("RU"),
        )

        self.cf_distribution.apply_removal_policy(RemovalPolicy.DESTROY)

        # Get the L1 CloudFormation resource
        cfn__distribution = self.cf_distribution.node.default_child

        # Add OAC configuration
        cfn__distribution.add_property_override(
            "DistributionConfig.Origins.0.OriginAccessControlId",
            cf_oac.get_att("Id"),
        )

        # Remove OAI configuration
        cfn__distribution.add_property_override(
            "DistributionConfig.Origins.0.S3OriginConfig.OriginAccessIdentity",
            "",
        )
