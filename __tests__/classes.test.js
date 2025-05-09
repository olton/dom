import { describe, it, expect, beforeEach, afterEach } from '@olton/latte';
import { $ } from '../dist/dom.js';

let testElement;

beforeEach(() => {
    // Создаем тестовую DOM-структуру перед каждым тестом
    document.body.innerHTML = '<div id="test-element" class="initial-class test-class"></div>';
    testElement = $('#test-element');
});

afterEach(() => {
    // Очищаем DOM после каждого теста
    document.body.innerHTML = '';
});

describe('addClass()', () => {
    it('should add a single class to an element', () => {
        testElement.addClass('new-class');
        expect(testElement[0].className).toContain('new-class');
        expect(testElement[0].className).toContain('initial-class');
    });

    it('should add multiple classes when separated by spaces', () => {
        testElement.addClass('new-class1 new-class2');
        expect(testElement[0].className).toContain('new-class1');
        expect(testElement[0].className).toContain('new-class2');
    });

    it('should add classes from an array', () => {
        testElement.addClass(['array-class1', 'array-class2']);
        expect(testElement[0].className).toContain('array-class1');
        expect(testElement[0].className).toContain('array-class2');
    });

    it('should not add empty classes', () => {
        const originalClassName = testElement[0].className;
        testElement.addClass('');
        testElement.addClass(' ');
        expect(testElement[0].className).toBe(originalClassName);
    });

    it('should return the element for chaining', () => {
        const result = testElement.addClass('chain-class');
        expect(result).toBe(testElement);
    });
});

describe('removeClass()', () => {
    it('should remove a single class from an element', () => {
        testElement.removeClass('test-class');
        expect(testElement[0].className).not.toContain('test-class');
        expect(testElement[0].className).toContain('initial-class');
    });

    it('should remove multiple classes when separated by spaces', () => {
        testElement.removeClass('initial-class test-class');
        expect(testElement[0].className).not.toContain('initial-class');
        expect(testElement[0].className).not.toContain('test-class');
    });

    it('should remove classes from an array', () => {
        testElement.removeClass(['initial-class', 'test-class']);
        expect(testElement[0].className).not.toContain('initial-class');
        expect(testElement[0].className).not.toContain('test-class');
    });

    it('should handle removing non-existent classes', () => {
        const originalClassName = testElement[0].className;
        testElement.removeClass('non-existent-class');
        expect(testElement[0].className).toBe(originalClassName);
    });

    it('should return the element for chaining', () => {
        const result = testElement.removeClass('test-class');
        expect(result).toBe(testElement);
    });
});

describe('toggleClass()', () => {
    it('should add a class if it does not exist', () => {
        testElement.toggleClass('toggle-class');
        expect(testElement[0].className).toContain('toggle-class');
    });

    it('should remove a class if it exists', () => {
        testElement.toggleClass('test-class');
        expect(testElement[0].className).not.toContain('test-class');
    });

    it('should toggle multiple classes when separated by spaces', () => {
        testElement.toggleClass('test-class new-toggle-class');
        expect(testElement[0].className).not.toContain('test-class');
        expect(testElement[0].className).toContain('new-toggle-class');
    });

    it('should toggle classes from an array', () => {
        testElement.toggleClass(['test-class', 'new-toggle-class']);
        expect(testElement[0].className).not.toContain('test-class');
        expect(testElement[0].className).toContain('new-toggle-class');
    });

    it('should return the element for chaining', () => {
        const result = testElement.toggleClass('toggle-class');
        expect(result).toBe(testElement);
    });
});

describe('hasClass()', () => {
    it('should return true if element has the class', () => {
        expect(testElement.hasClass('test-class')).toBe(true);
    });

    it('should return false if element does not have the class', () => {
        expect(testElement.hasClass('non-existent-class')).toBe(false);
    });

    it('should handle checking for multiple classes with spaces', () => {
        // Will return true if ANY of the classes exist
        expect(testElement.hasClass('test-class non-existent-class')).toBe(true);
        expect(testElement.hasClass('non-existent1 non-existent2')).toBe(false);
    });

    it('should return false for empty or invalid inputs', () => {
        expect(testElement.hasClass('')).toBe(false);
        expect(testElement.hasClass(' ')).toBe(false);
        expect(testElement.hasClass(null)).toBe(false);
        expect(testElement.hasClass(undefined)).toBe(false);
    });
});

