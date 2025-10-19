async function resolveHandle(handle) {
    const fetchUrl = new URL("https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle");
    fetchUrl.searchParams.set("handle", handle);
    const fetchResult = await fetch(fetchUrl.href).catch(() => ({
        error: "FetchError",
        message: "Failed to fetch Bluesky API"
    }));
    if (fetchResult.error) return fetchResult;

    const json = await fetchResult.json().catch(() => ({
        error: "ServerError",
        message: "Bluesky API did not return valid JSON"
    }));
    
    if (json.did) return json.did;
    return json;
}

const REGEX = {
    // https://atproto.com/specs/did#at-protocol-did-identifier-syntax
    DID: /^did:[a-z]+:[a-zA-Z0-9._:%-]*[a-zA-Z0-9._-]$/,

    // https://atproto.com/specs/handle#handle-identifier-syntax
    HANDLE: /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/,

    // https://github.com/bluesky-social/atproto/blob/main/lexicons/app/bsky/feed/post.json#L8 specifies app.bsky.feed.post records must have TID rkey
    // https://atproto.com/specs/tid#tid-syntax
    TID: /^[234567abcdefghij][234567abcdefghijklmnopqrstuvwxyz]{12}$/
};

function destructureBskyUrl(bskyUrl) {
    const urlObj = (() => {
        try {
            return new URL(bskyUrl);
        } catch {
            return null;
        }
    })();
    if (!urlObj) return null;

    const pathname = urlObj.pathname;

    const [_fullMatch, handleOrDid, rkey] = pathname.match(/^\/profile\/([^\/]+)(?:\/(?:post\/([^\/]+)\/?)?)?$/) || [null];

    if (!_fullMatch) return null;
    if (rkey && !rkey.match(REGEX.TID)) return null;

    if (handleOrDid.match(REGEX.HANDLE)) {
        return {
            type: "handle", 
            repo: handleOrDid,
            rkey
        };
    } else if (handleOrDid.match(REGEX.DID)) {
        return {
            type: "did",
            repo: handleOrDid,
            rkey
        };
    }

    return null;
}

function constructUri({repo, rkey}) {
    if (!rkey) {
        // default to app.bsky.actor.profile
        return `at://${repo}/app.bsky.actor.profile/self`;
    } 
    return `at://${repo}/app.bsky.feed.post/${rkey}`;
}

export default async function(bskyUrl) {
    const urlComponents = destructureBskyUrl(bskyUrl);
    if (!urlComponents) throw {
        error: "InvalidUrl",
        message: "Invalid Bluesky URL provided"
    };

    if (urlComponents.type === "did") {
        // just construct URI and return
        return constructUri(urlComponents);
    } else {
        // it's a handle
        // 1. resolve handle
        const did = await resolveHandle(urlComponents.repo);
        if (did.error) throw did;

        // 2. construct URI and return
        return constructUri({
            repo: did,
            rkey: urlComponents.rkey
        });
    }
}
