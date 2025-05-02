/**
 * DOM - Work with HTML elements, animation HTML elements and props, and ajax routines. JQuery replacer.
 * @version 1.4.1
 * @author Serhii Pimenov
 * @license MIT
 */

declare module '@olton/dom' {
    interface DomElement extends Array<Element> {
        /**
         * Get the index of an element within its parent
         * @param sel - Optional selector to match against
         */
        index(sel?: string | DomElement | Element): number;

        /**
         * Get the index of an element within the collection
         * @param sel - Optional selector to match against
         */
        indexOf(sel?: string | DomElement | Element): number;

        /**
         * Get the DOM element at the specified index
         * @param i - Index of the element to retrieve
         */
        get(i?: number): Element | Element[];

        /**
         * Get a new DomElement object containing the element at the specified index
         * @param i - Index of the element to retrieve
         */
        eq(i: number): DomElement;

        /**
         * Check if at least one element in the collection matches the selector or condition
         * @param s - Selector, element, or condition to check
         */
        is(s: string | Element | DomElement | object): boolean;

        /**
         * Get or set attributes on elements
         * @param name - Attribute name or object of attribute-value pairs
         * @param val - Value to set (if getting, this parameter is omitted)
         */
        attr(name: string | object, val?: string): string | DomElement;

        /**
         * Add classes to elements
         * @param classes - One or more class names
         */
        addClass(classes: string): DomElement;

        /**
         * Remove classes from elements
         * @param classes - One or more class names
         */
        removeClass(classes: string): DomElement;

        /**
         * Toggle classes on elements
         * @param classes - One or more class names
         */
        toggleClass(classes: string): DomElement;

        /**
         * Check if elements have the specified class
         * @param className - Class name to check
         */
        hasClass(className: string): boolean;

        /**
         * Get or set CSS properties
         * @param name - CSS property name or object of property-value pairs
         * @param val - Value to set (if getting, this parameter is omitted)
         */
        css(name: string | object, val?: string | number): string | DomElement;

        /**
         * Get or set the HTML content of elements
         * @param html - HTML content to set (if getting, this parameter is omitted)
         */
        html(html?: string): string | DomElement;

        /**
         * Get or set the text content of elements
         * @param text - Text content to set (if getting, this parameter is omitted)
         */
        text(text?: string): string | DomElement;

        /**
         * Get or set the value of form elements
         * @param val - Value to set (if getting, this parameter is omitted)
         */
        val(val?: string | string[] | number | boolean): string | string[] | number | boolean | DomElement;

        /**
         * Add event listeners to elements
         * @param events - Event name(s)
         * @param handler - Event handler function
         */
        on(events: string, handler: Function): DomElement;

        /**
         * Remove event listeners from elements
         * @param events - Event name(s)
         * @param handler - Event handler function
         */
        off(events: string, handler?: Function): DomElement;

        /**
         * Trigger events on elements
         * @param events - Event name(s)
         * @param data - Data to pass to event handlers
         */
        trigger(events: string, data?: any): DomElement;

        /**
         * Add event listeners that run once
         * @param events - Event name(s)
         * @param handler - Event handler function
         */
        one(events: string, handler: Function): DomElement;

        /**
         * Get or set data attributes
         * @param key - Data attribute name or object of key-value pairs
         * @param val - Value to set (if getting, this parameter is omitted)
         */
        data(key: string | object, val?: any): any | DomElement;

        /**
         * Remove data attributes
         * @param key - Data attribute name
         */
        removeData(key?: string): DomElement;

        /**
         * Get or set data attributes with the "origin-" prefix
         * @param name - Attribute name (without the "origin-" prefix)
         * @param value - Value to set (if getting, this parameter is omitted)
         * @param def - Default value to return if the attribute doesn't exist
         */
        origin(name?: string, value?: any, def?: any): any | DomElement;

        /**
         * Append content to elements
         * @param content - Content to append
         */
        append(content: string | Element | DomElement): DomElement;

        /**
         * Prepend content to elements
         * @param content - Content to prepend
         */
        prepend(content: string | Element | DomElement): DomElement;

        /**
         * Insert content after elements
         * @param content - Content to insert
         */
        after(content: string | Element | DomElement): DomElement;

