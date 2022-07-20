import * as aws from "@pulumi/aws";
import * as network from "./network";

// default providers
const fullNetwork = new network.Network("full",
    {
        cidr: "172.16.40.0/24"
    }
)

// custom providers
const otherRegionProvider = new aws.Provider("us_east_provider",
    {
        region: "us-east-1"
        // It will pick up the same credentials
    }
)

const specificRegionNetwork = new network.Network("full_us_east",
    {
        cidr: "172.16.30.0/24"
    },
    {
        providers: {
            aws: otherRegionProvider
        }
    }
)
