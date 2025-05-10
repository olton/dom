import { describe, it, expect, beforeEach, afterEach } from '@olton/latte';
import { $ } from '../dist/dom.js';

let testElement;

beforeEach(() => {
    // Создаем тестовый DOM-элемент перед каждым тестом
    document.body.innerHTML = `
            <div id="test-element" data-role="button" data-size="large" data-active="true"></div>
        `;
    testElement = $('#test-element');
});

afterEach(() => {
    // Очищаем DOM и кэш данных после каждого теста
    document.body.innerHTML = '';
});

describe('$.data', () => {
    it('should get data attribute from element', () => {
        expect($.data(testElement[0], 'role')).toBe('button');
        expect($.data(testElement[0], 'size')).toBe('large');
    });

    it('should set data to element', () => {
        $.data(testElement[0], 'color', 'red');
        expect($.data(testElement[0], 'color')).toBe('red');
    });

    it('should set multiple data values with an object', () => {
        $.data(testElement[0], {
            color: 'blue',
            weight: 'bold'
        });

        expect($.data(testElement[0], 'color')).toBe('blue');
        expect($.data(testElement[0], 'weight')).toBe('bold');
    });

    it('should get all data when key is not provided', () => {
        $.data(testElement[0], 'color', 'red');

        const allData = $.data(testElement[0]);

        expect(allData.role).toBe('button');
        expect(allData.color).toBe('red');
    });
});

describe('$.removeData', () => {
    it('should remove single data item', () => {
        $.data(testElement[0], 'color', 'red');
        $.removeData(testElement[0], 'color');

        expect($.data(testElement[0], 'color')).toBeUndefined();
    });

    it('should remove multiple data items when provided as array', () => {
        $.data(testElement[0], 'color', 'red');
        $.data(testElement[0], 'weight', 'bold');

        $.removeData(testElement[0], ['color', 'weight']);

        expect($.data(testElement[0], 'color')).toBeUndefined();
        expect($.data(testElement[0], 'weight')).toBeUndefined();
    });

    it('should remove all data items when key is not provided', () => {
        $.data(testElement[0], 'color', 'red');
        $.data(testElement[0], 'weight', 'bold');

        $.removeData(testElement[0]);

        expect($.data(testElement[0], 'color')).toBeUndefined();
        expect($.data(testElement[0], 'weight')).toBeUndefined();
    });
});

describe('$.hasData', () => {
    it('should return true when element has data', () => {
        $.data(testElement[0], 'color', 'red');
        expect($.hasData(testElement[0])).toBe(true);
    });

    it('should return false when element has no data', () => {
        const newElement = $('<div>')[0];
        expect($.hasData(newElement)).toBe(false);
    });

    it('should return false after removing all data', () => {
        $.data(testElement[0], 'color', 'red');
        $.removeData(testElement[0]);
        expect($.hasData(testElement[0])).toBe(false);
    });
});

describe('$.dataSet', () => {
    it('should return default dataset when no namespace provided', () => {
        const defaultDataset = $.dataSet();
        expect(defaultDataset.expando).toContain('DATASET:UID:DOM');
    });

    it('should create new dataset with custom namespace', () => {
        const customDataset = $.dataSet('custom');
        expect(customDataset.expando).toContain('DATASET:UID:CUSTOM');
    });

    it('should throw error when using reserved namespace', () => {
        expect(() => $.dataSet('internal')).toThrow();
        expect(() => $.dataSet('dom')).toThrow();
    });

    it('should allow using separate datasets for different purposes', () => {
        const customDataset = $.dataSet('test');

        // Default dataset
        $.data(testElement[0], 'color', 'red');

        // Custom dataset
        customDataset.set(testElement[0], 'color', 'blue');

        expect($.data(testElement[0], 'color')).toBe('red');
        expect(customDataset.get(testElement[0], 'color')).toBe('blue');
    });
});

describe('$.fn.data', () => {
    it('should get data attribute from element', () => {
        expect(testElement.data('role')).toBe('button');
        expect(testElement.data('size')).toBe('large');
    });

    it('should convert data-attribute names to camelCase', () => {
        const elem = $('<div data-user-name="John">');
        expect(elem.data('userName')).toBe('John');
    });

    it('should attempt to convert JSON strings in data attributes', () => {
        const elem = $('<div data-config=\'{"key":"value"}\'>');
        const config = elem.data('config');
        expect(typeof config).toBe('object');
        expect(config.key).toBe('value');
    });

    it('should set data to element', () => {
        testElement.data('color', 'red');
        expect(testElement.data('color')).toBe('red');
    });

    it('should set multiple data values with an object', () => {
        testElement.data({
            color: 'blue',
            weight: 'bold'
        });

        expect(testElement.data('color')).toBe('blue');
        expect(testElement.data('weight')).toBe('bold');
    });

    it('should get all data when no arguments provided', () => {
        testElement.data('color', 'red');

        const allData = testElement.data();
        expect(allData.role).toBe('button');
        expect(allData.color).toBe('red');
    });

    it('should chain correctly when setting data', () => {
        const result = testElement.data('color', 'red');
        expect(result).toBe(testElement);
    });

    it('should return undefined when called on empty collection', () => {
        const emptySet = $();
        expect(emptySet.data('anything')).toBeUndefined();
        expect(emptySet.data()).toBeUndefined();
    });
});

describe('$.fn.removeData', () => {
    it('should remove a single data item', () => {
        testElement.data('color', 'red');
        testElement.removeData('color');

        expect(testElement.data('color')).toBeUndefined();
    });

    it('should remove multiple data items when provided as space-separated string', () => {
        testElement.data('color', 'red');
        testElement.data('weight', 'bold');

        testElement.removeData('color weight');

        expect(testElement.data('color')).toBeUndefined();
        expect(testElement.data('weight')).toBeUndefined();
    });

    it('should support chaining', () => {
        const result = testElement.removeData('role');
        expect(result).toBe(testElement);
    });
});

describe('$.fn.origin', () => {
    it('should set and get origin data', () => {
        testElement.origin('initial-color', 'blue');
        expect(testElement.origin('initial-color')).toBe('blue');
    });

    it('should return default value when origin data does not exist', () => {
        expect(testElement.origin('non-existent', null, 'default-value')).toBe('default-value');
    });
    
    it('should support chaining when setting data', () => {
        const result = testElement.origin('initial-color', 'blue');
        expect(result).toBe(testElement);
    });

    it('should return the collection when called on empty collection', () => {
        const emptySet = $();
        expect(emptySet.origin('anything', 'value')).toBe(emptySet);
    });
});

describe('Data object internals', () => {
    it('should create unique expandos for different datasets', () => {
        const dataset1 = $.dataSet('test1');
        const dataset2 = $.dataSet('test2');

        expect(dataset1.expando).not.toBe(dataset2.expando);
    });

    it('should handle non-element objects as data owners', () => {
        const plainObject = {};

        $.data(plainObject, 'key', 'value');
        expect($.data(plainObject, 'key')).toBe('value');

        $.removeData(plainObject, 'key');
        expect($.data(plainObject, 'key')).toBeUndefined();
    });
});
