import * as pulumi from "@pulumi/pulumi"
import "jest";

import * as network from "../src/network";

function promiseOf<T>(output: pulumi.Output<T>): Promise<T> {
    return new Promise(resolve => output.apply(resolve));
}

describe("Network", () => {

    let net: network.Network;

    beforeAll(() => {

        // Put Pulumi in unit-test mode, mocking all calls to cloud-provider APIs.
        pulumi.runtime.setMocks({

            // Mock calls to create new resources and return a canned response.
            newResource: (args: pulumi.runtime.MockResourceArgs): { id: string, state: any } => {
                pulumi.log.info(`Request to mock a ${args.type}`)

                let mock: { id: string, state: any }

                switch (args.type) {
                    case 'aws:ec2/securityGroup:SecurityGroup':
                        mock = {
                            id: `sg-9876543210`,
                            state: args.inputs,
                        };
                        break;

                    default: mock = {
                        id: `${args.name}-id`,
                        state: args.inputs,
                    };
                }
                return mock;
            },

            // Mock function calls and return whatever input properties were provided.
            call: (args: pulumi.runtime.MockCallArgs) => {
                return args.inputs;
            },
        });
    });

    beforeEach(async () => {
        net = new network.Network("test", {
            cidr: "172.16.40.0/24",
        })
    });

    it("has a VPC", async () => {
        const vpcId = await promiseOf(net.vpc);
        expect(vpcId).not.toBe(undefined);
    });

    it("has a Subnet", async () => {
        const subnetId = await promiseOf(net.subnet);
        expect(subnetId).not.toBe(undefined);
    });

    it("has a Security Group", async () => {
        const sgIdMatcher = expect.stringMatching(/^([0-9]*\/)?sg-([0-9]*)/);
        const sgId = await promiseOf(net.securityGroup);
        expect(sgId).not.toBe(undefined);
        expect(sgId).toEqual(sgIdMatcher);
    });

});
