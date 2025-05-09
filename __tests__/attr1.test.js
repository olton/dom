import { describe, it, expect, beforeEach, afterEach } from '@olton/latte';
import { $ } from '../dist/dom.js';

let testDiv;

beforeEach(() => {
    // Создаем тестовый DOM элемент
    document.body.innerHTML = `
            <div id="test-div" class="test-class" data-test="test-value" title="Test Title"></div>
            <a href="https://example.com" id="test-link">Test Link</a>
            <img src="test.jpg" id="test-img" name="test-image">
            <input type="text" id="test-input" value="Test Input" name="test-input-name">
        `;

    testDiv = $('#test-div');
});

afterEach(() => {
    // Очищаем DOM после каждого теста
    document.body.innerHTML = '';
});

describe('attr()', () => {
    it('should get all attributes when called with no arguments', () => {
        const attrs = testDiv.attr();
        expect(attrs.id).toBe('test-div');
        expect(attrs.class).toBe('test-class');
        expect(attrs['data-test']).toBe('test-value');
    });

    it('should get a specific attribute when called with a name', () => {
        expect(testDiv.attr('data-test')).toBe('test-value');
    });

    it('should return undefined for non-existent attribute', () => {
        expect(testDiv.attr('non-existent')).toBeUndefined();
    });

    it('should set an attribute when called with name and value', () => {
        testDiv.attr('aria-label', 'Test Label');
        expect(document.getElementById('test-div').getAttribute('aria-label')).toBe('Test Label');
    });

    it('should set multiple attributes when called with an object', () => {
        testDiv.attr({
            'aria-hidden': 'true',
            'data-role': 'button'
        });

        const element = document.getElementById('test-div');
        expect(element.getAttribute('aria-hidden')).toBe('true');
        expect(element.getAttribute('data-role')).toBe('button');
    });
});

describe('removeAttr()', () => {
    it('should remove a specific attribute', () => {
        testDiv.removeAttr('data-test');
        expect(document.getElementById('test-div').hasAttribute('data-test')).toBe(false);
    });

    it('should remove multiple attributes when given a comma-separated list', () => {
        testDiv.removeAttr('data-test, class');
        const element = document.getElementById('test-div');
        expect(element.hasAttribute('data-test')).toBe(false);
        expect(element.hasAttribute('class')).toBe(false);
    });

    it('should remove all attributes when called with no arguments', () => {
        const div = testDiv.removeAttr();
        expect(div.attr()).toBeObject({}); 
    });
});

describe('toggleAttr()', () => {
    it('should remove attribute when val is undefined', () => {
        testDiv.toggleAttr('data-test');
        expect(document.getElementById('test-div').hasAttribute('data-test')).toBe(false);
    });

    it('should set attribute when val is provided', () => {
        testDiv.toggleAttr('data-new', 'new-value');
        expect(document.getElementById('test-div').getAttribute('data-new')).toBe('new-value');
    });
});

describe('id()', () => {
    it('should get element id', () => {
        expect(testDiv.id()).toBe('test-div');
    });

    it('should set element id', () => {
        testDiv.id('new-id');
        expect(document.getElementById('new-id')).not.toBeNull();
    });
});

describe('title()', () => {
    it('should get element title', () => {
        expect(testDiv.title()).toBe('Test Title');
    });

    it('should set element title', () => {
        testDiv.title('New Title');
        expect(document.getElementById('test-div').getAttribute('title')).toBe('New Title');
    });
});

describe('href()', () => {
    it('should get link href', () => {
        const link = $('#test-link');
        expect(link.href()).toContain('https://example.com');
    });

    it('should set link href', () => {
        const link = $('#test-link');
        link.href('https://newexample.com');
        expect(document.getElementById('test-link').href).toContain('https://newexample.com');
    });

    it('should return undefined for non-link elements', () => {
        expect(testDiv.href()).toBeUndefined();
    });
});

describe('name()', () => {
    it('should get element name', () => {
        const img = $('#test-input');
        expect(img.name()).toBe('test-input-name');
    });

    it('should set element name', () => {
        const input = $('#test-input');
        input.name('new-input-name');
        expect(document.getElementById('test-input').name).toBe('new-input-name');
    });
});

describe('src()', () => {
    it('should get image src', () => {
        const img = $('#test-img');
        expect(img.src()).toContain('test.jpg');
    });

    it('should set image src', () => {
        const img = $('#test-img');
        img.src('new.jpg');
        expect(document.getElementById('test-img').src).toContain('new.jpg');
    });
});


