import { describe, it, expect, beforeEach, afterEach, mock } from '@olton/latte';
import { $ } from '../dist/dom.js';

// Сохраним оригинальные методы и свойства для восстановления
const originalScrollTo = window.scrollTo;
let originalScrollX, originalScrollY;

beforeEach(() => {
    // Создаем тестовую DOM-структуру
    document.body.innerHTML = `
            <div id="container" style="height: 2000px; width: 2000px;">
                <div id="test-element" style="position: absolute; top: 500px; left: 500px; height: 100px; width: 100px;">
                    Test Element
                </div>
                <div id="scroller" style="height: 200px; width: 200px; overflow: auto;">
                    <div style="height: 1000px; width: 1000px;">Scrollable Content</div>
                </div>
            </div>
        `;

    // Сохраняем оригинальные значения
    originalScrollX = window.scrollX;
    originalScrollY = window.scrollY;

    // Мокируем window.scrollTo
    window.scrollTo = mock();

    // Мокируем свойства scrollX и scrollY
    Object.defineProperty(window, 'scrollX', {
        value: 0,
        writable: true,
        configurable: true
    });

    Object.defineProperty(window, 'scrollY', {
        value: 0,
        writable: true,
        configurable: true
    });
});

afterEach(() => {
    // Очищаем DOM после каждого теста
    document.body.innerHTML = '';
});

describe('$.scrollTop', () => {
    it('should get current vertical scroll position', () => {
        window.scrollY = 100;
        expect($.scrollTop()).toBe(100);
    });

    it('should set vertical scroll position', () => {
        $.scrollTop(200);
        expect(window.scrollTo).toHaveBeenCalled();
        expect(window.scrollTo).toHaveBeenLastCalledWith([0,200]);
    });
});

describe('$.scrollLeft', () => {
    it('should get current horizontal scroll position', () => {
        window.scrollX = 150;
        expect($.scrollLeft()).toBe(150);
    });

    it('should set horizontal scroll position', () => {
        $.scrollLeft(250);
        expect(window.scrollTo).toHaveBeenCalled();
        expect(window.scrollTo).toHaveBeenLastCalledWith([250,0]);
    });
});

describe('$.scrollTo', () => {
    it('should scroll to specified coordinates', () => {
        $.scrollTo(300, 400);
        expect(window.scrollTo).toHaveBeenCalled();
        expect(window.scrollTo).toHaveBeenCalledWith([300, 400]);
    });
});

describe('$.scrollToElement', () => {
    it('should scroll to element by selector', () => {
        $.fn.scrollTo = mock($.fn.scrollTo);
        $.scrollToElement('#test-element');

        expect($.fn.scrollTo).toHaveBeenCalled();
    });

    it('should scroll to element by DOM reference', () => {
        $.fn.scrollTo = mock($.fn.scrollTo);
        const element = document.getElementById('test-element');
        $.scrollToElement(element);

        expect($.fn.scrollTo).toHaveBeenCalled();
    });
});

describe('$.fn.scrollTop', () => {
    let scrollerElement;

    beforeEach(() => {
        scrollerElement = document.getElementById('scroller');
        // Мокируем свойство scrollTop
        Object.defineProperty(scrollerElement, 'scrollTop', {
            get: function() { return this._scrollTop || 0; },
            set: function(val) { this._scrollTop = val; },
            configurable: true
        });
    });

    it('should get scrollTop for DOM element', () => {
        scrollerElement._scrollTop = 50;
        expect($('#scroller').scrollTop()).toBe(50);
    });

    it('should set scrollTop for DOM element', () => {
        $('#scroller').scrollTop(75);
        expect(scrollerElement._scrollTop).toBe(75);
    });

    it('should get window scrollY when element is window', () => {
        window.scrollY = 100;
        expect($(window).scrollTop()).toBe(100);
    });

    it('should set window scrollY when element is window', () => {
        window.scrollTo = mock(window.scrollTo);
        $(window).scrollTop(150);
        expect(window.scrollTo).toHaveBeenCalled();
        expect(window.scrollTo).toHaveBeenCalledWith([0,150]);
    });

    it('should return undefined for empty collections', () => {
        expect($('#non-existent').scrollTop()).toBeUndefined();
    });

    it('should support chaining when setting value', () => {
        const element = $('#scroller');
        const result = element.scrollTop(80);

        expect(result).toBe(element);
        expect(scrollerElement._scrollTop).toBe(80);
    });

    it('should set scrollTop for multiple elements', () => {
        // Создаем второй скроллер
        const secondScroller = document.createElement('p');
        secondScroller.id = 'second-scroller';
        document.body.appendChild(secondScroller);

        // Мокируем свойство scrollTop
        Object.defineProperty(secondScroller, 'scrollTop', {
            get: function() { return this._scrollTop || 0; },
            set: function(val) { this._scrollTop = val; },
            configurable: true
        });

        // Устанавливаем scrollTop для обоих элементов
        $('#scroller, #second-scroller').scrollTop(90);

        expect(scrollerElement._scrollTop).toBe(90);
        expect(secondScroller._scrollTop).toBe(90);
    });
});