        /**
         * Insert content before elements
         * @param content - Content to insert
         */
        before(content: string | Element | DomElement): DomElement;

        /**
         * Remove elements from the DOM
         */
        remove(): DomElement;

        /**
         * Empty elements (remove all children)
         */
        empty(): DomElement;

        /**
         * Clone elements
         * @param deep - Whether to clone descendants
         */
        clone(deep?: boolean): DomElement;

        /**
         * Import nodes from another document
         * @param deep - Whether to clone descendants
         */
        import(deep?: boolean): DomElement;

        /**
         * Adopt nodes from another document
         */
        adopt(): DomElement;

        /**
         * Get the parent of each element
         * @param selector - Optional selector to filter by
         */
        parent(selector?: string): DomElement;

        /**
         * Get the children of each element
         * @param selector - Optional selector to filter by
         */
        children(selector?: string): DomElement;

        /**
         * Get the siblings of each element
         * @param selector - Optional selector to filter by
         */
        siblings(selector?: string): DomElement;

        /**
         * Get the next sibling of each element
         * @param selector - Optional selector to filter by
         */
        next(selector?: string): DomElement;

        /**
         * Get the previous sibling of each element
         * @param selector - Optional selector to filter by
         */
        prev(selector?: string): DomElement;

        /**
         * Find descendants of elements
         * @param selector - Selector to find
         */
        find(selector: string): DomElement;

        /**
         * Filter elements by selector
         * @param selector - Selector to filter by
         */
        filter(selector: string | Function): DomElement;

        /**
         * Get the width of the first element
         */
        width(): number;

        /**
         * Get the height of the first element
         */
        height(): number;

        /**
         * Get the outer width of the first element
         * @param includeMargin - Whether to include margins
         */
        outerWidth(includeMargin?: boolean): number;

        /**
         * Get the outer height of the first element
         * @param includeMargin - Whether to include margins
         */
        outerHeight(includeMargin?: boolean): number;

        /**
         * Get the position of the first element relative to its offset parent
         */
        position(): { top: number, left: number };

        /**
         * Get the offset of the first element relative to the document
         */
        offset(): { top: number, left: number };

        /**
         * Show elements
         */
        show(): DomElement;

        /**
         * Hide elements
         */
        hide(): DomElement;

        /**
         * Toggle element visibility
         */
        toggle(): DomElement;

        /**
         * Fade in elements
         * @param duration - Animation duration in milliseconds
         * @param callback - Function to call when animation completes
         */
        fadeIn(duration?: number, callback?: Function): DomElement;

        /**
         * Fade out elements
         * @param duration - Animation duration in milliseconds
         * @param callback - Function to call when animation completes
         */
        fadeOut(duration?: number, callback?: Function): DomElement;

        /**
         * Slide down elements
         * @param duration - Animation duration in milliseconds
         * @param callback - Function to call when animation completes
         */
        slideDown(duration?: number, callback?: Function): DomElement;

        /**
         * Slide up elements
         * @param duration - Animation duration in milliseconds
         * @param callback - Function to call when animation completes
         */
        slideUp(duration?: number, callback?: Function): DomElement;

        /**
         * Animate CSS properties
         * @param props - CSS properties to animate
         * @param options - Animation options
         */
        animate(props: object, options?: object): DomElement;

        /**
         * Execute a function for each element in the collection
         * @param callback - Function to execute
         */
        each(callback: Function): DomElement;

        /**
         * Convert the collection to an array
         */
        items(): Element[];

        /**
         * Load HTML from a URL into the elements
         * @param url - URL to load from
         * @param data - Data to send with the request
         * @param options - Additional options for the request
         */
        load(url: string, data?: object | string, options?: object): Promise<any>;

        /**
         * Execute a function when the window unloads (only works on window element)
         * @param fn - Function to execute
         */
        unload(fn: Function): DomElement;

        /**
         * Execute a function before the window unloads (only works on window element)
         * @param fn - Function to execute or message to display
         */
        beforeunload(fn: Function | string): DomElement;

        /**
         * Add mouseenter and mouseleave event handlers
         * @param fnOver - Function to execute on mouseenter
         * @param fnOut - Function to execute on mouseleave (defaults to fnOver)
         */
        hover(fnOver: Function, fnOut?: Function): DomElement;

