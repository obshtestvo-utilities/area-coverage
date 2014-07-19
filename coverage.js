

var Coverage = function(options) {
    if (!options) {
        this.options = Coverage.defaultOptions;
        return;
    }
    this.options = {
        boundTransformation: options.boundTransformation || Coverage.defaultOptions.boundTransformation,
        multiplier: options.multiplier || Coverage.defaultOptions.multiplier
    }
};

Coverage.defaultOptions = {
    boundTransformation: null,
    multiplier: 1
};

Coverage.prototype = {
    options: {},
    coveragePaths: null,
    scale: 100,
    lib: ClipperLib,
    fillType: ClipperLib.PolyFillType.pftNonZero,

    /**
     * Set google bounds as coverage
     * @param {Object} bounds
     */
    set: function(bounds){
        this.coveragePaths = this.toPaths(bounds)
    },

    /**
     * Add google bounds to coverage
     * @param {Object} bounds
     */
    add: function(bounds){
        this._add(this.toPaths(bounds))
    },

    /**
     * Check if bounds are in our coverage
     *
     * @param bounds
     * @returns {boolean}
     */
    contains: function(bounds) {
        if (!this.coveragePaths) return false;
        var paths = this.toPaths(bounds);
        return this._getArea(this._intersect(paths)) == this._getArea(paths)
    },

    /**
     * Convert Google Bounds object to Clipper paths
     * @param {Object} bounds
     * @returns {*[]}
     */
    toPaths: function(bounds) {
        if (typeof this.options.boundTransformation == 'function') {
            bounds = this.options.boundTransformation(bounds, this.options.multiplier)
        }
        var paths = [bounds];
        this.lib.JS.ScaleUpPaths(paths, this.scale);
        return paths
    },

    /**
     * Calculate Area
     * @param paths
     */
    _getArea: function(paths) {
        return this.lib.JS.AreaOfPolygons(paths, this.scale)
    },

    /**
     * Add paths to coverage
     * @param {Array[]} paths
     * @private
     */
    _add: function(paths){
        if (!this.coveragePaths) {
            this.coveragePaths = paths;
        }
        var cpr = this._getClipper();
        cpr.AddPaths(paths, this.lib.PolyType.ptClip, true);

        var union = new this.lib.Paths();
        cpr.Execute(this.lib.ClipType.ctUnion, union, this.fillType, this.fillType);
        this.coveragePaths = union
    },

    /**
     * Get intersection
     * @param paths
     * @private
     */
    _intersect: function(paths){
        var cpr = this._getClipper();
        cpr.AddPaths(paths, this.lib.PolyType.ptClip, true);

        var intersection = new this.lib.Paths();
        cpr.Execute(this.lib.ClipType.ctIntersection, intersection, this.fillType, this.fillType);
        return intersection;
    },

    /**
     * Init Clipper and add coverage as subject
     * @returns {ClipperLib.Clipper}
     * @private
     */
    _getClipper: function(){
        var cpr = new ClipperLib.Clipper();
        cpr.AddPaths(this.coveragePaths, this.lib.PolyType.ptSubject, true);
        return cpr;
    }
}