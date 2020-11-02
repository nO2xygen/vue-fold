/*!
 * vue-foldable v1.0.0-alpha.1
 * (c) 2016-preset ULIVZ
 * Released under the MIT License.
 */
var VueIcon = {
  render: function render() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('svg', {
      attrs: {
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 400 400",
        "version": "1.1"
      }
    }, [_c('defs', {
      attrs: {
        "id": "defs6"
      }
    }), _vm._v(" "), _c('g', {
      attrs: {
        "transform": "matrix(1.3333333,0,0,-1.3333333,0,400)",
        "id": "g10"
      }
    }, [_c('g', {
      attrs: {
        "transform": "translate(178.0626,235.0086)",
        "id": "g12"
      }
    }, [_c('path', {
      staticStyle: {
        "fill": "#4dba87",
        "fill-opacity": "1",
        "fill-rule": "nonzero",
        "stroke": "none"
      },
      attrs: {
        "id": "path14",
        "d": "M 0,0 -22.669,-39.264 -45.338,0 h -75.491 L -22.669,-170.017 75.491,0 Z"
      }
    })]), _vm._v(" "), _c('g', {
      attrs: {
        "transform": "translate(178.0626,235.0086)",
        "id": "g16"
      }
    }, [_c('path', {
      staticStyle: {
        "fill": "#435466",
        "fill-opacity": "1",
        "fill-rule": "nonzero",
        "stroke": "none"
      },
      attrs: {
        "id": "path18",
        "d": "M 0,0 -22.669,-39.264 -45.338,0 H -81.565 L -22.669,-102.01 36.227,0 Z"
      }
    })])])]);
  },
  staticRenderFns: []
};

var DEFAULT_VISUAL_HEIGHT = 100;
var VueFoldable = {
  render: function render() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "vue-foldable"
    }, [_c('div', {
      ref: "container",
      staticClass: "vue-foldable-container",
      style: {
        maxHeight: _vm.currentMaxHeight + 'px'
      }
    }, [_vm._t("default")], 2), _vm._v(" "), !_vm.noMask ? _c('div', {
      staticClass: "vue-foldable-mask",
      class: {
        'collapsed': _vm.collapsed
      }
    }) : _vm._e(), _vm._v(" "), _vm._t("view-more", [_vm.reachThreshold ? _c('div', {
      staticClass: "vue-foldable-view-more",
      class: {
        'collapsed': _vm.collapsed
      },
      on: {
        "click": _vm.toggle
      }
    }, [_c('VueIcon', {
      staticClass: "vue-foldable-icon",
      class: {
        'collapsed': _vm.collapsed
      }
    }), _vm._v(" "), _c('span', {
      staticClass: "vue-foldable-text"
    }, [_vm._v(" " + _vm._s(_vm.collapsed ? 'View more' : 'Collapse') + " ")])], 1) : _vm._e()], {
      toggle: _vm.toggle,
      collapsed: _vm.collapsed
    })], 2);
  },
  staticRenderFns: [],
  name: 'vue-foldable',
  components: {
    VueIcon: VueIcon
  },
  props: {
    minHeight: {
      type: Number,
      default: DEFAULT_VISUAL_HEIGHT
    },
    height: {
      type: [Number, String],
      default: DEFAULT_VISUAL_HEIGHT
    },
    once: {
      type: Boolean,
      default: false
    },
    async: {
      type: Boolean,
      default: false
    },
    timeout: {
      type: Number,
      default: 3000
    },
    noMask: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    var height = this.height;

    if (typeof this.height === 'number' && this.height < this.minHeight) {
      height = this.minHeight;
    }

    return {
      collapsed: true,
      currentMaxHeight: height,
      threshold: height,
      reachThreshold: true,
      percentageMode: typeof this.height === 'string' && this.height.indexOf('%') !== -1,
      percentage: null
    };
  },
  created: function created() {
    if (this.percentageMode) {
      this.percentage = parseInt(this.threshold.replace('%', '').trim()) / 100;
    } else if (typeof this.height === 'string') {
      this.currentMaxHeight = this.threshold = DEFAULT_VISUAL_HEIGHT;
    }
  },
  mounted: function mounted() {
    this.handleMount(); // Temporary hack since this.$nextTick still cannot ensure all the sub components rendered.
    // See: https://vuejs.org/v2/api/#mounted

    setTimeout(this.handleMount, 50); // this.$nextTick(function () {
    //     this.handleMount()
    // })

    if (this.async) {
      onElementHeightChange({
        el: this.$refs.container,
        callback: this.handleMount,
        timeout: this.timeout
      });
    }
  },
  methods: {
    handleMount: function handleMount() {
      var contentHeight = this.$refs.container.scrollHeight;
      this.calculateThreshold(contentHeight);
      this.checkReachThresfold(contentHeight);
    },
    checkReachThresfold: function checkReachThresfold(contentHeight) {
      this.reachThreshold = contentHeight > this.threshold;
    },
    calculateThreshold: function calculateThreshold(contentHeight) {
      if (this.percentageMode) {
        var calculatedHeight = contentHeight * this.percentage;

        if (calculatedHeight < this.minHeight) {
          calculatedHeight = this.minHeight;
        }

        this.currentMaxHeight = calculatedHeight;
        this.threshold = calculatedHeight;
      }
    },
    toggle: function toggle() {
      this.collapsed = !this.collapsed;

      if (this.collapsed) {
        this.currentMaxHeight = this.threshold;
      } else {
        // explicitly set max height so that it can be transitioned
        this.currentMaxHeight = this.$refs.container.scrollHeight;

        if (this.once) {
          this.reachThreshold = false;
        }
      }
    }
  }
};

function onElementHeightChange(_ref) {
  var el = _ref.el,
      callback = _ref.callback,
      timeout = _ref.timeout;
  var oldHeight = el.scrollHeight,
      newHeight;
  var poller;
  var interval = 100;
  var count = 0;
  var maxCount = timeout / interval;

  function unit() {
    count++;
    newHeight = el.scrollHeight;

    if (oldHeight !== newHeight) {
      callback(newHeight);

      if (poller) {
        clearTimeout(poller);
      }
    }

    oldHeight = newHeight;

    if (count <= maxCount) {
      poller = setTimeout(unit, interval);
    }
  }

  unit();
}

export default VueFoldable;
/* follow me on Twitter! @_ulivz */