        // Event shorthand methods
        blur(selector?: string | Function, handler?: Function, options?: object): DomElement;
        focus(selector?: string | Function, handler?: Function, options?: object): DomElement;
        resize(selector?: string | Function, handler?: Function, options?: object): DomElement;
        scroll(selector?: string | Function, handler?: Function, options?: object): DomElement;
        click(selector?: string | Function, handler?: Function, options?: object): DomElement;
        dblclick(selector?: string | Function, handler?: Function, options?: object): DomElement;
        mousedown(selector?: string | Function, handler?: Function, options?: object): DomElement;
        mouseup(selector?: string | Function, handler?: Function, options?: object): DomElement;
        mousemove(selector?: string | Function, handler?: Function, options?: object): DomElement;
        mouseover(selector?: string | Function, handler?: Function, options?: object): DomElement;
        mouseout(selector?: string | Function, handler?: Function, options?: object): DomElement;
        mouseenter(selector?: string | Function, handler?: Function, options?: object): DomElement;
        mouseleave(selector?: string | Function, handler?: Function, options?: object): DomElement;
        change(selector?: string | Function, handler?: Function, options?: object): DomElement;
        select(selector?: string | Function, handler?: Function, options?: object): DomElement;
        submit(selector?: string | Function, handler?: Function, options?: object): DomElement;
        keydown(selector?: string | Function, handler?: Function, options?: object): DomElement;
        keypress(selector?: string | Function, handler?: Function, options?: object): DomElement;
        keyup(selector?: string | Function, handler?: Function, options?: object): DomElement;
        contextmenu(selector?: string | Function, handler?: Function, options?: object): DomElement;
        touchstart(selector?: string | Function, handler?: Function, options?: object): DomElement;
        touchend(selector?: string | Function, handler?: Function, options?: object): DomElement;
        touchmove(selector?: string | Function, handler?: Function, options?: object): DomElement;
        touchcancel(selector?: string | Function, handler?: Function, options?: object): DomElement;
    }

    interface DomStatic {
        /**
         * Library version
         */
        version: string;

        /**
         * Build time
         */
        build_time: string;

        /**
         * Display library info in console
         */
        info(): void;

        /**
         * Execute a function when the DOM is ready
         * @param fn - Function to execute
         * @param options - Event listener options
         */
        ready(fn: Function, options?: boolean | AddEventListenerOptions): void;

        /**
         * Execute a function when the window loads
         * @param fn - Function to execute
         */
        load(fn: Function): DomElement;

        /**
         * Execute a function when the window unloads
         * @param fn - Function to execute
         */
        unload(fn: Function): DomElement;

        /**
         * Execute a function before the window unloads
         * @param fn - Function to execute or message to display
         */
        beforeunload(fn: Function | string): DomElement;

        /**
         * Extend objects
         * @param target - Target object
         * @param source - Source object(s)
         */
        extend(target: object, ...source: object[]): object;

        /**
         * Assign properties from source objects to target object
         * @param target - Target object
         * @param source - Source object(s)
         */
        assign(target: object, ...source: object[]): object;

        /**
         * Execute a function for each item in an array or object
         * @param obj - Array or object to iterate over
         * @param callback - Function to execute
         */
        each(obj: any[] | object, callback: Function): any[] | object;

        /**
         * Make an AJAX request
         * @param options - Request options
         */
        ajax(options: object): Promise<any>;

        /**
         * Make a GET request
         * @param url - URL to request
         * @param data - Data to send
         * @param callback - Success callback
         */
        get(url: string, data?: object | string, callback?: Function): Promise<any>;

        /**
         * Make a POST request
         * @param url - URL to request
         * @param data - Data to send
         * @param callback - Success callback
         */
        post(url: string, data?: object | string, callback?: Function): Promise<any>;

        /**
         * Make a PUT request
         * @param url - URL to request
         * @param data - Data to send
         * @param callback - Success callback
         */
        put(url: string, data?: object | string, callback?: Function): Promise<any>;

        /**
         * Make a PATCH request
         * @param url - URL to request
         * @param data - Data to send
         * @param callback - Success callback
         */
        patch(url: string, data?: object | string, callback?: Function): Promise<any>;

