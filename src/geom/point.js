(function () {
  var point_static_properties,
      isPoint,
      doodle_Point,
      check_point_type,
      check_number_type = doodle.utils.types.check_number_type;
  
  /* Super constructor
   * @param {Number|Array|Point|Function} (x,y)|initializer
   * @return {Object}
   */
  doodle_Point = doodle.geom.Point = function (x, y) {
    var point = {},
        arg_len = arguments.length,
        init_obj; //function, array, point

    /*DEBUG*/
    if (arg_len > 2) {
      throw new SyntaxError("[object Point](x, y): Invalid number of parameters.");
    }
    /*END_DEBUG*/

    Object.defineProperties(point, point_static_properties);
    //properties that require privacy
    Object.defineProperties(point, {
      /* The horizontal coordinate of the point.
       * @param {Number} x
       */
      'x': {
        enumerable: true,
        configurable: false,
        get: function () { return x; },
        set: function (n) {
          /*DEBUG*/
          check_number_type(n, this+'.x');
          /*END_DEBUG*/
          x = n;
        }
      },

      /* The vertical coordinate of the point.
       * @param {Number} y
       */
      'y': {
        enumerable: true,
        configurable: false,
        get: function () { return y; },
        set: function (n) {
          /*DEBUG*/
          check_number_type(n, this+'.y');
          /*END_DEBUG*/
          y = n;
        }
      }
    });

    //initialize point
    if (arg_len === 0) {
      //default instantiation: {x:0, y:0}
      point.compose(0, 0);
    } else if (arg_len === 2) {
      //standard instantiation
      point.compose(x, y);
    } else {
      //passed an initialization obj
      init_obj = arguments[0];
      x = undefined;
      
      if (typeof init_obj === 'function') {
        point.compose(0, 0);
        init_obj.call(point);
      }  else if (Array.isArray(init_obj)) {
        /*DEBUG*/
        if (init_obj.length !== 2) {
          throw new SyntaxError("[object Point]([x, y]): Invalid array parameter.");
        }
        /*END_DEBUG*/
        point.compose.apply(point, init_obj);
      } else {
        /*DEBUG*/
        check_point_type(init_obj, '[object Point](point)');
        /*END_DEBUG*/
        point.compose(init_obj.x, init_obj.y);
      }
    }

    return point;
  };

  
  point_static_properties = {
    /* The length of the line segment from (0,0) to this point.
     * @return {Number}
     */
    'length': {
      enumerable: true,
      configurable: false,
      get: function () {
        return this.distance({x:0,y:0}, this);
      }
    },

    /*
     * METHODS
     */
    
    /* Set point coordinates.
     * @param {Number} x
     * @param {Number} y
     * @return {Point}
     */
    'compose': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (x, y) {
        /*DEBUG*/
        check_number_type(x, this+'.compose', '*x*, y');
        check_number_type(y, this+'.compose', 'x, *y*');
        /*END_DEBUG*/
        this.x = x;
        this.y = y;
        return this;
      }
    },

    /* Creates a copy of this Point object.
     * @return {Point}
     */
    'clone': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function () {
        return doodle_Point(this.x, this.y);
      }
    },

    /* Returns an array that contains the values of the x and y coordinates.
     * @return {Array}
     */
    'toArray': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function () {
        var a = new Array(2);
        a[0] = this.x;
        a[1] = this.y;
        return a;
      }
    },
    
    /* Returns a string that contains the values of the x and y coordinates.
     * @return {String}
     */
    'toString': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function () {
        return "(x=" + this.x + ", y=" + this.y + ")";
      }
    },

    /* Returns the distance between pt1 and pt2.
     * @return {Number}
     */
    'distance': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (pt1, pt2) {
        /*DEBUG*/
        check_point_type(pt1, this+'.distance', '*pt1*, pt2');
        check_point_type(pt2, this+'.distance', 'pt1, *pt2*');
        /*END_DEBUG*/
        var dx = pt2.x - pt1.x,
            dy = pt2.y - pt1.x;
        return Math.sqrt(dx*dx+dy*dy);
      }
    },

    /* Scales the line segment between (0,0) and the
     * current point to a set length.
     * @param {Number} thickness The scaling value.
     * @return {Point}
     */
    'normalize': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (thickness) {
        /*DEBUG*/
        check_number_type(thickness, this+'.normalize', '*thickness*');
        /*END_DEBUG*/
        var len = this.length;
        this.x = (this.x / len) * thickness;
        this.y = (this.y / len) * thickness;
        return this;
        /*correct version?
          var angle:Number = Math.atan2(this.y, this.x);
          this.x = Math.cos(angle) * thickness;
          this.y = Math.sin(angle) * thickness;
        */
      }
    },

    /* Determines whether two points are equal.
     * @param {Point} pt The point to be compared.
     * @return {Boolean}
     */
    'equals': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (pt) {
        /*DEBUG*/
        check_point_type(pt, this+'.equals', '*point*');
        /*END_DEBUG*/
        return ((this && pt &&
                 this.x === pt.x &&
                 this.y === pt.y) ||
                (!this && !pt));
      }
    },

    /* Determines a point between two specified points.
     * @static
     * @param {Point} pt1 The first point.
     * @param {Point} pt2 The second point.
     * @param {Number} t The level of interpolation between the two points, between 0 and 1.
     * @return {Point}
     */
    'interpolate': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (pt1, pt2, t) {
        /*DEBUG*/
        check_point_type(pt1, this+'.interpolate', '*pt1*, pt2, t');
        check_point_type(pt2, this+'.interpolate', 'pt1, *pt2*, t');
        check_number_type(t, this+'.interpolate', 'pt1, pt2, *t*');
        /*END_DEBUG*/
        var x = pt1.x + (pt2.x - pt1.x) * t,
            y = pt1.y + (pt2.y - pt1.y) * t;
        return doodle_Point(x, y);

        /* correct version?
           var nx = pt2.x - pt1.x;
           var ny = pt2.y - pt1.y;
           var angle = Math.atan2(ny , nx);
           var dis = Math.sqrt(x * nx + ny * ny) * t;
           var sx = pt2.x - Math.cos(angle) * dis;
           var sy = pt2.y - Math.sin(angle) * dis;
           return Object.create(point).compose(sx, sy);
        */
      }
    },

    /* Converts a pair of polar coordinates to a Cartesian point coordinate.
     * @static
     * @param {Number} len The length coordinate of the polar pair.
     * @param {Number} angle The angle, in radians, of the polar pair.
     * @return {Point}
     */
    'polar': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (len, angle) {
        /*DEBUG*/
        check_number_type(len, this+'.polar', '*len*, angle');
        check_number_type(angle, this+'.polar', 'len, *angle*');
        /*END_DEBUG*/
        var x = len * Math.cos(angle),
            y = len * Math.sin(angle);
        return doodle_Point(x, y);
      }
    },

    /* Adds the coordinates of another point to the coordinates of
     * this point to create a new point.
     * @param {Point} pt The point to be added.
     * @return {Point} The new point.
     */
    'add': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (pt) {
        /*DEBUG*/
        check_point_type(pt, this+'.add', '*point*');
        /*END_DEBUG*/
        var x = this.x + pt.x,
            y = this.y + pt.y;
        return doodle_Point(x, y);
      }
    },

    /* Subtracts the coordinates of another point from the
     * coordinates of this point to create a new point.
     * @param {Point} pt The point to be subtracted.
     * @return {Point} The new point.
     */
    'subtract': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (pt) {
        /*DEBUG*/
        check_point_type(pt, this+'.subtract', '*point*');
        /*END_DEBUG*/
        var x = this.x - pt.x,
            y = this.y - pt.y;
        return doodle_Point(x, y);
      }
    },

    'offset': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (dx, dy) {
        /*DEBUG*/
        check_number_type(dx, this+'.offset', '*dx*, dy');
        check_number_type(dy, this+'.offset', 'dx, *dy*');
        /*END_DEBUG*/
        this.x += dx;
        this.y += dy;
        return this;
      }
    }
  };//end point_static_properties definition

  /*
   * CLASS FUNCTIONS
   */

  /* Check if a given object contains a numeric x and y property.
   * Does not check if a point is actually a doodle.geom.point.
   * @param {Point} point Object with x and y numeric parameters.
   * @param {String} fn_name Function name to show in TypeError message.
   * @return {Boolean}
   */
  isPoint = doodle.geom.Point.isPoint = function (pt) {
    return (pt && typeof pt.x === 'number' && typeof pt.y === 'number');
  };

  check_point_type = doodle.utils.types.check_point_type = function (pt, caller, param) {
    if (!isPoint(pt)) {
      caller = (caller === undefined) ? "check_point_type" : caller;
      param = (param === undefined) ? "" : '('+param+')';
      throw new TypeError(caller + param +": Parameter must be a point.");
    } else {
      return true;
    }
  };
  
}());//end class closure
