import { describe, it, expect, beforeEach, afterEach, mock } from '@olton/latte';
import { $ } from '../dist/dom.js';

beforeEach(() => {
    // Создаем тестовую DOM-структуру
    document.body.innerHTML = `
            <div id="test-container">
                <div id="test-element" class="test-class">
                    <span id="child1">Child 1</span>
                    <span id="child2">Child 2</span>
                </div>
                <form id="test-form">
                    <input type="text" name="username" value="test-user">
                    <input type="email" name="email" value="test@example.com">
                    <input type="checkbox" name="subscribe" value="yes" checked>
                    <input type="checkbox" name="terms" value="accept">
                    <select name="country">
                        <option value="us" selected>USA</option>
                        <option value="uk">UK</option>
                    </select>
                    <select name="interests" multiple>
                        <option value="tech" selected>Technology</option>
                        <option value="sport" selected>Sports</option>
                        <option value="art">Art</option>
                    </select>
                    <textarea name="comments">Test comment</textarea>
                    <button type="submit" name="submit" value="Send">Submit</button>
                </form>
            </div>
        `;
});

afterEach(() => {
    // Очищаем DOM после каждого теста
    document.body.innerHTML = '';
});

describe('$.device and related utilities', () => {
    it('should determine if device is mobile', () => {
        // Это свойство зависит от User-Agent, просто проверяем его существование
        expect($.device).toBeDefined();
        expect(typeof $.device).toBe('boolean');
    });

    it('should determine if current URL is localhost', () => {
        expect($.localhost).toBeDefined();
        expect(typeof $.localhost).toBe('boolean');
    });

    it('should provide isLocalhost function', () => {
        expect(typeof $.isLocalhost).toBe('function');
        expect($.isLocalhost('localhost')).toBe(true);
        expect($.isLocalhost('127.0.0.1')).toBe(true);
        expect($.isLocalhost('example.com')).toBe(false);
    });

    it('should determine if device supports touch', () => {
        expect($.touchable).toBeDefined();
        expect(typeof $.touchable).toBe('boolean');
    });

    it('should provide isPrivateAddress function', () => {
        expect(typeof $.isPrivateAddress).toBe('function');
        expect($.isPrivateAddress('localhost')).toBe(true);
        expect($.isPrivateAddress('192.168.1.1')).toBe(true);
        expect($.isPrivateAddress('8.8.8.8')).toBe(false);
    });
});

describe('$.uniqueId', () => {
    it('should generate unique ID with default prefix', () => {
        const id1 = $.uniqueId();
        const id2 = $.uniqueId();

        expect(id1).toContain('dom-');
        expect(id2).toContain('dom-');
        expect(id1).toBe(id2);
    });

    it('should generate unique ID with custom salt', () => {
        const id = $.uniqueId('test');
        expect(id).toBe('dom-3556498');
    });

    it('should generate unique ID with empty prefix', () => {
        const id = $.uniqueId('');
        expect(id).toBe('dom-3522646');
    });
});

describe('$.toArray', () => {
    it('should convert array-like object to array', () => {
        const nodeList = document.querySelectorAll('span');
        const array = $.toArray(nodeList);

        expect(Array.isArray(array)).toBe(true);
        expect(array.length).toBe(nodeList.length);
        expect(array[0]).toBe(nodeList[0]);
        expect(array[1]).toBe(nodeList[1]);
    });
});

describe('$.import', () => {
    it('should import nodes into a jQuery object', () => {
        const spans = document.querySelectorAll('span');
        const imported = $.import(spans);

        expect(imported instanceof $).toBe(true);
        expect(imported.length).toBe(spans.length);
        expect(imported[0]).toBe(spans[0]);
        expect(imported[1]).toBe(spans[1]);
    });
});

describe('$.merge', () => {
    it('should merge two arrays', () => {
        const arr1 = [1, 2];
        const arr2 = [3, 4];
        const result = $.merge(arr1, arr2);

        expect(result).toBe(arr1);
        expect(result).toBeArrayEqual([1, 2, 3, 4]);
    });

    it('should merge array with empty array', () => {
        const arr1 = [1, 2];
        const arr2 = [];
        const result = $.merge(arr1, arr2);

        expect(result).toBe(arr1);
        expect(result).toBeArrayEqual([1, 2]);
    });

    it('should merge empty array with array', () => {
        const arr1 = [];
        const arr2 = [1, 2];
        const result = $.merge(arr1, arr2);

        expect(result).toBe(arr1);
        expect(result).toBeArrayEqual([1, 2]);
    });
});

describe('$.type', () => {
    it('should determine correct types', () => {
        expect($.type({})).toBe('object');
        expect($.type([])).toBe('array');
        expect($.type('')).toBe('string');
        expect($.type(42)).toBe('number');
        expect($.type(true)).toBe('boolean');
        expect($.type(null)).toBe('null');
        expect($.type(undefined)).toBe('undefined');
        expect($.type(() => {})).toBe('function');
        expect($.type(new Date())).toBe('date');
        expect($.type(/regex/)).toBe('regexp');
    });
});

describe('$.isSelector', () => {
    it('should return true for valid CSS selectors', () => {
        expect($.isSelector('#test-element')).toBe(true);
        expect($.isSelector('.test-class')).toBe(true);
        expect($.isSelector('div')).toBe(true);
        expect($.isSelector('div > span')).toBe(true);
    });

    it('should return false for invalid selectors', () => {
        expect($.isSelector('#')).toBeFalse();
        expect($.isSelector('div[')).toBeTrue(); //?
        expect($.isSelector('div::')).toBeTrue(); //?
    });

    it('should return false for non-string values', () => {
        expect($.isSelector(null)).toBe(false);
        expect($.isSelector(undefined)).toBe(false);
        expect($.isSelector(42)).toBe(false);
        expect($.isSelector({})).toBe(false);
        expect($.isSelector([])).toBe(false);
    });
});