describe('$.fn.scrollLeft', () => {
    let scrollerElement;

    beforeEach(() => {
        scrollerElement = document.getElementById('scroller');
        // Мокируем свойство scrollLeft
        Object.defineProperty(scrollerElement, 'scrollLeft', {
            get: function() { return this._scrollLeft || 0; },
            set: function(val) { this._scrollLeft = val; },
            configurable: true
        });
    });

    it('should get scrollLeft for DOM element', () => {
        scrollerElement._scrollLeft = 60;
        expect($('#scroller').scrollLeft()).toBe(60);
    });

    it('should set scrollLeft for DOM element', () => {
        $('#scroller').scrollLeft(85);
        expect(scrollerElement._scrollLeft).toBe(85);
    });

    it('should get window scrollX when element is window', () => {
        window.scrollX = 110;
        expect($(window).scrollLeft()).toBe(110);
    });

    it('should set window scrollX when element is window', () => {
        window.scrollTo = mock(window.scrollTo);
        $(window).scrollLeft(160);
        expect(window.scrollTo).toHaveBeenCalled();
        expect(window.scrollTo).toHaveBeenCalledWith([160,0]);
    });

    it('should return undefined for empty collections', () => {
        expect($('#non-existent').scrollLeft()).toBeUndefined();
    });

    it('should support chaining when setting value', () => {
        const element = $('#scroller');
        const result = element.scrollLeft(95);

        expect(result).toBe(element);
        expect(scrollerElement._scrollLeft).toBe(95);
    });
});

describe('$.fn.scrollTo', () => {
    beforeEach(() => {
        // Мокируем getBoundingClientRect
        const testElement = document.getElementById('test-element');
        testElement.getBoundingClientRect = mock(() => ({
            top: 500,
            left: 500,
            width: 100,
            height: 100,
            right: 600,
            bottom: 600
        }));
    });

    it('should scroll to element position relative to document', () => {
        window.scrollTo = mock(window.scrollTo);
        
        $('#test-element').scrollTo();

        expect(window.scrollTo).toHaveBeenCalled();
        expect(window.scrollTo).toHaveBeenCalledWith([500, 500]);
    });

    it('should scroll to element position relative to viewport', () => {
        window.scrollTo = mock(window.scrollTo);
        
        // Устанавливаем текущую прокрутку
        window.scrollX = 200;
        window.scrollY = 300;

        $('#test-element').scrollTo(true);

        expect(window.scrollTo).toHaveBeenCalled();
        expect(window.scrollTo).toHaveBeenCalledWith([500, 500]);
    });

    it('should return itself for chaining', () => {
        const element = $('#test-element');
        const result = element.scrollTo();

        expect(result).toBeObject(element);
    });

    it('should return early for empty collections', () => {
        window.scrollTo = mock(window.scrollTo);
        const empty = $('#non-existent');
        const result = empty.scrollTo();

        expect(result.length).toBe(0);
        expect(window.scrollTo).not.toHaveBeenCalled();
    });
});
