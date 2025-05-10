import { describe, it, expect, beforeEach, afterEach, waitFor } from '@olton/latte'
import { $ } from '../dist/dom.js';

let testElement;

beforeEach(() => {
    // Создаем тестовый DOM-элемент перед каждым тестом
    document.body.innerHTML = `
            <div id="test-element" 
                 style="width: 100px; 
                        height: 100px; 
                        color: red; 
                        background-color: blue;
                        margin: 10px;
                        --custom-var: 20px;">
                Test Content
            </div>
            <div id="empty-element"></div>
        `;

    testElement = $('#test-element');
});

afterEach(() => {
    // Очищаем DOM после каждого теста
    document.body.innerHTML = '';
});

describe('style()', () => {
    it('should return computed style object when no name provided', () => {
        const styles = testElement.style();
        expect(styles).toBeInstanceOf(CSSStyleDeclaration);
        expect(styles.width).toBe('100px');
        expect(styles.height).toBe('100px');
        expect(styles.color).toBe('red');
    });

    it('should return computed style object when name is "all"', () => {
        const styles = testElement.style('all');
        expect(styles).toBeInstanceOf(CSSStyleDeclaration);
    });

    it('should return specific style property when single name provided', () => {
        expect(testElement.style('width')).toBe('100px');
        expect(testElement.style('color')).toBe('red');
        expect(testElement.style('backgroundColor')).toBe('blue');
        expect(testElement.style('background-color')).toBe('blue');
    });

    it('should return object with specific properties when multiple names provided', () => {
        const result = testElement.style('width, height, color');
        expect(result).toBeInstanceOf(Object);
        expect(result.width).toBe('100px');
        expect(result.height).toBe('100px');
        expect(result.color).toBe('red');
    });

    it('should handle scrollLeft and scrollTop properties', () => {
        const div = $('<div style="width: 200px; height: 200px; overflow: auto;">')
            .append('<div style="width: 400px; height: 400px;"></div>')
            .appendTo(document.body);

        div[0].scrollLeft = 50;
        div[0].scrollTop = 50;

        expect(div.style('scrollLeft')).toBe(50);
        expect(div.style('scrollTop')).toBe(50);
    });

    // it('should support pseudo-elements', () => {
    //     // Add a test element with pseudo-element
    //     const pseudoDiv = $('<div id="pseudo-test" style="position:relative;"></div>').appendTo(document.body);
    //
    //     // Add style rule for pseudo-element
    //     const style = document.createElement('style');
    //     style.innerHTML = '#pseudo-test::before { content: "test"; color: green; }';
    //     document.head.appendChild(style);
    //    
    //     // Test getting pseudo-element style
    //     const pseudoColor = pseudoDiv.style('color', '::before');
    //
    //     // Clean up
    //     document.head.removeChild(style);
    //
    //     expect(pseudoColor).toBe('green');
    // });

    it('should return undefined for empty collection', () => {
        const empty = $('#non-existent');
        expect(empty.style('width')).toBeUndefined();
    });
});

describe('removeStyleProperty()', () => {
    it('should remove a single style property', () => {
        testElement.removeStyleProperty('color');
        expect(testElement[0].style.color).toBe('');
    });

    it('should remove multiple style properties', () => {
        testElement.removeStyleProperty('color, background-color');
        expect(testElement[0].style.color).toBe('');
        expect(testElement[0].style.backgroundColor).toBe('');
    });

    it('should return the element for chaining', () => {
        const result = testElement.removeStyleProperty('color');
        expect(result).toBe(testElement);
    });

    it('should handle empty or undefined property names', () => {
        const original = testElement[0].style.cssText;
        testElement.removeStyleProperty();
        expect(testElement[0].style.cssText).toBe(original);
    });

    it('should handle empty collections', () => {
        const empty = $('#non-existent');
        expect(empty.removeStyleProperty('color')).toBe(empty);
    });
});

describe('removeStyle()', () => {
    it('should remove a single style property', () => {
        testElement.removeStyle('color');
        expect(testElement[0].style.color).toBe('');
    });

    it('should remove multiple style properties', () => {
        testElement.removeStyle('color, backgroundColor');
        expect(testElement[0].style.color).toBe('');
        expect(testElement[0].style.backgroundColor).toBe('');
    });

    it('should return the element for chaining', () => {
        const result = testElement.removeStyle('color');
        expect(result).toBe(testElement);
    });

    it('should handle empty property names', () => {
        const original = testElement[0].style.cssText;
        testElement.removeStyle();
        expect(testElement[0].style.cssText).toBe(original);
    });
});

describe('css()', () => {
    it('should get a style property when used as getter', () => {
        expect(testElement.css('width')).toBe('100px');
        expect(testElement.css('color')).toBe('red');
    });

    it('should return all computed styles when key is "all"', () => {
        const styles = testElement.css();
        expect(styles).toBeInstanceOf(CSSStyleDeclaration);
    });

    it('should set a single style property', () => {
        testElement.css('color', 'green');
        expect(testElement[0].style.color).toBe('green');
    });

    it('should set multiple style properties via object', () => {
        testElement.css({
            color: 'green',
            backgroundColor: 'yellow',
            fontSize: '20px'
        });

        expect(testElement[0].style.color).toBe('green');
        expect(testElement[0].style.backgroundColor).toBe('yellow');
        expect(testElement[0].style.fontSize).toBe('20px');
    });

    it('should handle numeric values by adding px', () => {
        testElement.css('width', 200);
        expect(testElement[0].style.width).toBe('200px');
    });

    it('should not add px suffix to certain properties', () => {
        testElement.css('opacity', 0.5);
        testElement.css('zIndex', 10);

        expect(testElement[0].style.opacity).toBe('0.5');
        expect(testElement[0].style.zIndex).toBe('10');
    });

    it('should return the element for chaining when setting', () => {
        const result = testElement.css('color', 'green');
        expect(result).toBe(testElement);
    });
});

describe('cssVar()', () => {
    it('should get a CSS variable value', () => {
        expect(testElement.cssVar('custom-var')).toBe('20px');
    });

    it('should set a CSS variable value', () => {
        testElement.cssVar('custom-var', '30px');
        expect(getComputedStyle(testElement[0]).getPropertyValue('--custom-var')).toBe('30px');
    });

    it('should set a new CSS variable', () => {
        testElement.cssVar('new-var', 'blue');
        expect(getComputedStyle(testElement[0]).getPropertyValue('--new-var')).toBe('blue');
    });

    it('should return the element for chaining when setting', () => {
        const result = testElement.cssVar('custom-var', '30px');
        expect(result).toBe(testElement);
    });

    it('should return undefined when name is not provided', () => {
        expect(testElement.cssVar()).toBeUndefined();
    });
});

// Тесты для вспомогательных функций, которые используются в css.js

describe('CSS Helper Functions', () => {
    it('should handle vendor prefixes', () => {
        // Тестируем внутреннюю функцию setStyleProp через css
        testElement.css('transform', 'translateX(100px)');

        // Проверяем, что стиль был установлен
        const style = testElement[0].style;
        const hasTransform = style.transform || style.webkitTransform || style.MozTransform || style.msTransform;
        expect(hasTransform).toBe('translateX(100px)');
    });

    it('should add px suffix to numeric values', () => {
        testElement.css('margin-top', 20);
        expect(testElement[0].style.marginTop).toBe('20px');
    });

    it('should not add px suffix to string values with units', () => {
        testElement.css('width', '50%');
        expect(testElement[0].style.width).toBe('50%');

        testElement.css('height', '10vh');
        expect(testElement[0].style.height).toBe('10vh');
    });
});
