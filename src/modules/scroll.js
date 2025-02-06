$.extend({
    scrollTop: function (val) {
        if (not(val)) {
            return window.scrollY;
        }
        window.scrollTo(window.scrollX, val);
    },

    scrollLeft: function (val) {
        if (not(val)) {
            return window.scrollX;
        }
        window.scrollTo(val, window.scrollY);
    },
    
    scrollTo: function (x, y) {
        window.scrollTo(x, y);
    },
    
    scrollToElement: function (el) {
        $(el).scrollTo();
    }    
})

$.fn.extend({
    scrollTop: function (val) {
        if (not(val)) {
            return this.length === 0 ? undefined : this[0] === window ? scrollY : this[0].scrollTop;
        }
        return this.each(function () {
            this.scrollTop = val;
        });
    },

    scrollLeft: function (val) {
        if (not(val)) {
            return this.length === 0 ? undefined : this[0] === window ? scrollX : this[0].scrollLeft;
        }
        return this.each(function () {
            this.scrollLeft = val;
        });
    },
    
    scrollTo: function (relativeToViewport = false) {
        if (this.length === 0) {
            return this;
        }
        const rect = this[0].getBoundingClientRect();
        const x = rect.left + (relativeToViewport ? 0 : window.scrollX)
        const y = rect.top + (relativeToViewport ? 0 : window.scrollY)
        window.scrollTo(x, y);
        return this;
    }
})