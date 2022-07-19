import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const securityGroupName = config.require('securitygroup')

const group = new aws.ec2.SecurityGroup("web-sg", {
    description: "Access for the server",
    tags: {
        Name: securityGroupName
    }
});

export const securityGroupId = group.id;
