import { describe, it, expect, beforeEach, mock } from '@olton/latte';
import { $ } from '../dist/dom.js';

describe('$.each', () => {
    it('should iterate over arrays', () => {
        const array = [1, 2, 3];
        const callback = mock();

        $.each(array, callback);

        expect(callback).toHaveBeenCalledTimes(3);
        expect(callback).toHaveBeenCalledWith([0, 1]);
        expect(callback).toHaveBeenCalledWith([1, 2]);
        expect(callback).toHaveBeenCalledWith([2, 3]);
    });

    it('should iterate over array-like objects', () => {
        const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
        const callback = mock();

        $.each(arrayLike, callback);

        expect(callback).toHaveBeenCalledTimes(3);
        expect(callback).toHaveBeenCalledWith([0, 'a']);
        expect(callback).toHaveBeenCalledWith([1, 'b']);
        expect(callback).toHaveBeenCalledWith([2, 'c']);
    });

    it('should iterate over objects', () => {
        const obj = { a: 1, b: 2, c: 3 };
        const callback = mock();

        $.each(obj, callback);

        expect(callback).toHaveBeenCalledTimes(3);
        // The args are [key, value, index]
        expect(callback).toHaveBeenCalledWith(['a', 1, 0]);
        expect(callback).toHaveBeenCalledWith(['b', 2, 1]);
        expect(callback).toHaveBeenCalledWith(['c', 3, 2]);
    });

    it('should set "this" to the current value in the callback', () => {
        const array = ['a', 'b', 'c'];
        const thisValues = [];

        $.each(array, function() {
            thisValues.push(this);
        });

        expect(thisValues[0]).toBe('a');
        expect(thisValues[1]).toBe('b');
        expect(thisValues[2]).toBe('c');
    });

    it('should skip prototype properties of objects', () => {
        // Create an object with prototype
        const proto = { protoKey: 'protoValue' };
        const obj = Object.create(proto);
        obj.ownKey = 'ownValue';

        const callback = mock();

        $.each(obj, callback);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(["ownKey","ownValue",0]);
    });

    it('should return the passed context', () => {
        const array = [1, 2, 3];
        const result = $.each(array, () => {});

        expect(result).toBe(array);
    });

    it('should handle empty arrays', () => {
        const callback = mock();
        $.each([], callback);
        expect(callback).not.toHaveBeenCalled();
    });

    it('should handle empty objects', () => {
        const callback = mock();
        $.each({}, callback);
        expect(callback).not.toHaveBeenCalled();
    });
});

describe('$.fn.each', () => {
    let elements;

    beforeEach(() => {
        document.body.innerHTML = `
                <div class="item" id="item1">Item 1</div>
                <div class="item" id="item2">Item 2</div>
                <div class="item" id="item3">Item 3</div>
            `;

        elements = $('.item');
    });

    it('should iterate over DOM elements in collection', () => {
        const callback = mock();

        elements.each(callback);

        expect(callback).toHaveBeenCalledTimes(3);
    });

    it('should set "this" to the current DOM element in callback', () => {
        const ids = [];

        elements.each(function() {
            ids.push(this.id);
        });

        expect(ids).toBeArrayEqual(['item1', 'item2', 'item3']);
    });

    it('should return the jQuery object for chaining', () => {
        const result = elements.each(() => {});

        expect(result).toBe(elements);
    });

    it('should handle empty collections', () => {
        const emptyCollection = $('.non-existent');
        const callback = mock();

        const result = emptyCollection.each(callback);

        expect(callback).not.toHaveBeenCalled();
        expect(result).toBe(emptyCollection);
    });

    it('should pass correct arguments and context to the callback', () => {
        elements.each(function(index, element) {
            expect(index).toBe(parseInt(this.id.replace('item', '')) - 1);
            expect(element).toBe(this);
            expect(element.id).toBe(`item${index + 1}`);
        });
    });
});

describe('Edge cases', () => {
    it('should handle null and undefined', () => {
        const callback = mock();

        $.each(null, callback);
        $.each(undefined, callback);

        expect(callback).not.toHaveBeenCalled();
    });

    it('should handle primitives correctly', () => {
        const callback = mock();

        $.each(123, callback);
        $.each("string", callback);
        $.each(true, callback);

        // Primitives don't have enumerable properties
        expect(callback).not.toHaveBeenCalled();
    });

    it('should handle sparse arrays correctly', () => {
        const sparseArray = [];
        sparseArray[0] = 'a';
        sparseArray[2] = 'c';
        // sparseArray[1] is empty

        const values = [];
        $.each(sparseArray, function(index, value) {
            values.push(value);
        });

        // [].forEach skips empty slots
        expect(values).toBeArrayEqual(['a', 'c']);
    });
});
