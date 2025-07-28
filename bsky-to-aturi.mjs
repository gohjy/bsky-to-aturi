const bskyToAtUri = async (bskyUri) => {
    if (!bskyUri.match(
        /^https\:\/\/bsky\.app\/profile\/(did\:[a-z]+\:[a-zA-Z0-9\._\:\%\-]*[a-zA-Z0-9\._\-])|(([a-zA-Z0-9\-]{1,63}\.)+[a-zA-Z][a-zA-Z0-9\-]+)\/post\/[A-Za-z0-9\._\:\~\-]+$/
    )) return null;

    const urlObj = new URL(bskyUri);
    const urlified = urlObj.href;

    let did = urlified.match(/(?<=^https\:\/\/bsky\.app\/profile\/)[^\/]+(?=\/post\/[A-Za-z0-9\._\:\~\-]+$)/)[0];
    if (!did.match(/did\:[a-z]+\:[a-zA-Z0-9\._\:\%\-]*[a-zA-Z0-9\._\-]/)) {
        const reqUrl = new URL("https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle");
        reqUrl.searchParams.set("handle", did);
        did = await (await fetch(reqUrl)).json();
        if (did.error) return null;        
        did = did.did;
    }

    return `at://${did}/app.bsky.feed.post/${urlified.split("/").pop()}`;
}

export {bskyToAtUri as default};