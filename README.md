# bsky-to-aturi
Convert a Bluesky post URL to an AT URI in JavaScript. Uses the Bluesky public API to resolve handles to their DID when needed.

The function is implemented as an **`async` function**, because it may need to make a request to Bluesky's API to resolve a handle to its DID.

**Disclaimer**: This will almost certainly break. There is near-zero error handling present in the scripts. Use with caution. (Or just use the online tool below if you can and save the URI.)

## Demo / online tool
<https://gohjy.github.io/bsky-to-aturi>

## Usage
### ES Module
In your JavaScript (module):
```js
import bskyToAtUri from "https://cdn.jsdelivr.net/gh/gohjy/bsky-to-aturi@0.1.0/bsky-to-aturi.mjs";

// Later...
try {
    const atUri = await bskyToAtUri(bskyPostUrlFromSomewhere);
    if (!atUri) throw new Error();
    // do stuff with URI here
} catch(e) {
    console.error(e);
    console.log("No AT URI found, check your Bluesky post URL");
}
```

### Non-modular
Include the script from this URL:
```plain
https://cdn.jsdelivr.net/gh/gohjy/bsky-to-aturi@0.1.0/bsky-to-aturi.js
```
This will define a `bskyToAtUri` property on `globalThis`:
```js
bskyToAtUri(bskyPostUrl)
.then(uri => {
    if (!uri) throw new Error();
    // do stuff with URI here
})
.catch(() => {
    console.log("No AT URI found. Check your Bluesky post URL.");
})
```

## License
[MIT](./LICENSE) ([view on choosealicense.com](https://choosealicense.com/licenses/mit/))