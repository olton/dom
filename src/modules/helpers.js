const numProps = ['opacity', 'zIndex']

function nothing () {
    return null
}

function isSimple (v) {
    return typeof v === 'string' || typeof v === 'boolean' || typeof v === 'number'
}

function isVisible(elem) {
    // Кэшируем вычисленный стиль для оптимизации
    const computedStyle = getComputedStyle(elem);
    
    // Элемент считается видимым, если имеет размеры
    const hasDimensions = !!(
        elem.offsetWidth || 
        elem.offsetHeight || 
        elem.getClientRects().length
    );
    
    // И также не скрыт через стили
    const isNotHiddenByStyles = 
        computedStyle.visibility !== 'hidden' && 
        computedStyle.display !== 'none' && 
        computedStyle.opacity !== '0' &&
        elem.style.display !== 'none';
    
    return hasDimensions && isNotHiddenByStyles;
}

function isHidden (elem) {
    const s = getComputedStyle(elem)
    return !isVisible(elem) || +s.opacity === 0 || elem.hidden || s.visibility === 'hidden'
}

function not (value) {
    return value === undefined || value === null
}

function camelCase (string) {
    return string.replace(/-([a-z])/g, function (all, letter) {
        return letter.toUpperCase()
    })
}

function dashedName (str) {
    return str.replace(/([A-Z])/g, function (u) { return '-' + u.toLowerCase() })
}

function isPlainObject (obj) {
    let proto
    if (!obj || Object.prototype.toString.call(obj) !== '[object Object]') {
        return false
    }
    proto = obj.prototype !== undefined
    if (!proto) {
        return true
    }
    return proto.constructor && typeof proto.constructor === 'function'
}

function isEmptyObject (obj) {
    for (const name in obj) {
        if (hasProp(obj, name)) return false
    }
    return true
}

function isArrayLike (o) {
    return o instanceof Object && 'length' in o
}

function str2arr (str, sep) {
    sep = sep || ' '
    return str.split(sep).map(function (el) {
        return ('' + el).trim()
    }).filter(function (el) {
        return el !== ''
    })
}

function parseUnit (str, out) {
    if (!out) out = [0, '']
    str = String(str)
    out[0] = parseFloat(str)
    out[1] = str.match(/[\d.\-+]*\s*(.*)/)[1] || ''
    return out
}

function getUnit (val, und) {
    const split = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn|fr|lh|cqw|cqh|cqi|cqb|cqmin|cqmax|q)?$/.exec(val)
    return typeof split[1] !== 'undefined' ? split[1] : und
}

function setStyleProp (el, key, val) {
    key = camelCase(key)

    if (['scrollLeft', 'scrollTop'].indexOf(key) > -1) {
        el[key] = (parseInt(val))
    } else {
        el.style[key] = isNaN(val) || numProps.indexOf('' + key) > -1
            ? val
            : parseInt(val) === 0 ? 0 : val + 'px'
    }
}

function acceptData (owner) {
    return owner.nodeType === 1 || owner.nodeType === 9 || !(+owner.nodeType)
}

function getData (data) {
    try {
        return JSON.parse(data)
    } catch (e) {
        return data
    }
}

function dataAttr (elem, key, data) {
    let name

    if (not(data) && elem.nodeType === 1) {
        name = 'data-' + key.replace(/[A-Z]/g, '-$&').toLowerCase()
        data = elem.getAttribute(name)

        if (typeof data === 'string') {
            data = getData(data)
            dataSet.set(elem, key, data)
        } else {
            data = undefined
        }
    }
    return data
}

function normName (name) {
    return typeof name !== 'string' ? undefined : name.replace(/-/g, '').toLowerCase()
}

function strip (name, what) {
    return typeof name !== 'string' ? undefined : name.replace(what, '')
}

function hasProp (obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop)
}

function isLocalhost (host) {
    const hostname = host || globalThis.location.hostname
    return (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '[::1]' ||
        hostname === '' ||
        hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/) !== null
    )
}

function isTouch () {
    return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0))
}

function isPrivateAddress (host) {
    const hostname = host || globalThis.location.hostname
    return /(^localhost)|(^127\.)|(^192\.168\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2\d\.)|(^172\.3[0-1]\.)|(^::1$)|(^[fF][cCdD])/.test(hostname)
}