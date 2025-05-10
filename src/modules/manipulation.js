(function (arr) {
    arr.forEach(function (item) {
        ['append', 'prepend'].forEach(function(where){
            if (hasProp(item, where)) {
                return;
            }

            Object.defineProperty(item, where, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: function () {
                    const argArr = Array.prototype.slice.call(arguments),
                        docFrag = document.createDocumentFragment();

                    argArr.forEach(function (argItem) {
                        const isNode = argItem instanceof Node;
                        docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                    });

                    if (where === 'prepend')
                        this.insertBefore(docFrag, this.firstChild);
                    else
                        this.appendChild(docFrag);
                }
            });
        });
    });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

const normalizeElements = function(s){
    let result;

    if (typeof s === "string") result = $.isSelector(s) ? $(s) : $.parseHTML(s);
    else if (s instanceof HTMLElement) result = [s];
    else if (isArrayLike(s)) result = s;
    return result;
};

$.fn.extend({

    appendText: function(text){
        return this.each(function(elIndex, el){
            el.innerHTML += text;
        });
    },

    prependText: function(text){
        return this.each(function(elIndex, el){
            el.innerHTML = text + el.innerHTML;
        });
    },

    append: function(elements){
        const _elements = normalizeElements(elements);

        return this.each(function(elIndex, el){
            $.each(_elements, function(){
                if (el === this) return ;
                const child = elIndex === 0 ? this : this.cloneNode(true);
                if (child.tagName && child.tagName === "SCRIPT") {
                    $.script(child, el);
                } else {
                    el.append(child);
                }
            });
        });
    },

    appendTo: function(elements){
        const _elements = normalizeElements(elements);

        return this.each(function(_, el){
            $.each(_elements, function(parIndex, parent){
                if (el === this) return ;
                parent.append(parIndex === 0 ? el : el.cloneNode(true));
            });
        });
    },

    prepend: function(elements){
        const _elements = normalizeElements(elements);

        return this.each(function (elIndex, el) {
            $.each(_elements, function(){
                if (el === this) return ;
                const child = elIndex === 0 ? this : this.cloneNode(true);
                $.script(child);
                if (child.tagName && child.tagName !== "SCRIPT") el.prepend(child);
            });
        });
    },

    prependTo: function(elements){
        const _elements = normalizeElements(elements);

        return this.each(function(){
            const el = this;
            $.each(_elements, function(parIndex, parent){
                if (el === this) return ;
                $(parent).prepend(parIndex === 0 ? el : el.cloneNode(true));
            });
        });
    },

    insertBefore: function(elements){
        const _elements = normalizeElements(elements);

        return this.each(function(){
            const el = this;
            $.each(_elements, function(elIndex){
                if (el === this) return ;
                const parent = this.parentNode;
                if (parent) {
                    parent.insertBefore(elIndex === 0 ? el : el.cloneNode(true), this);
                }
            });
        });
    },

    insertAfter: function(elements){
        const _elements = normalizeElements(elements);

        return this.each(function(){
            const el = this;
            $.each(_elements, function(elIndex, element){
                if (el === this) return ;
                const parent = this.parentNode;
                if (parent) {
                    parent.insertBefore(elIndex === 0 ? el : el.cloneNode(true), element.nextSibling);
                }
            });
        });
    },

    after: function(html){
        return this.each(function(){
            const el = this;
            if (typeof html === "string") {
                el.insertAdjacentHTML('afterend', html);
            } else {
                $(html).insertAfter(el);
            }
        });
    },

    before: function(html){
        return this.each(function(){
            const el = this;
            if (typeof html === "string") {
                el.insertAdjacentHTML('beforebegin', html);
            } else {
                $(html).insertBefore(el);
            }
        });
    },

    clone: function(deep = false, withData = false){
        const res = [];

        this.each(function(){
            const el = this.cloneNode(deep);
            const $el = $(el);
            let data;
            if (withData && $.hasData(this)) {
                data = $(this).data();
                $.each(data, function(k, v){
                    $el.data(k, v);
                });
            }
            res.push(el);
        });

        return $.merge($(), res);
    },

    import: function(deep){
        const res = [];
        if (not(deep)) {
            deep = false;
        }
        this.each(function(){
            res.push(document.importNode(this, deep));
        });
        return $.merge($(), res);
    },

    adopt: function(){
        const res = [];
        this.each(function(){
            res.push(document.adoptNode(this));
        });
        return $.merge($(), res);
    },

    remove: function(selector){
        let i = 0, node, out, res = [];

        if (this.length === 0) {
            return ;
        }

        out = selector ? this.filter(function(el){
            return matches.call(el, selector);
        }) : this.items();

        for ( ; ( node = out[ i ] ) != null; i++ ) {
            if (node.parentNode) {
                res.push(node.parentNode.removeChild(node));
                $.removeData(node);
            }
        }

        return $.merge($(), res);
    },

    wrap: function( el ){
        if (this.length === 0) {
            return ;
        }

        const wrapper = $(normalizeElements(el));

        if (!wrapper.length) {
            return ;
        }

        const res = [];

        this.each(function(){
            let _target, _wrapper;

            _wrapper = wrapper.clone(true, true);
            _wrapper.insertBefore(this);

            _target = _wrapper;
            while (_target.children().length) {
                _target = _target.children().eq(0);
            }
            _target.append(this);

            res.push(_wrapper);
        });

        return $(res);
    },

    wrapAll: function( el ){
        let wrapper, _wrapper, _target;

        if (this.length === 0) {
            return ;
        }

        wrapper = $(normalizeElements(el));

        if (!wrapper.length) {
            return ;
        }

        _wrapper = wrapper.clone(true, true);
        _wrapper.insertBefore(this[0]);

        _target = _wrapper;
        while (_target.children().length) {
            _target = _target.children().eq(0);
        }

        this.each(function(){
            _target.append(this);
        })

        return _wrapper;
    },

    wrapInner: function( el ){
        if (this.length === 0) {
            return ;
        }

        const wrapper = $(normalizeElements(el));

        if (!wrapper.length) {
            return ;
        }

        const res = [];

        this.each(function(){
            const elem = $(this);
            const html = elem.html();
            const wrp = wrapper.clone(true, true);
            elem.html(wrp.html(html));
            res.push(wrp);
        });

        return $(res);
    }
});