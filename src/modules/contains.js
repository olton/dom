$.fn.extend({
    _getDefaultElement(sel){
        let el;
        
        if (not(sel)) {
            el = this[0];
        } else if (sel instanceof HTMLElement) {
            el = sel;
        } else if (sel instanceof $ && sel.length > 0) {
            el = sel[0];
        } else if (typeof sel === "string") {
            el = $(sel)[0];
        } else {
            el = undefined;
        }
        
        return el;
    },
    
    index: function(sel){
        let el, _index = -1;

        if (this.length === 0) { return _index; }

        el = this._getDefaultElement(sel);

        if (!el) { return _index; }
        
        if (el && el.parentNode) $.each(el.parentNode.children, function(i){
            if (this === el) {
                _index = i;
            }
        });
        
        return _index;
    },

    indexOf: function(sel){
        let el, _index = -1;

        if (this.length === 0) { return _index; }
        
        el = this._getDefaultElement(sel);

        if (!el) { return _index; }

        this.each(function(i){
            if (this === el) {
                _index = i;
            }
        });
        
        return _index;
    },

    get: function(i){
        if (i === undefined) {
            return this
        }
        return i < 0 
            ? this[ i + this.length ] 
            : i > this.length - 1 
                ? undefined 
                : this[ i ];
    },

    eq: function(i){
        if (not(i)) {
            return this;
        }
        return this.length > 0 ? $.extend($(this.get(i)), {_prevObj: this}) : this;
    },

    is: function(s){
        let result = false;

        if (this.length === 0) {
            return false;
        }

        if (s instanceof $) {
            return this.same(s);
        }

        if (s === ":selected") {
            this.each(function(){
                if (this.selected) result = true;
            });
        } else

        if (s === ":checked") {
            this.each(function(){
                if (this.checked) result = true;
            });
        } else

        if (s === ":visible") {
            result = false;
            this.each(function(){
                if (isVisible(this)) result = true;
            });
        } else

        if (s === ":hidden") {
            this.each(function(){
                const styles = getComputedStyle(this);
                if (
                    this.getAttribute('type') === 'hidden'
                        || this.hidden
                        || styles.display === 'none'
                        || styles.visibility === 'hidden'
                        || parseInt(styles.opacity) === 0
                ) result = true;
            });
        } else

        if (typeof  s === "string" && [':selected'].indexOf(s) === -1) {
            this.each(function(){
                if (matches.call(this, s)) {
                    result = true;
                }
            });
        } else

        if (isArrayLike(s)) {
            this.each(function(){
                const el = this;
                $.each(s, function(){
                    const sel = this;
                    if (el === sel) {
                        result = true;
                    }
                });
            });
        } else

        if (typeof s === "object" && s.nodeType === 1) {
            this.each(function(){
                if  (this === s) {
                    result = true;
                }
            });
        }

        return result;
    },

    same: function(o){
        let result = true;

        if (!(o instanceof $)) {
            o = $(o);
        }

        if (this.length !== o.length) return false;

        this.each(function(){
            if (o.items().indexOf(this) === -1) {
                result = false;
            }
        });

        return result;
    },

    last: function(){
        return this.eq(this.length - 1);
    },

    first: function(){
        return this.eq(0);
    },

    odd: function(){
        const result = this.filter(function(el, i){
            return (i + 1) % 2 !== 0;
        });
        return $.extend(result, {_prevObj: this});
    },

    even: function(){
        const result = this.filter(function(el, i){
            return (i + 1) % 2 === 0;
        });
        return $.extend(result, {_prevObj: this});
    },

    filter: function(fn){
        if (typeof fn === "string") {
            const sel = fn;
            fn = function(el){
                return matches.call(el, sel);
            };
        }

        return $.extend($.merge($(), [].filter.call(this, fn)), {_prevObj: this});
    },

    find: function(s){
        let res = [], result;

        if (s instanceof $) return s;

        if (this.length === 0) {
            result = this;
        } else {
            this.each(function () {
                const el = this;
                if (typeof el.querySelectorAll === "undefined") {
                    return ;
                }
                res = res.concat([].slice.call(el.querySelectorAll(s)));
            });
            result = $.merge($(), res);
        }

        return $.extend(result, {_prevObj: this});
    },

    contains: function(s){
        return this.find(s).length > 0;
    },

    children: function(s){
        let i, res = [];

        if (s instanceof $) return s;

        this.each(function(){
            const el = this;
            for(i = 0; i < el.children.length; i++) {
                if (el.children[i].nodeType === 1)
                    res.push(el.children[i]);
            }
        });
        res = s ? res.filter(function(el){
            return matches.call(el, s);
        }) : res;

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    parent: function(s){
        let res = [];
        if (this.length === 0) {
            return ;
        }

        if (s instanceof $) return s;

        this.each(function(){
            if (this.parentNode) {
                if (res.indexOf(this.parentNode) === -1) res.push(this.parentNode);
            }
        });
        res = s ? res.filter(function(el){
            return matches.call(el, s);
        }) : res;

        return res.length ? $.extend($.merge($(), res), {_prevObj: this}) : undefined;
    },

    parents: function(s){
        let res = [];

        if (this.length === 0) {
            return ;
        }

        if (s instanceof $) return s;

        this.each(function(){
            let par = this.parentNode;
            while (par) {
                if (par.nodeType === 1 && res.indexOf(par) === -1) {
                    if (!not(s)) {
                        if (matches.call(par, s)) {
                            res.push(par);
                        }
                    } else {
                        res.push(par);
                    }
                }
                par = par.parentNode;
            }
        });

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    siblings: function(s){
        let res = [];

        if (this.length === 0) { return undefined; }
        if (s instanceof $) { return s; }

        this.each(function(){
            const el = this;
            if (el.parentNode) {
                $.each(el.parentNode.children, function(){
                    if (el !== this) res.push(this);
                });
            }
        });

        if (s) {
            res = res.filter(function(el){
                return matches.call(el, s);
            });
        }

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    _siblingAll: function(dir, s){
        let res = [];

        if (this.length === 0) {
            return ;
        }

        if (s instanceof $) return s;

        this.each(function(){
            let el = this;
            while (el) {
                el = el[dir];
                if (!el) break;
                res.push(el);
            }
        });

        if (s) {
            res = res.filter(function(el){
                return matches.call(el, s);
            });
        }

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    _sibling: function(dir, s){
        let res = [];

        if (this.length === 0) {
            return ;
        }

        if (s instanceof $) return s;

        this.each(function(){
            const el = this[dir];
            if (el && el.nodeType === 1) {
                res.push(el);
            }
        });

        if (s) {
            res = res.filter(function(el){
                return matches.call(el, s);
            });
        }

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    prev: function(s){
        return this._sibling('previousElementSibling', s);
    },

    next: function(s){
        return this._sibling('nextElementSibling', s);
    },

    prevAll: function(s){
        return this._siblingAll('previousElementSibling', s);
    },

    nextAll: function(s){
        return this._siblingAll('nextElementSibling', s);
    },

    closest: function(s){
        let res = [];
        if (this.length === 0) { return undefined; }
        if (!s) { return this.parent(); }

        let el = this[0];
        while (el) {
            if (matches.call(el, s)) {
                res.push(el);
                break ;
            }
            el = el.parentElement;
        }

        return $.extend($.merge($(), res.reverse()), {_prevObj: this});
    },

    has: function(selector){
        let res = [];

        if (this.length === 0) {
            return ;
        }

        this.each(function(){
            const el = $(this);
            const child = el.children(selector);
            if (child.length > 0) {
                res.push(this);
            }
        });

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    back: function(to_start){
        let ret;
        if (to_start === true) {
            ret = this._prevObj;
            while (ret) {
                if (!ret._prevObj) break;
                ret = ret._prevObj;
            }
        } else {
            ret = this._prevObj ? this._prevObj : this;
        }
        return ret;
    }
});