describe('containsClass()', () => {
    it('should be an alias for hasClass', () => {
        expect(testElement.containsClass('test-class')).toBe(testElement.hasClass('test-class'));
        expect(testElement.containsClass('non-existent-class')).toBe(testElement.hasClass('non-existent-class'));
    });
});

describe('clearClasses()', () => {
    it('should remove all classes from an element', () => {
        testElement.clearClasses();
        expect(testElement[0].className).toBe('');
    });

    it('should return the element for chaining', () => {
        const result = testElement.clearClasses();
        expect(result).toBe(testElement);
    });
});

describe('cls()', () => {
    it('should return the className string by default', () => {
        expect(testElement.cls()).toBe('initial-class test-class');
    });

    it('should return an array of class names when array=true', () => {
        const classes = testElement.cls(true);
        expect(Array.isArray(classes)).toBe(true);
        expect(classes).toContain('initial-class');
        expect(classes).toContain('test-class');
    });

    it('should return undefined for empty elements', () => {
        const emptySet = $();
        expect(emptySet.cls()).toBeUndefined();
    });
});

describe('removeClassBy()', () => {
    it('should remove classes matching a partial pattern', () => {
        testElement[0].className = 'btn btn-primary btn-lg other-class';

        testElement.removeClassBy('btn');

        expect(testElement[0].className).not.toContain('btn');
        expect(testElement[0].className).not.toContain('btn-primary');
        expect(testElement[0].className).not.toContain('btn-lg');
        expect(testElement[0].className).toContain('other-class');
    });

    it('should handle case-sensitive patterns', () => {
        testElement[0].className = 'Button button ButtonGroup';

        testElement.removeClassBy('button');

        expect(testElement[0].className).not.toContain('button');
        expect(testElement[0].className).toContain('Button');
        expect(testElement[0].className).toContain('ButtonGroup');
    });

    it('should return the element for chaining', () => {
        const result = testElement.removeClassBy('test');
        expect(result).toBe(testElement);
    });
});

describe('classNames()', () => {
    it('should add string class names', () => {
        testElement.classNames('class1', 'class2');
        expect(testElement[0].className).toContain('class1');
        expect(testElement[0].className).toContain('class2');
    });

    it('should handle object notation for conditional classes', () => {
        testElement.classNames({
            'active': true,
            'disabled': false,
            'visible': true
        });

        expect(testElement[0].className).toContain('active');
        expect(testElement[0].className).not.toContain('disabled');
        expect(testElement[0].className).toContain('visible');
    });

    it('should handle mixed arguments of strings and objects', () => {
        testElement.classNames('fixed', { 'highlighted': true, 'selected': false });

        expect(testElement[0].className).toContain('fixed');
        expect(testElement[0].className).toContain('highlighted');
        expect(testElement[0].className).not.toContain('selected');
    });

    it('should ignore invalid inputs', () => {
        const originalClassName = testElement[0].className;
        testElement.classNames(null, 123, []);
        expect(testElement[0].className).toBe(originalClassName + ' ');
    });

    it('should return the element for chaining', () => {
        const result = testElement.classNames('chain-class');
        expect(result).toBe(testElement);
    });
});

describe('Multiple elements handling', () => {
    beforeEach(() => {
        document.body.innerHTML = `
                <div id="test1" class="common-class test1-class"></div>
                <div id="test2" class="common-class test2-class"></div>
                <div id="test3" class="common-class test3-class"></div>
            `;
        testElement = $('div');
    });

    it('should add class to all elements', () => {
        testElement.addClass('new-common-class');

        expect(document.getElementById('test1').className).toContain('new-common-class');
        expect(document.getElementById('test2').className).toContain('new-common-class');
        expect(document.getElementById('test3').className).toContain('new-common-class');
    });

    it('should remove class from all elements', () => {
        testElement.removeClass('common-class');

        expect(document.getElementById('test1').className).not.toContain('common-class');
        expect(document.getElementById('test2').className).not.toContain('common-class');
        expect(document.getElementById('test3').className).not.toContain('common-class');
    });

    it('should toggle class on all elements', () => {
        testElement.toggleClass('common-class');

        expect(document.getElementById('test1').className).not.toContain('common-class');
        expect(document.getElementById('test2').className).not.toContain('common-class');
        expect(document.getElementById('test3').className).not.toContain('common-class');
    });

    it('should return true for hasClass if any element has the class', () => {
        expect(testElement.hasClass('test1-class')).toBe(true);
        expect(testElement.hasClass('non-existent')).toBe(false);
    });
});
