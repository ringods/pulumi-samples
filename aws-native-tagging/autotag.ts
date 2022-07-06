import * as pulumi from "@pulumi/pulumi";
import { isTaggable } from "./taggable";

/**
 * registerAutoTags registers a global stack transformation that merges a set
 * of tags with whatever was also explicitly added to the resource definition.
 */
export function registerAutoTags(autoTags: Record<string, string>): void {
    pulumi.runtime.registerStackTransformation((args) => {
        if (isTaggable(args.type)) {
            let extraTags = new Array<{key:string, value:string}>()
            for (let autoTagsKey in autoTags) {
                extraTags.push({key: autoTagsKey, value: autoTags[autoTagsKey]})
            }
            args.props["tags"] = extraTags.concat(args.props["tags"]);
            return { props: args.props, opts: args.opts };
        }
        return undefined;
    });
}