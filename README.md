# bsky-to-aturi
Convert a Bluesky post URL to an AT URI in JavaScript. Uses the Bluesky public API (`public.api.bsky.app`) to resolve handles to their DID when needed.

The function is implemented as an **`async` function**, because it may need to make a request to Bluesky's API to resolve a handle to its DID.

## Demo / online tool
<https://gohjy.github.io/bsky-to-aturi>

## Usage
In your JavaScript (only ES module script is provided):
```js
import bskyToAtUri from "https://cdn.jsdelivr.net/gh/gohjy/bsky-to-aturi@0.2.1/bsky-to-aturi.mjs";

// Later...
try {
    const atUri = await bskyToAtUri(bskyPostUri);
    // do stuff with URI
} catch({ error, message }) {
    // error handling
    console.error(`Something went wrong: ${error}: ${message}`);
}

// alternatively, if you don't need error handling:
const uri = await bskyToAtUri(bskyPostUrl).catch(() => null);
if (!uri) {
    // something went wrong
} else {
    // do stuff with URI
}
```

## Documentation
Pass a string to the function in one of the following forms:
- `https://bsky.app/profile/{handleOrDid}` (will be returned as a `app.bsky.actor.profile/self` URI)
- `https://bsky.app/profile/{handleOrDid}/post/{postId}`

The hostname need not be `bsky.app`, any syntactically valid hostname will be accepted.

The function will return a `Promise`.

### Scenario 1: everything went fine
The Promise resolves to a string, which is the AT URI.

### Scenario 2: something went wrong
The Promise will reject with an object. The `error` and `message` properties will contain more information. The `error` property is intended for code to distinguish between errors, while the `message` property is a human-readable message.

Possible `error` values include:
- `InvalidUrl`: invalid Bluesky URL provided
- `FetchError`: `fetch()` failed. Most likely a network error.
- `ServerError`: Bluesky API returned an invalid response (invalid JSON)

## License
[MIT License](./LICENSE) ([view on choosealicense.com](https://choosealicense.com/licenses/mit/))
