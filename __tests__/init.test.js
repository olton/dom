import { describe, it, expect, beforeEach, afterEach, mock } from '@olton/latte';
import { $ } from '../dist/dom.js';

beforeEach(() => {
    // Создаем тестовую DOM-структуру
    document.body.innerHTML = `
            <div id="test-parent">
                <div id="test-element" class="test-class" data-role="button, panel">
                    <span id="test-child">Test Child</span>
                </div>
                <div id="test-sibling" data-role="panel">Test Sibling</div>
            </div>
        `;
});

afterEach(() => {
    // Очищаем DOM после каждого теста
    document.body.innerHTML = '';
});

describe('Basic Selector Functionality', () => {
    it('should handle empty selector', () => {
        const instance = $();
        expect(instance.length).toBe(0);
        expect(instance instanceof $).toBe(true);
    });

    it('should handle null or undefined selector', () => {
        const instance1 = $(null);
        const instance2 = $(undefined);

        expect(instance1.length).toBe(0);
        expect(instance2.length).toBe(0);
    });

    it('should select elements by ID', () => {
        const element = $('#test-element');
        expect(element.length).toBe(1);
        expect(element[0].id).toBe('test-element');
    });

    it('should select elements by class', () => {
        const element = $('.test-class');
        expect(element.length).toBe(1);
        expect(element[0].id).toBe('test-element');
    });

    it('should select elements by tag name', () => {
        const elements = $('span');
        expect(elements.length).toBe(1);
        expect(elements[0].id).toBe('test-child');
    });

    it('should select elements by complex CSS selector', () => {
        const elements = $('#test-parent > div');
        expect(elements.length).toBe(2);
    });

    it('should handle invalid selectors gracefully', () => {
        // Селектор с неправильным синтаксисом
        const elements = $('div::[invalid]');
        expect(elements.length).toBe(0);
    });

    it('should show error for # or . as selectors', () => {
        const errorSpy = mock(console, 'error');

        $('#');
        $('.');

        expect(errorSpy.callCount).toBe(2);
        errorSpy.restore();
    });
});

describe('Special Selectors', () => {
    it('should handle "window" selector', () => {
        const win = $('window');
        expect(win.length).toBe(1);
        expect(win[0]).toBe(window);
    });

    it('should handle "document" selector', () => {
        const doc = $('document');
        expect(doc.length).toBe(1);
        expect(doc[0]).toBe(document);
    });

    it('should handle "body" selector', () => {
        const body = $('body');
        expect(body.length).toBe(1);
        expect(body[0]).toBe(document.body);
    });

    it('should handle "html" selector', () => {
        const html = $('html');
        expect(html.length).toBe(1);
        expect(html[0]).toBe(document.documentElement);
    });

    it('should handle "doctype" selector', () => {
        const doctype = $('doctype');
        expect(doctype.length).toBe(1);
        expect(doctype[0]).toBe(document.doctype);
    });

    it('should handle role selectors with @ prefix', () => {
        const buttons = $('@button');
        expect(buttons.length).toBe(1);
        expect(buttons[0].id).toBe('test-element');

        const panels = $('@panel');
        expect(panels.length).toBe(2);
    });
});

describe('DOM Element Handling', () => {
    it('should handle DOM element as input', () => {
        const element = document.getElementById('test-element');
        const $element = $(element);

        expect($element.length).toBe(1);
        expect($element[0]).toBe(element);
    });

    it('should handle jQuery-like object as input', () => {
        const original = $('#test-element');
        const $element = $(original);

        expect($element.length).toBe(original.length);
        expect($element[0]).toBe(original[0]);
    });

    it('should handle array-like objects as input', () => {
        const elements = document.querySelectorAll('div');
        const $elements = $(elements);

        expect($elements.length).toBe(elements.length);
        expect($elements[0]).toBe(elements[0]);
    });

    it('should handle nodeList as input', () => {
        const nodeList = document.querySelectorAll('div');
        const $elements = $(nodeList);

        expect($elements.length).toBe(nodeList.length);
        expect($elements[0]).toBe(nodeList[0]);
    });
});

describe('HTML String Handling', () => {
    it('should create elements from HTML string', () => {
        const $element = $('<div class="created">Test</div>');

        expect($element.length).toBe(1);
        expect($element[0].nodeType).toBe(1);
        expect($element.hasClass('created')).toBe(true);
        expect($element.text()).toBe('Test');
    });

    it('should create multiple elements from HTML string', () => {
        const $elements = $('<div>First</div><span>Second</span>');

        expect($elements.length).toBe(2);
        expect($elements[0].tagName.toLowerCase()).toBe('div');
        expect($elements[1].tagName.toLowerCase()).toBe('span');
    });

    it('should handle HTML with attributes', () => {
        const $element = $('<div id="new-id" class="new-class" data-test="value">Content</div>');

        expect($element.attr('id')).toBe('new-id');
        expect($element.hasClass('new-class')).toBe(true);
        expect($element.attr('data-test')).toBe('value');
    });
});

describe('Ready Callback Handling', () => {
    it('should handle function as selector and execute it as ready callback', () => {
        const readySpy = mock($.fn, 'ready');
        const callback = function() {};

        $(callback);

        expect(readySpy.calledWith(callback)).toBe(true);
        readySpy.restore();
    });
});

describe('Context Handling', () => {
    it('should append elements to DOM element context', () => {
        const parent = document.createElement('div');
        const $element = $('<span>Test</span>', parent);

        expect(parent.children.length).toBe(1);
        expect(parent.firstChild).toBe($element[0]);
    });

    it('should append elements to jQuery-like object context', () => {
        const $parent = $('<div>');
        const $element = $('<span>Test</span>', $parent);

        expect($parent[0].children.length).toBe(1);
        expect($parent[0].firstChild).toBe($element[0]);
    });

    it('should set attributes when context is an object', () => {
        const $element = $('<div>', {
            id: 'new-element',
            class: 'test-class',
            'data-role': 'button'
        });

        expect($element.attr('id')).toBe('new-element');
        expect($element.hasClass('test-class')).toBe(true);
        expect($element.attr('data-role')).toBe('button');
    });
});

describe('Internal Methods', () => {
    it('should assign unique id to each instance', () => {
        const instance1 = $('<div>');
        const instance2 = $('<div>');

        expect(instance1.uid).toBeDefined();
        expect(instance2.uid).toBeDefined();
        expect(instance1.uid).not.toBe(instance2.uid);
    });
});
