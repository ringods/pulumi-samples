
import * as aws from "@pulumi/aws";

const securityGroupName = "web-sg"

const group = new aws.ec2.SecurityGroup(securityGroupName, {
    name: securityGroupName,
    description: "Access for the server",
    tags: {
        Name: securityGroupName
    }
});

// const rule = new aws.ec2.SecurityGroupRule("http_access", {
//     securityGroupId: group.id,
//     description: "Enable HTTP access",
//     type: "ingress",
//     protocol: "tcp",
//     fromPort: 80,
//     toPort: 80,
//     cidrBlocks: ["0.0.0.0/0"]
// });

// const server = new aws.ec2.Instance("web-server", {
//     ami: "ami-0141514361b6a3c1b", // Ubuntu 20.04 Server - eu-west-1 - amd64
//     instanceType: "t2.micro",
//     // vpcSecurityGroupIds: [securityGroupName],
//     vpcSecurityGroupIds: [group.id],
//     tags: {
//         Name: "web-server"
//     }
// });

// export const publicIp = server.publicIp;
// export const publicDns = server.publicDns;
