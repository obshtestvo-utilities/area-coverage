# area-coverage

## What it does
It allows adding rectangular areas to a central (in-memory) registry where they are merged.

You can then check if certain area *(which bounds are defined by 4 points)* is within the registry,
a.k.a within coverage.

The points for the area's bounds are defined as sequence of `{X:.., Y:..}` objects
for `top left`, `top right`, 'bottom right', 'bottom left'.


## Usage example

This is example of using `area-coverage` when you have an app with Google maps and some server-side logic
that loads data on the map.

```js
var coverage = new Coverage({
    boundTransformation: googleBoundsTransformation,
    multiplier: 1000
})

// @var {google.Map} map

//... the initial map view
coverage.add(map.getBounds())

//... user moves map
if (coverage.contains(map.getBounds()) {
    // do nothing
} else {
    var boundsOutOfCoverage = map.getBounds();
    coverage.add(boundsOutOfCoverage);
    serverLoadMoreDataOnNewArea(boundsOutOfCoverage);
}
```