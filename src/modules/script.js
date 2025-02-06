function createScript(script, into = document.body){
    const s = document.createElement('script');
    s.type = 'text/javascript';

    if (not(script)) return $(s);

    const _script = $(script)[0];

    if (_script.src) {
        s.src = _script.src;
    } else {
        s.textContent = _script.innerText;
    }

    if (_script.type) s.type = _script.type;
    if (_script.async) s.async = _script.async;

    into.appendChild(s);

    if (_script.parentNode) _script.parentNode.removeChild(_script);

    return s;
}

$.extend({
    script: function(el, into){
        if (not(el)) { return }
        if (el instanceof $) { el = el[0] }

        if (el.tagName && el.tagName === "SCRIPT") {
            createScript(el, into);
        } else {
            const scripts = $(el).find("script");
            $.each(scripts, function(){
                createScript(this, into);
            });
        }
    },
    
    loadScript: function(url, into = document.body, callback){
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = callback;
        into.appendChild(script);
    }
});

$.fn.extend({
    script: function(into){
        return this.each(function(){
            $.script(this, into);
        });
    }
});