//     Ctor.js 0.1.0
//     Copyright (c) 2012 Todd Lucas
//     Ctor may be freely distributed under the MIT license.

(function () {

    // Setup
    // -----

    var root = this;

    var previous = root.Ctor;

    var Ctor = this.Ctor = {};

    Ctor.VERSION = '0.1.0';

    var deriving = false;

    // Run Ctor.js in *noConflict* mode, returning the `Ctor` variable to its
    // previous owner. Returns a reference to the Ctor object.
    Ctor.noConflict = function () {
        root.Ctor = previous;
        return this;
    };

    // Copy any source properties to the destination.
    var extend = function (dst, src) {
        for (var prop in src) {
            if (src[prop] !== void 0) dst[prop] = src[prop];
        }
    };

    // Ctor.derive
    // -----------

    // Ctor implements pseudo-classical inheritance using JavaScript
    // prototypal inheritance, while preserving the native JavaScript
    // constructor pattern. Classical constructors are implemented
    // using the `init` method.
    //
    // The constructor function must invoke `this.ctor` with the 
    // `arguments` object in order to invoke the `init` chain.
    // The base class in a class hierarchy must derive from Object.
    //
    //      function MyBase () {
    //          this.ctor(arguments);
    //      }
    //
    //      Ctor.derive(MyBase, Object, {
    //          init: function(arg1, arg2) {
    //              // This will be defined on all instances of 
    //              // MyBase or any derived types.
    //              this.instanceProperty = arg1;
    //          }
    //      });
    //
    // The `init` method is optional and should be defined in the
    // prototope extensions. Instance properties and methods should
    // be initialized within `init` and prototype properties and
    // methods may be added to the extensions object.
    //
    Ctor.derive = function (derived, base, extensions, statics) {
        deriving = true;
        derived.prototype = new base();
        deriving = false;

        if (extensions) extend(derived.prototype, extensions);
        if (statics) extend(derived, statics);

        derived.prototype.constructor = derived;

        derived.prototype.ctor = function (args) {
            if (deriving)
                return;

            if (base.prototype.hasOwnProperty('ctor'))
                base.prototype.ctor.call(this, args);

            if (derived.prototype.hasOwnProperty('init'))
                derived.prototype.init.apply(this, args);
        };
    };
})();
