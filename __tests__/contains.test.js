import { describe, it, expect, beforeEach, afterEach } from '@olton/latte';
import { $ } from '../dist/dom.js';

beforeEach(() => {
    // Создаем тестовую DOM-структуру перед каждым тестом
    document.body.innerHTML = `
            <div id="parent">
                <div id="first-child" class="child">First Child</div>
                <div id="second-child" class="child">
                    <p class="paragraph" id="p1">Paragraph 1</p>
                    <p class="paragraph" id="p2">Paragraph 2</p>
                    <span class="span-element">Span 1</span>
                </div>
                <div id="third-child" class="child">Third Child</div>
            </div>
            <div id="sibling">Sibling</div>
            <form id="test-form">
                <input type="text" id="text-input">
                <input type="checkbox" id="checkbox-input" checked>
                <input type="radio" id="radio-input" checked>
                <input type="hidden" id="hidden-input">
                <select id="test-select">
                    <option id="option-1" value="1">Option 1</option>
                    <option id="option-2" value="2" selected>Option 2</option>
                    <option id="option-3" value="3">Option 3</option>
                </select>
            </form>
            <div id="hidden-div" style="display: none;">Hidden Div</div>
        `;
});

afterEach(() => {
    // Очищаем DOM после каждого теста
    document.body.innerHTML = '';
});

describe('index()', () => {
    it('should return index of element among its siblings', () => {
        expect($('#first-child').index()).toBe(0);
        expect($('#second-child').index()).toBe(1);
        expect($('#third-child').index()).toBe(2);
    });

    it('should return -1 for elements without parent', () => {
        const detached = $('<div id="detached">Detached</div>');
        expect(detached.index()).toBe(-1);
    });

    it('should return index of the first matching element when selector is provided', () => {
        expect($('.child').index('#second-child')).toBe(1);
    });

    it('should return index of element within collection', () => {
        const children = $('.child');
        expect(children.index($('#second-child'))).toBe(1);
    });

    it('should return -1 when element is not found', () => {
        expect($('#parent').index('#non-existent')).toBe(-1);
    });

    it('should return -1 for empty collections', () => {
        expect($('#non-existent').index()).toBe(-1);
    });
});

describe('indexOf()', () => {
    it('should return index of element in collection', () => {
        const children = $('.child');
        expect(children.indexOf(children[1])).toBe(1);
    });

    it('should return index of element when provided as selector', () => {
        expect($('.child').indexOf('#second-child')).toBe(1);
    });

    it('should return index of element when provided as Dom object', () => {
        expect($('.child').indexOf($('#second-child'))).toBe(1);
    });

    it('should return -1 when element is not in collection', () => {
        expect($('.child').indexOf('#sibling')).toBe(-1);
    });

    it('should return -1 for empty collections', () => {
        expect($('#non-existent').indexOf('#anything')).toBe(-1);
    });
});

describe('get()', () => {
    it('should return DOM element at specified index', () => {
        const children = $('.child');
        expect(children.get(0)).toBe(document.getElementById('first-child'));
        expect(children.get(1)).toBe(document.getElementById('second-child'));
    });

    it('should support negative indices', () => {
        const children = $('.child');
        expect(children.get(-1)).toBe(document.getElementById('third-child'));
        expect(children.get(-2)).toBe(document.getElementById('second-child'));
    });

    it('should return all elements when no index provided', () => {
        const children = $('.child');
        const result = children.get();
        expect(result).toBeInstanceOf($);
        expect(result.length).toBe(3);
        expect(result[0]).toBe(document.getElementById('first-child'));
    });
});

describe('eq()', () => {
    it('should return new Dom object with element at specified index', () => {
        const children = $('.child');
        const second = children.eq(1);

        expect(second instanceof $).toBe(true);
        expect(second.length).toBe(1);
        expect(second[0]).toBe(document.getElementById('second-child'));
        expect(second._prevObj).toBe(children);
    });

    it('should support negative indices', () => {
        const children = $('.child');
        const last = children.eq(-1);

        expect(last.length).toBe(1);
        expect(last[0]).toBe(document.getElementById('third-child'));
    });

    it('should return empty Dom object when index is out of bounds', () => {
        const children = $('.child');
        const nonExistent = children.eq(10);
        expect(nonExistent instanceof $).toBe(true);
        expect(nonExistent.length).toBe(0);
    });

    it('should return this when index is undefined or null', () => {
        const children = $('.child');
        expect(children.eq()).toBe(children);
        expect(children.eq(null)).toBe(children);
    });
});

