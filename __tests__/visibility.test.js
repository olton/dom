import { describe, it, expect, beforeEach, afterEach, mock } from '@olton/latte';
import { $ } from '../dist/dom.js';

beforeEach(() => {
    // Создаем тестовую DOM-структуру
    document.body.innerHTML = `
            <div id="test-container">
                <div id="test-element" class="test-class">Test Element</div>
                <div id="initially-hidden" style="display: none;">Hidden Element</div>
                <div id="initially-invisible" style="visibility: hidden;">Invisible Element</div>
                <div id="initially-with-hidden-attr" hidden>Element with hidden attribute</div>
                <div id="element-with-opacity" style="opacity: 0;">Transparent Element</div>
            </div>
        `;
});

afterEach(() => {
    // Очищаем DOM после каждого теста
    document.body.innerHTML = '';
});

describe('$.hidden and $.fn.hidden', () => {
    it('should set hidden attribute', () => {
        const element = $('#test-element')[0];
        $.hidden(element, true);

        expect(element.hidden).toBe(true);
    });

    it('should remove hidden attribute', () => {
        const element = $('#initially-with-hidden-attr')[0];
        $.hidden(element, false);

        expect(element.hidden).toBe(false);
    });

    it('should toggle hidden attribute when no value provided', () => {
        const element = $('#test-element')[0];
        const initialState = element.hidden;
        $.hidden(element);

        expect(element.hidden).toBe(!initialState);
    });

    it('should handle string values', () => {
        const element = $('#test-element')[0];
        $.hidden(element, 'true');

        expect(element.hidden).toBe(true);

        $.hidden(element, 'false');

        expect(element.hidden).toBe(false);
    });

    it('should execute callback function', () => {
        const callback = mock();
        const element = $('#test-element')[0];

        $.hidden(element, true, callback);

        expect(callback).toHaveBeenCalled();
    });

    it('should work with jQuery-style syntax', () => {
        const element = $('#test-element');
        element.hidden(true);

        expect(element[0].hidden).toBe(true);
    });

    it('should work with multiple elements', () => {
        const elements = $('#test-element, #initially-hidden');
        elements.hidden(true);

        expect($('#test-element')[0].hidden).toBe(true);
        expect($('#initially-hidden')[0].hidden).toBe(true);
    });
});

describe('$.hide and $.fn.hide', () => {
    it('should set display to none', () => {
        const element = $('#test-element')[0];
        $.hide(element);

        expect(element.style.display).toBe('none');
    });

    it('should store original display value', () => {
        const element = $('#test-element');
        const originalDisplay = getComputedStyle(element[0]).display;

        element.hide();

        const storedDisplay = element.origin('display');
        expect(storedDisplay.css).toBe(originalDisplay);
    });

    it('should execute callback function', () => {
        const callback = mock();
        const element = $('#test-element')[0];

        $.hide(element, callback);

        expect(callback).toHaveBeenCalled();
    });

    it('should work with jQuery-style syntax', () => {
        const element = $('#test-element');
        element.hide();

        expect(element[0].style.display).toBe('none');
    });

    it('should work with multiple elements', () => {
        const elements = $('#test-element, #element-with-opacity');
        elements.hide();

        expect($('#test-element')[0].style.display).toBe('none');
        expect($('#element-with-opacity')[0].style.display).toBe('none');
    });
});

describe('$.show and $.fn.show', () => {
    it('should remove display:none', () => {
        const element = $('#initially-hidden')[0];
        $.show(element);

        expect(element.style.display).not.toBe('none');
    });

    it('should set display to block for elements with computed display:none', () => {
        // Создаем элемент с вычисленным display:none
        const newElement = document.createElement('div');
        newElement.id = 'computed-none';
        newElement.style.cssText = 'display:none';
        document.body.appendChild(newElement);

        $.show(newElement);

        expect(newElement.style.display).toBe('block');
    });

    it('should restore original display value if available', () => {
        // Сохраняем оригинальное значение
        const element = $('#test-element');
        const originalDisplay = 'inline-block';

        element[0].style.display = originalDisplay;
        element.hide();
        element.show();

        expect(element[0].style.display).toBe(originalDisplay);
    });

    it('should set opacity to 1 for elements with opacity 0', () => {
        const element = $('#element-with-opacity')[0];
        $.show(element);

        expect(element.style.opacity).toBe('1');
    });

    it('should execute callback function', () => {
        const callback = mock();
        const element = $('#initially-hidden')[0];

        $.show(element, callback);

        expect(callback).toHaveBeenCalled();
    });

    it('should work with jQuery-style syntax', () => {
        const element = $('#initially-hidden');
        element.show();

        expect(element[0].style.display).not.toBe('none');
    });

    it('should work with multiple elements', () => {
        const elements = $('#initially-hidden, #element-with-opacity');
        elements.show();

        expect($('#initially-hidden')[0].style.display).not.toBe('none');
        expect($('#element-with-opacity')[0].style.opacity).toBe('1');
    });
});

describe('$.visible and $.fn.visible', () => {
    it('should set visibility to visible', () => {
        const element = $('#initially-invisible')[0];
        $.visible(element, true);

        expect(element.style.visibility).toBe('visible');
    });

    it('should set visibility to hidden', () => {
        const element = $('#test-element')[0];
        $.visible(element, false);

        expect(element.style.visibility).toBe('hidden');
    });

    it('should default to visible when mode is undefined', () => {
        const element = $('#initially-invisible')[0];
        $.visible(element);

        expect(element.style.visibility).toBe('visible');
    });

    it('should execute callback function', () => {
        const callback = mock();
        const element = $('#initially-invisible')[0];

        $.visible(element, true, callback);

        expect(callback).toHaveBeenCalled();
    });

    it('should work with jQuery-style syntax', () => {
        const element = $('#initially-invisible');
        element.visible(true);

        expect(element[0].style.visibility).toBe('visible');
    });

    it('should work with multiple elements', () => {
        const elements = $('#test-element, #initially-invisible');
        elements.visible(false);

        expect($('#test-element')[0].style.visibility).toBe('hidden');
        expect($('#initially-invisible')[0].style.visibility).toBe('hidden');
    });
});

describe('$.toggle and $.fn.toggle', () => {
    it('should hide visible elements', () => {
        const element = $('#test-element')[0];
        $.toggle(element);

        expect(element.style.display).toBe('none');
    });

    it('should show hidden elements', () => {
        const element = $('#initially-hidden')[0];
        $.toggle(element);

        expect(element.style.display).not.toBe('none');
    });

    it('should execute callback function', () => {
        const callback = mock();
        const element = $('#test-element')[0];

        $.toggle(element, callback);

        expect(callback).toHaveBeenCalled();
    });

    it('should work with jQuery-style syntax', () => {
        const element = $('#test-element');
        element.toggle();

        expect(element[0].style.display).toBe('none');

        element.toggle();

        expect(element[0].style.display).not.toBe('none');
    });
});
