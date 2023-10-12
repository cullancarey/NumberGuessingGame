from aws_cdk import Stack, aws_route53 as route53
from constructs import Construct
from my_constructs.acm_certificate import AcmCertificate


class ACMCertificates(Stack):
    def __init__(self, scope: Construct, id: str, domain_name: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        _hosted_zone = route53.HostedZone.from_lookup(
            self, f"{id}-HostedZone", domain_name=domain_name
        )

        self.website_certificate = AcmCertificate(
            self,
            "Certificate",
            domain_name=domain_name,
            hosted_zone=_hosted_zone,
        )