describe('is()', () => {
    it('should check if elements match selector', () => {
        expect($('#first-child').is('.child')).toBe(true);
        expect($('#first-child').is('#non-existent')).toBe(false);
    });

    it('should check if elements match another Dom object', () => {
        expect($('#first-child').is($('.child').first())).toBe(true);
        expect($('#first-child').is($('#third-child'))).toBe(false);
    });

    it('should check if elements are in an array-like object', () => {
        expect($('#first-child').is(document.getElementsByClassName('child'))).toBe(true);
    });

    it('should check if element is a DOM node', () => {
        const node = document.getElementById('first-child');
        expect($('#first-child').is(node)).toBe(true);
        expect($('#second-child').is(node)).toBe(false);
    });

    it('should check for :selected pseudo-selector', () => {
        expect($('#option-2').is(':selected')).toBe(true);
        expect($('#option-1').is(':selected')).toBe(false);
    });

    it('should check for :checked pseudo-selector', () => {
        expect($('#checkbox-input').is(':checked')).toBe(true);
        expect($('#text-input').is(':checked')).toBe(false);
    });

    it('should check for :visible pseudo-selector', () => {
        expect($('#first-child').is(':visible')).toBe(true);
        expect($('#hidden-div').is(':visible')).toBe(false);
    });

    it('should check for :hidden pseudo-selector', () => {
        expect($('#hidden-div').is(':hidden')).toBe(true);
        expect($('#first-child').is(':hidden')).toBe(false);
        expect($('#hidden-input').is(':hidden')).toBe(true);
    });

    it('should return false for empty collections', () => {
        expect($('#non-existent').is('.anything')).toBe(false);
    });
});

describe('same()', () => {
    it('should check if two Dom objects contain same elements', () => {
        expect($('.child').same($('.child'))).toBe(true);
        expect($('.child').same($('#first-child, #second-child, #third-child'))).toBe(true);
        expect($('.child').same($('#first-child, #second-child'))).toBe(false);
    });

    it('should convert DOM elements to Dom objects', () => {
        const elements = document.getElementsByClassName('child');
        expect($('.child').same(elements)).toBe(true);
    });

    it('should return false when collections have different lengths', () => {
        expect($('.child').same($('.paragraph'))).toBe(false);
    });
});

describe('last() and first()', () => {
    it('should return the last element in the collection', () => {
        const last = $('.child').last();
        expect(last.length).toBe(1);
        expect(last[0]).toBe(document.getElementById('third-child'));
        expect(last._prevObj).toBeObject($('.child'));
    });

    it('should return the first element in the collection', () => {
        const first = $('.child').first();
        expect(first.length).toBe(1);
        expect(first[0]).toBe(document.getElementById('first-child'));
        expect(first._prevObj).toBeObject($('.child'));
    });
});

describe('odd() and even()', () => {
    it('should filter odd-indexed elements (zero-based)', () => {
        const odd = $('.child, .paragraph').odd();
        expect(odd.length).toBe(3);
        expect(odd[0].id).toBe('first-child');
        expect(odd[1].id).toBe('p1');        
        expect(odd[2].id).toBe('third-child');
        expect(odd._prevObj).toBeObject($('.child, .paragraph'));
    });

    it('should filter even-indexed elements (zero-based)', () => {
        const even = $('.child, .paragraph').even();
        expect(even.length).toBe(2);
        expect(even[0].id).toBe('second-child');
        expect(even[1].className).toBe('paragraph');
        expect(even._prevObj).toBeObject($('.child, .paragraph'));
    });
});

