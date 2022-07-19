
import * as aws from "@pulumi/aws";

const securityGroupName = "web-sg"

const group = new aws.ec2.SecurityGroup("web-sg", {
    description: "Access for the server",
    tags: {
        Name: securityGroupName
    }
});

export const securityGroupId = group.id;
