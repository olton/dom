let _$ = window.$;

window.Dom = $;
window.$ = $;

$.global = function(){
    _$ = window.$;
    window.$ = $;
};

$.noConflict = function() {
    if ( window.$ === $ ) {
        window.$ = _$;
    }

    return $;
};