describe('filter()', () => {
    it('should filter elements by selector', () => {
        const filtered = $('.child').filter('#second-child');
        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe('second-child');
        expect(filtered._prevObj).toBeObject($('.child'));
    });

    it('should filter elements by function', () => {
        const filtered = $('.child').filter((el, i) => i > 0);
        expect(filtered.length).toBe(2);
        expect(filtered[0].id).toBe('second-child');
        expect(filtered[1].id).toBe('third-child');
    });
});

describe('find()', () => {
    it('should find elements matching selector within collection', () => {
        const paragraphs = $('#parent').find('.paragraph');
        expect(paragraphs.length).toBe(2);
        expect(paragraphs._prevObj).toBeObject($('#parent'));
    });

    it('should return empty collection when no matches found', () => {
        const empty = $('#sibling').find('.child');
        expect(empty.length).toBe(0);
        expect(empty._prevObj).toBeObject($('#sibling'));
    });

    it('should return empty collection for empty input collection', () => {
        const empty = $('#non-existent').find('.anything');
        expect(empty.length).toBe(0);
    });

    it('should return passed Dom object', () => {
        const jq = $('<div>');
        expect($('#parent').find(jq)).toBe(jq);
    });
});

describe('contains()', () => {
    it('should check if element contains matching descendants', () => {
        expect($('#parent').contains('.paragraph')).toBe(true);
        expect($('#sibling').contains('.paragraph')).toBe(false);
    });
});

describe('children()', () => {
    it('should return immediate children', () => {
        const children = $('#parent').children();
        expect(children.length).toBe(3);
        expect(children._prevObj).toBeObject($('#parent'));
    });

    it('should filter children by selector', () => {
        const filtered = $('#parent').children('#second-child');
        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe('second-child');
    });

    it('should return passed Dom object', () => {
        const jq = $('<div>');
        expect($('#parent').children(jq)).toBe(jq);
    });
});

describe('parent()', () => {
    it('should return parent element', () => {
        const parent = $('#first-child').parent();
        expect(parent.length).toBe(1);
        expect(parent[0].id).toBe('parent');
        expect(parent._prevObj).toBeObject($('#first-child'));
    });

    it('should filter parent by selector', () => {
        const filtered = $('#first-child').parent('#parent');
        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe('parent');
    });

    it('should return unique parents', () => {
        const parents = $('.child').parent();
        expect(parents.length).toBe(1);
    });

    it('should return undefined for elements without parent', () => {
        const detached = $('<div>');
        expect(detached.parent()).toBeUndefined();
    });

    it('should return passed Dom object', () => {
        const jq = $('<div>');
        expect($('#first-child').parent(jq)).toBe(jq);
    });
});

describe('parents()', () => {
    it('should return all ancestor elements', () => {
        const parents = $('#first-child').parents();
        expect(parents.length).toBeGreaterThanOrEqual(3); // parent, body, html at minimum
        expect(parents[0].id).toBe('parent');
        expect(parents._prevObj).toBeObject($('#first-child'));
    });

    it('should filter ancestors by selector', () => {
        const filtered = $('#first-child').parents('#parent');
        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe('parent');
    });

    it('should return unique ancestors', () => {
        const parents = $('.paragraph').parents('#second-child');
        expect(parents.length).toBe(1);
    });

    it('should return undefined for empty collection', () => {
        expect($('#non-existent').parents()).toBeUndefined();
    });

    it('should return passed Dom object', () => {
        const jq = $('<div>');
        expect($('#first-child').parents(jq)).toBe(jq);
    });
});

describe('siblings()', () => {
    it('should return all sibling elements', () => {
        const siblings = $('#second-child').siblings();
        expect(siblings.length).toBe(2);
        expect(siblings[0].id).toBe('first-child');
        expect(siblings[1].id).toBe('third-child');
        expect(siblings._prevObj).toBeObject($('#second-child'));
    });

    it('should filter siblings by selector', () => {
        const filtered = $('#second-child').siblings('#third-child');
        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe('third-child');
    });

    it('should return undefined for empty collection', () => {
        expect($('#non-existent').siblings()).toBeUndefined();
    });

    it('should return passed Dom object', () => {
        const jq = $('<div>');
        expect($('#first-child').siblings(jq)).toBe(jq);
    });
});

