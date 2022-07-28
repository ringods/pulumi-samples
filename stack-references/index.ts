import * as pulumi from "@pulumi/pulumi"
import * as aws from "@pulumi/aws";

const stack = pulumi.getStack()
const stackOutputs = new pulumi.StackReference(`team-ce/stack-outputs/${stack}`)

const securityGroupId = stackOutputs.requireOutput("securityGroupId")

const rule = new aws.ec2.SecurityGroupRule("http_access", {
    securityGroupId: securityGroupId,
    description: "Enable HTTP access",
    type: "ingress",
    protocol: "tcp",
    fromPort: 80,
    toPort: 80,
    cidrBlocks: ["0.0.0.0/0"],
});
