import * as pulumi from "@pulumi/pulumi";
import * as aws_native from "@pulumi/aws-native";
import { registerAutoTags } from "./autotag";

// Automatically inject tags.
const config = new pulumi.Config();
registerAutoTags({
    "user:Project": pulumi.getProject(),
    "user:Stack": pulumi.getStack(),
    "user:Cost Center": config.require("costCenter"),
});

// Create a bunch of AWS resources -- with auto-tags!

const bucket = new aws_native.s3.Bucket("my-bucket", {
    tags: [{ key: "customKey", value: "customValue" }]
});

const server = new aws_native.kms.Key("encrypt-key", {
    keyPolicy: JSON.stringify({
        Version: "2012-10-17",
        Id: "key-policy-allow-all",
        Statement: [
            {
                Sid: "Enable IAM User Permissions",
                Effect: "Allow",
                Principal: {
                    AWS: "*"
                },
                Action: "kms:*",
                Resource: "*",
            },
        ],
    })
});

// Export the name of the bucket
export const bucketName = bucket.id;
