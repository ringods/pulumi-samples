import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export interface NetworkArgs {
    cidr: pulumi.Input<string>
};

export class Network extends pulumi.ComponentResource {

    private _vpc: aws.ec2.Vpc;
    private _subnet: aws.ec2.Subnet;
    private _securityGroup: aws.ec2.SecurityGroup;

    constructor(name: string, args: NetworkArgs, opts?: pulumi.ComponentResourceOptions) {
        super("org:network:Network", name, {}, opts);

        this._vpc = new aws.ec2.Vpc(name,
            {
                cidrBlock: args.cidr,
                tags: {
                    Name: name
                }
            },
            {
                parent: this
            }
        )

        this._subnet = new aws.ec2.Subnet(name,
            {
                cidrBlock: args.cidr,
                vpcId: this._vpc.id,
                tags: {
                    Name: name
                }
            },
            {
                parent: this,
                aliases: [
                    {
                        // In case we already had a subnet defined before abstracting it in a component
                        name: "some-old-name",
                        parent: pulumi.rootStackResource
                    },

                ]
            }
        )

        this._securityGroup = new aws.ec2.SecurityGroup(name,
            {
                vpcId: this._vpc.id,
                tags: {
                    Name: name
                }
            },
            {
                parent: this
            }
        )
    }

    public get vpc(): pulumi.Output<string> {
        return this._vpc.id;
    }

    public get subnet(): pulumi.Output<string> {
        return this._subnet.id;
    }

    public get securityGroup(): pulumi.Output<string> {
        return this._securityGroup.id;
    }

}