        /**
         * Make a DELETE request
         * @param url - URL to request
         * @param data - Data to send
         * @param callback - Success callback
         */
        delete(url: string, data?: object | string, callback?: Function): Promise<any>;

        /**
         * Make a GET request and parse the response as JSON
         * @param url - URL to request
         * @param data - Data to send
         * @param callback - Success callback
         */
        json(url: string, data?: object | string, callback?: Function): Promise<any>;

        /**
         * Check if a value is undefined or null
         * @param value - Value to check
         */
        not(value: any): boolean;

        /**
         * Convert a string to camelCase
         * @param string - String to convert
         */
        camelCase(string: string): string;

        /**
         * Convert a string to dashed-case
         * @param str - String to convert
         */
        dashedName(str: string): string;

        /**
         * Check if an object is a plain object
         * @param obj - Object to check
         */
        isPlainObject(obj: any): boolean;

        /**
         * Check if an object is empty
         * @param obj - Object to check
         */
        isEmptyObject(obj: any): boolean;

        /**
         * Check if a value is array-like
         * @param o - Value to check
         */
        isArrayLike(o: any): boolean;

        /**
         * Parse a string into an array
         * @param str - String to parse
         * @param sep - Separator
         */
        str2arr(str: string, sep?: string): string[];

        /**
         * Generate a unique ID
         * @param prefix - Optional prefix for the ID (default: 'm4q')
         */
        uniqueId(prefix?: string): string;

        /**
         * Convert an array-like object to an array
         * @param n - Array-like object to convert
         */
        toArray(n: ArrayLike<any>): any[];

        /**
         * Convert an array-like object to a DomElement collection
         * @param ctx - Array-like object to convert
         */
        import(ctx: ArrayLike<any>): DomElement;

        /**
         * Check if a string is a valid CSS selector
         * @param selector - String to check
         */
        isSelector(selector: any): boolean;

        /**
         * Get the type of an object
         * @param obj - Object to check
         */
        type(obj: any): string;

        /**
         * Parse an HTML string into an array of DOM elements
         * @param data - HTML string to parse
         */
        parseHTML(data: string): Element[];

        /**
         * Boolean indicating whether the current device is a mobile device
         */
        device: boolean;

        /**
         * Boolean indicating whether the current page is running on localhost
         */
        localhost: boolean;

        /**
         * Function that checks if the current page is running on localhost
         */
        isLocalhost(): boolean;

        /**
         * Boolean indicating whether the current device has touch capabilities
         */
        touchable: boolean;

        /**
         * Function that checks if an IP address is private
         * @param ip - IP address to check
         */
        isPrivateAddress(ip: string): boolean;

        /**
         * Boolean indicating whether the user prefers dark mode
         */
        dark: boolean;

        /**
         * Generate a random number between two values or select a random element from an array
         * @param from - Lower bound or array-like object
         * @param to - Upper bound (if from is a number)
         */
        random(from: number | ArrayLike<any>, to?: number): any;

        /**
         * Convert a form to an array of name-value pairs
         * @param form - Form element or selector
         */
        serializeToArray(form: string | Element | DomElement): string[];

        /**
         * Convert a form to a URL-encoded string
         * @param form - Form element or selector
         */
        serialize(form: string | Element | DomElement): string;

        /**
         * Get the dimensions of the viewport
         */
        viewport(): { width: number, height: number };
    }

    interface DomFactory extends DomStatic {
        /**
         * Create a new DomElement
         * @param selector - CSS selector, HTML string, DOM element, or special selector
         * @param context - Context element or attributes object
         * 
         * Special selectors:
         * - "window": Selects the window object
         * - "document": Selects the document object
         * - "body": Selects the document.body
         * - "html": Selects the document.documentElement
         * - "doctype": Selects the document.doctype
         * - "@role": Selects elements with data-role attribute containing "role"
         */
        (selector: string | Element | Document | DocumentFragment | Window | DomElement | Function | null, context?: Element | Document | DomElement | object): DomElement;

        /**
         * Prototype for DomElement objects
         */
        fn: DomElement;

        /**
         * Prototype for DomElement objects (alias for fn)
         */
        prototype: DomElement;
    }

    const $: DomFactory;
    export default $;
}
