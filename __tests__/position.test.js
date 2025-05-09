import { describe, it, expect, beforeEach, afterEach } from '@olton/latte';
import { $ } from '../dist/dom.js';

let testElement;
let container;

beforeEach(() => {
    // Создаем тестовую DOM-структуру
    document.body.style.height = "2000px"
    document.body.innerHTML = `
            <div id="container" style="position: relative; width: 500px; height: 500px; margin: 50px; padding: 20px;">
                <div id="test-element" style="position: absolute; width: 100px; height: 100px; top: 100px; left: 100px; margin: 10px;">
                    Test Element
                </div>
            </div>
        `;

    testElement = $('#test-element');
    container = $('#container');
    
    container[0].getBoundingClientRect = () => ({
        top:  50,  
        left: 50,
        width: 500,
        height: 500,
        right: 550,
        bottom: 550
    })
    testElement[0].getBoundingClientRect = () => ({
        top:  160,  
        left: 160,
        width: 100,
        height: 100,
        right: 260,
        bottom: 260
    })
});

afterEach(() => {
    // Очищаем DOM после каждого теста
    document.body.innerHTML = '';
});

describe('offset()', () => {
    it('should return correct offset relative to document', () => {        
        const offset = testElement.offset();

        // Проверяем примерные значения с допусками для разных окружений
        expect(offset.top).toBeGreaterThanOrEqual(160); // 50 + 10 + 100
        expect(offset.left).toBeGreaterThanOrEqual(160); // 50 + 10 + 100
    });

    it('should handle scroll position', () => {
        // Имитация прокрутки
        $(window).scrollTop(200);
        $(window).scrollLeft(100);

        const offset = testElement.offset();

        // Проверяем, что offset учитывает прокрутку
        expect(offset.top).toBeGreaterThanOrEqual(360); // 50 + 10 + 100 + 200
        expect(offset.left).toBeGreaterThanOrEqual(260); // 50 + 10 + 100 + 100
    });

    it('should return undefined for empty collections', () => {
        const emptyCollection = $();
        expect(emptyCollection.offset()).toBeUndefined();
    });

    it('should set offset for single element', () => {
        testElement.offset({ top: 200, left: 200 });

        const newPos = testElement.position();

        expect(newPos.top).toBe(200);
        expect(newPos.left).toBe(200);
    });

    it('should set offset for multiple elements', () => {
        // Добавляем второй элемент
        container.append('<div id="second-element" style="position: absolute; width: 100px; height: 100px; top: 50px; left: 50px;">Second</div>');
        const elements = $('#test-element, #second-element');

        elements.offset({ top: 200, left: 200 });

        const firstPos = $('#test-element').position();
        const secondPos = $('#second-element').position();

        expect(firstPos.top).toBe(200);
        expect(firstPos.left).toBe(200);
        expect(secondPos.top).toBe(200);
        expect(secondPos.left).toBe(200);
    });

    it('should adjust offset based on element position', () => {
        // Элемент с относительным позиционированием
        container.append('<div id="relative-element" style="position: relative; top: 50px; left: 50px;">Relative</div>');
        const relElement = $('#relative-element');

        // Запоминаем текущую позицию
        const originalOffset = relElement.offset();

        // Устанавливаем новый offset
        relElement.offset({ top: originalOffset.top + 100, left: originalOffset.left + 100 });

        // Проверяем, что CSS свойства изменились правильно
        expect(parseInt(relElement.css('top'), 10)).toBeGreaterThan(50);
        expect(parseInt(relElement.css('left'), 10)).toBeGreaterThan(50);
    });
});

describe('position()', () => {
    it('should return position relative to offset parent', () => {
        const position = testElement.position();

        expect(position).toEqual({
            top: expect.any(Number),
            left: expect.any(Number)
        });

        expect(position.top).toBe(100);
        expect(position.left).toBe(100);
    });

    it('should consider margin when flag is true', () => {
        const positionWithMargin = testElement.position(true);

        expect(positionWithMargin).toEqual({
            top: expect.any(Number),
            left: expect.any(Number)
        });

        expect(positionWithMargin.top).toBe(90); // 100 - 10 (margin)
        expect(positionWithMargin.left).toBe(90); // 100 - 10 (margin)
    });

    it('should return undefined for empty collections', () => {
        const emptyCollection = $();
        expect(emptyCollection.position()).toBeUndefined();
    });
});

describe('left() and top()', () => {
    it('should return left position without margin by default', () => {
        expect(testElement.left()).toBe(100);
    });

    it('should return top position without margin by default', () => {
        expect(testElement.top()).toBe(100);
    });

    it('should return left position with margin when specified', () => {
        expect(testElement.left(true)).toBe(90); // 100 - 10 (margin)
    });

    it('should return top position with margin when specified', () => {
        expect(testElement.top(true)).toBe(90); // 100 - 10 (margin)
    });

    it('should set left position', () => {
        testElement.left(200);
        expect(testElement[0].style.left).toBe('200px');
    });

    it('should set top position', () => {
        testElement.top(200);
        expect(testElement[0].style.top).toBe('200px');
    });

    it('should return undefined for empty collections', () => {
        const emptyCollection = $();
        expect(emptyCollection.left()).toBeUndefined();
        expect(emptyCollection.top()).toBeUndefined();
    });

    it('should support chaining when setting values', () => {
        const result = testElement.left(200).top(200);
        expect(result).toBe(testElement);
    });
});

describe('rect()', () => {
    it('should return DOMRect object', () => {
        const rect = testElement.rect();

        expect(rect).toBeInstanceOf(DOMRect);
        expect(rect).toHaveProperty('top');
        expect(rect).toHaveProperty('left');
        expect(rect).toHaveProperty('width');
        expect(rect).toHaveProperty('height');
        expect(rect).toHaveProperty('bottom');
        expect(rect).toHaveProperty('right');

        // Проверяем значения
        expect(rect.width).toBe(100);
        expect(rect.height).toBe(100);
    });

    it('should return undefined for empty collections', () => {
        const emptyCollection = $();
        expect(emptyCollection.rect()).toBeUndefined();
    });
});

describe('pos()', () => {
    it('should return position from style properties', () => {
        // Предварительно устанавливаем стиль
        testElement.css({
            top: '150px',
            left: '150px'
        });

        const pos = testElement.pos();

        expect(pos).toEqual({
            top: expect.any(Number),
            left: expect.any(Number)
        });

        expect(pos.top).toBe(150);
        expect(pos.left).toBe(150);
    });

    it('should return undefined for empty collections', () => {
        const emptyCollection = $();
        expect(emptyCollection.pos()).toBeUndefined();
    });
});