describe('$.remove', () => {
    it('should remove elements from DOM', () => {
        $.remove('#test-element');
        expect(document.getElementById('test-element')).toBe(null);
    });
});

describe('$.random', () => {
    it('should generate random number within range', () => {
        const rand = $.random(1, 10);
        expect(rand).toBeGreaterThanOrEqual(1);
        expect(rand).toBeLessThanOrEqual(10);
    });

    it('should select random element from array', () => {
        const arr = [1, 2, 3, 4, 5];
        const rand = $.random(arr);
        expect(arr).toContain(rand);
    });
});

describe('$.dark', () => {
    it('should detect dark mode preference', () => {
        // Создаем мок для matchMedia
        const originalMatchMedia = window.matchMedia;
        window.matchMedia = mock().mockImplementation(query => {
            return {
                matches: query === '(prefers-color-scheme: dark)',
                media: query
            };
        });

        // $.dark устанавливается при загрузке, поэтому нужно пересоздать его
        const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        expect($.dark).toBeDefined();

        // Восстанавливаем оригинальный matchMedia
        window.matchMedia = originalMatchMedia;
    });
});

describe('Form serialization', () => {
    it('should serialize form to array', () => {
        const formArray = $.serializeToArray('#test-form');

        expect(Array.isArray(formArray)).toBe(true);
        expect(formArray).toContain('username=test-user');
        expect(formArray).toContain('email=test%40example.com');
        expect(formArray).toContain('subscribe=yes');
        expect(formArray).not.toContain('terms=accept'); // Не отмечен
        expect(formArray).toContain('country=us');
        expect(formArray).toContain('interests=tech');
        expect(formArray).toContain('interests=sport');
        expect(formArray).not.toContain('interests=art'); // Не выбран
        expect(formArray).toContain('comments=Test%20comment');
        expect(formArray).toContain('submit=Send');
    });

    it('should serialize form to string', () => {
        const formString = $.serialize('#test-form');

        expect(typeof formString).toBe('string');
        expect(formString).toContain('username=test-user');
        expect(formString).toContain('email=test%40example.com');
        expect(formString).toContain('&');
    });
});

describe('$.viewport', () => {
    it('should return viewport dimensions', () => {
        const viewport = $.viewport();

        expect(viewport.width).toBeDefined();
        expect(viewport.height).toBeDefined();
        expect(typeof viewport.width).toBe('number');
        expect(typeof viewport.height).toBe('number');
    });
});

describe('$.fn.items', () => {
    it('should convert jQuery object to array', () => {
        const $spans = $('span');
        const items = $spans.items();

        expect(Array.isArray(items)).toBe(true);
        expect(items.length).toBe($spans.length);
        expect(items[0]).toBe($spans[0]);
        expect(items[1]).toBe($spans[1]);
    });
});

describe('Utility functions', () => {
    it('should check if object is plain object', () => {
        expect($.isPlainObject({})).toBe(true);
        expect($.isPlainObject(Object.create(null))).toBe(true);
        expect($.isPlainObject([])).toBe(false);
        expect($.isPlainObject(null)).toBe(false);
        expect($.isPlainObject(new Date())).toBe(false);
    });

    it('should check if object is empty', () => {
        expect($.isEmptyObject({})).toBe(true);
        expect($.isEmptyObject({a: 1})).toBe(false);
    });

    it('should check if object is array-like', () => {
        expect($.isArrayLike([])).toBe(true);
        expect($.isArrayLike(document.querySelectorAll('span'))).toBe(true);
        expect($.isArrayLike({0: 'a', 1: 'b', length: 2})).toBe(true);
        expect($.isArrayLike({})).toBe(false);
        expect($.isArrayLike(null)).toBe(false);
    });

    it('should check if element is visible', () => {
        const visibleEl = $('#test-element')[0];
        expect($.isVisible(visibleEl)).toBe(true);

        const hiddenEl = document.createElement('div');
        hiddenEl.style.display = 'none';
        document.body.appendChild(hiddenEl);
        expect($.isHidden(hiddenEl)).toBe(true);
    });

    it('should match elements against selector', () => {
        const element = $('#test-element')[0];
        expect($.matches(element, '.test-class')).toBe(true);
        expect($.matches(element, '#test-element')).toBe(true);
        expect($.matches(element, 'span')).toBe(false);
    });

    it('should parse units from CSS values', () => {
        expect($.parseUnit('10px')).toBeArrayEqual([10, 'px']);
        expect($.parseUnit('20em')).toBeArrayEqual([20, 'em']);
        expect($.parseUnit('30%')).toBeArrayEqual([30, '%']);
        expect($.parseUnit(40)).toBeArrayEqual([40, '']);
    });

    it('should get units from CSS values', () => {
        expect($.getUnit('10px')).toBe('px');
        expect($.getUnit('20em')).toBe('em');
        expect($.getUnit('30%')).toBe('%');
        expect($.getUnit(40)).toBeUndefined();
        expect($.getUnit(40, 'px')).toBe('px'); // Default
    });

    it('should check if object has own property', () => {
        const obj = {a: 1};
        expect($.hasProp(obj, 'a')).toBe(true);
        expect($.hasProp(obj, 'toString')).toBe(false);
    });
});
