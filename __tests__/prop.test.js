import { describe, it, expect, beforeEach, afterEach, mock, waitFor } from '@olton/latte';
import { $ } from '../dist/dom.js';

beforeEach(() => {
    // Создаем тестовую DOM-структуру
    document.body.innerHTML = `
            <div id="container">
                <div id="test-element" class="test-class">
                    <span id="child1">Child 1</span>
                    <span id="child2">Child 2</span>
                </div>
                <input id="test-input" type="text" value="test value">
                <textarea id="test-textarea">Textarea content</textarea>
                <select id="test-select">
                    <option value="1">Option 1</option>
                    <option value="2" selected>Option 2</option>
                </select>
            </div>
        `;
});

afterEach(() => {
    // Очищаем DOM после каждого теста
    document.body.innerHTML = '';
});

describe('prop()', () => {
    it('should get a property value', () => {
        const element = $('#test-input');
        expect(element.prop('value')).toBe('test value');
    });

    it('should set a property value', () => {
        const element = $('#test-input');
        element.prop('value', 'new value');
        expect(element.prop('value')).toBe('new value');
    });

    it('should set a property to empty string when value is null or undefined', () => {
        const element = $('#test-input');
        element.prop('value', null);
        expect(element.prop('value')).toBe('');

        element.prop('value', undefined);
        expect(element.prop('value')).toBe('');
    });

    it('should handle multiple elements when setting properties', () => {
        const elements = $('span');
        elements.prop('title', 'tooltip');

        expect($('#child1').prop('title')).toBe('tooltip');
        expect($('#child2').prop('title')).toBe('tooltip');
    });

    it('should return undefined when getting property from empty collection', () => {
        const empty = $('#non-existent');
        expect(empty.prop('value')).toBeUndefined();
    });

    it('should support chaining for setters', () => {
        const element = $('#test-input');
        const result = element.prop('value', 'chained');

        expect(result).toBe(element);
        expect(element.prop('value')).toBe('chained');
    });
});

describe('val()', () => {
    it('should get value from input elements', () => {
        expect($('#test-input').val()).toBe('test value');
        expect($('#test-textarea').val()).toBe('Textarea content');
        expect($('#test-select').val()).toBe('2'); // Selected option value
    });

    it('should set value for input elements', () => {
        $('#test-input').val('new input value');
        $('#test-textarea').val('new textarea content');
        $('#test-select').val('1');

        expect($('#test-input').val()).toBe('new input value');
        expect($('#test-textarea').val()).toBe('new textarea content');
        expect($('#test-select').val()).toBe('1');
    });

    it('should set HTML content for non-input elements', () => {
        $('#test-element').val('new content');

        expect($('#test-element').html()).toBe('new content');
    });

    it('should return undefined for empty collections', () => {
        expect($('#non-existent').val()).toBeUndefined();
    });

    it('should support chaining for setters', () => {
        const element = $('#test-input');
        const result = element.val('chained');

        expect(result).toBe(element);
        expect(element.val()).toBe('chained');
    });
});

describe('html()', () => {
    it('should get HTML content', () => {
        const html = $('#test-element').html();

        expect(html).toContain('<span id="child1">');
        expect(html).toContain('Child 1');
        expect(html).toContain('<span id="child2">');
        expect(html).toContain('Child 2');
    });

    it('should set HTML content', () => {
        $('#test-element').html('<p>New content</p>');

        expect($('#test-element').html()).toBe('<p>New content</p>');
        expect($('#test-element p').length).toBe(1);
        expect($('#test-element p').text()).toBe('New content');
    });

    it('should handle jQuery objects as input', () => {
        const newContent = $('<p>Paragraph 1</p><p>Paragraph 2</p>');
        $('#test-element').html(newContent);

        expect($('#test-element p').length).toBe(2);
        expect($('#test-element').text()).toContain('Paragraph 1');
        expect($('#test-element').text()).toContain('Paragraph 2');
    });

    it('should support chaining for setters', () => {
        const element = $('#test-element');
        const result = element.html('<p>Chained</p>');

        expect(result).toBe(element);
        expect(element.html()).toBe('<p>Chained</p>');
    });
});

describe('outerHTML()', () => {
    it('should get outer HTML content', () => {
        const outerHTML = $('#test-element').outerHTML();

        expect(outerHTML).toContain('<div id="test-element"');
        expect(outerHTML).toContain('class="test-class"');
        expect(outerHTML).toContain('<span id="child1">');
        expect(outerHTML).toContain('</div>');
    });
});

describe('text()', () => {
    it('should get text content without HTML tags', () => {
        const text = $('#test-element').text();

        expect(text).toContain('Child 1');
        expect(text).toContain('Child 2');
        expect(text).not.toContain('<span');
    });

    it('should set text content and escape HTML', () => {
        $('#test-element').text('<p>Text with <em>HTML</em></p>');

        expect($('#test-element').html()).toContain('&lt;p&gt;Text with &lt;em&gt;HTML&lt;/em&gt;&lt;/p&gt;');
        expect($('#test-element p').length).toBe(0); // HTML не должен интерпретироваться
    });

    it('should support chaining for setters', () => {
        const element = $('#test-element');
        const result = element.text('Chained');

        expect(result).toBe(element);
        expect(element.text()).toBe('Chained');
    });
});

describe('innerText()', () => {
    it('should get inner text content', () => {
        const innerText = $('#test-element').innerText();

        expect(innerText).toContain('Child 1');
        expect(innerText).toContain('Child 2');
        expect(innerText).not.toContain('<span');
    });

    it('should set inner text content', () => {
        $('#test-element').innerText('New text content');

        expect($('#test-element').text()).toBe('New text content');
    });

    it('should support chaining for setters', () => {
        const element = $('#test-element');
        const result = element.innerText('Chained');

        expect(result).toBe(element);
        expect(element.innerText()).toBe('Chained');
    });
});

describe('empty() and clear()', () => {
    it('should remove all child elements and text content', () => {
        $('#test-element').empty();

        expect($('#test-element').html()).toBe('');
        expect($('#test-element').children().length).toBe(0);
    });

    it('should clear value of input elements', () => {
        $('#test-input').empty();

        expect($('#test-input').val()).toBe('');
    });

    it('should support chaining', () => {
        const element = $('#test-element');
        const result = element.empty();

        expect(result).toBe(element);
        expect(element.html()).toBe('');
    });

    it('should have clear() as alias for empty()', () => {
        const element = $('#test-element');
        const result = element.clear();

        expect(result).toBe(element);
        expect(element.html()).toBe('');
    });
});