describe('prev() and next()', () => {
    it('should return previous sibling element', () => {
        const prev = $('#second-child').prev();
        expect(prev.length).toBe(1);
        expect(prev[0].id).toBe('first-child');
        expect(prev._prevObj).toBeObject($('#second-child'));
    });

    it('should return next sibling element', () => {
        const next = $('#second-child').next();
        expect(next.length).toBe(1);
        expect(next[0].id).toBe('third-child');
        expect(next._prevObj).toBeObject($('#second-child'));
    });

    it('should filter siblings by selector', () => {
        const filtered = $('#first-child').next('.child');
        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe('second-child');
    });

    it('should return empty collection when no siblings match', () => {
        const empty = $('#first-child').prev();
        expect(empty.length).toBe(0);
    });

    it('should return undefined for empty collection', () => {
        expect($('#non-existent').prev()).toBeUndefined();
        expect($('#non-existent').next()).toBeUndefined();
    });
});

describe('prevAll() and nextAll()', () => {
    it('should return all previous sibling elements', () => {
        const prevAll = $('#third-child').prevAll();
        expect(prevAll.length).toBe(2);
        expect(prevAll[0].id).toBe('second-child');
        expect(prevAll[1].id).toBe('first-child');
        expect(prevAll._prevObj).toBeObject($('#third-child'));
    });

    it('should return all next sibling elements', () => {
        const nextAll = $('#first-child').nextAll();
        expect(nextAll.length).toBe(2);
        expect(nextAll[0].id).toBe('second-child');
        expect(nextAll[1].id).toBe('third-child');
        expect(nextAll._prevObj).toBeObject($('#first-child'));
    });

    it('should filter siblings by selector', () => {
        const filtered = $('#first-child').nextAll('#third-child');
        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe('third-child');
    });

    it('should return undefined for empty collection', () => {
        expect($('#non-existent').prevAll()).toBeUndefined();
        expect($('#non-existent').nextAll()).toBeUndefined();
    });
});

describe('closest()', () => {
    it('should find closest ancestor matching selector', () => {
        const closest = $('.paragraph').closest('#second-child');
        console.log($('.paragraph').length);
        expect(closest.length).toBe(1);
        expect(closest[0].id).toBe('second-child');
        expect(closest._prevObj).toBeObject($('.paragraph'));
    });

    it('should include the element itself if it matches', () => {
        const closest = $('#second-child').closest('#second-child');
        expect(closest.length).toBe(1);
        expect(closest[0].id).toBe('second-child');
    });

    it('should return parent when no selector provided', () => {
        const parent = $('#first-child').closest();
        expect(parent.length).toBe(1);
        expect(parent[0].id).toBe('parent');
    });

    it('should return empty collection when no match found', () => {
        const empty = $('#parent').closest('#non-existent');
        expect(empty.length).toBe(0);
    });

    it('should return undefined for empty collection', () => {
        expect($('#non-existent').closest('#anything')).toBeUndefined();
    });
});

describe('has()', () => {
    it('should filter elements containing descendants matching selector', () => {
        const filtered = $('.child').has('.paragraph');
        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe('second-child');
        expect(filtered._prevObj).toBeObject($('.child'));
    });

    it('should return empty collection when no matches found', () => {
        const empty = $('#sibling').has('.paragraph');
        expect(empty.length).toBe(0);
    });

    it('should return undefined for empty collection', () => {
        expect($('#non-existent').has('#anything')).toBeUndefined();
    });
});

describe('back()', () => {
    it('should return to previous object in chain', () => {
        const original = $('.child');
        const filtered = original.filter('#second-child');
        expect(filtered.back()).toBe(original);
    });

    it('should return to start of chain when to_start is true', () => {
        const original = $('.child');
        const filtered = original.filter('#second-child').find('.paragraph');
        expect(filtered.back(true)).toBe(original);
    });

    it('should return itself when no previous object exists', () => {
        const obj = $('.child');
        expect(obj.back()).toBe(obj);
    });
});
