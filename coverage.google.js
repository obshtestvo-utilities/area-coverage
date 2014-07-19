/**
 * Tranformation function for Google Bounds object
 *
 * @param {Google.map.Bounds} bounds The bounds of the area
 * @param {int} multiplier A multiplier for floating-point coordinates that will guarantee precision when converted to integer
 * @return {Object} Array of points [topLeft, topRight, bottomRight, bottomLeft]
 *        formatted as [{X:1, Y:1}, {X:.., Y:..}]
 */
var googleBoundsTransformation = function(bounds, multiplier) {
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();
    var points = [
        new google.maps.LatLng(ne.lat(), sw.lng()),
        ne,
        new google.maps.LatLng(sw.lat(), ne.lng()),
        sw
    ];
    var path = [];
    for (var i = 0; i < points.length; i++) {
        path.push({
            X: points[i].lat() * multiplier,
            Y: points[i].lng() * multiplier
        })
    }
}
