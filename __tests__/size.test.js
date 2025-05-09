import { describe, it, expect, beforeEach, afterEach } from '@olton/latte';
import { $ } from '../dist/dom.js';

beforeEach(() => {
    // Создаем тестовую DOM-структуру
    document.body.innerHTML = `
            <div id="test-element" style="width: 100px; height: 50px; padding: 5px; margin: 10px; border: 2px solid black;">
                Test Element
            </div>
            <div id="auto-size" style="display: inline-block;">
                Text content for auto sizing
            </div>
            <div id="empty-element" style="width: 0; height: 0;"></div>
        `;
});

afterEach(() => {
    // Очищаем DOM после каждого теста
    document.body.innerHTML = '';
});

describe('height()', () => {
    it('should get element height', () => {
        const height = $('#test-element').height();
        expect(height).toBe(50);
    });

    it('should set element height', () => {
        $('#test-element').height(70);
        expect($('#test-element')[0].style.height).toBe('70px');
    });

    it('should set element height with string value with units', () => {
        $('#test-element').height('80px');
        expect($('#test-element')[0].style.height).toBe('80px');

        $('#test-element').height('90%');
        expect($('#test-element')[0].style.height).toBe('90%');
    });

    it('should get window height', () => {
        // Мокируем window.innerHeight
        const originalInnerHeight = window.innerHeight;
        Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            value: 768
        });

        const height = $(window).height();
        expect(height).toBe(768);

        // Восстанавливаем original value
        Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            value: originalInnerHeight
        });
    });

    it('should get document height', () => {
        // Мокируем document.body.clientHeight
        const originalClientHeight = document.body.clientHeight;
        Object.defineProperty(document.body, 'clientHeight', {
            configurable: true,
            value: 1500
        });

        const height = $(document).height();
        expect(height).toBe(1500);

        // Восстанавливаем original value
        Object.defineProperty(document.body, 'clientHeight', {
            configurable: true,
            value: originalClientHeight
        });
    });

    it('should return undefined for empty collections', () => {
        const result = $('#non-existent').height();
        expect(result).toBeUndefined();
    });

    it('should support chaining when setting value', () => {
        const element = $('#test-element');
        const result = element.height(60);

        expect(result).toBe(element);
        expect($('#test-element')[0].style.height).toBe('60px');
    });
});

describe('width()', () => {
    it('should get element width', () => {
        const width = $('#test-element').width();
        expect(width).toBe(100);
    });

    it('should set element width', () => {
        $('#test-element').width(120);
        expect($('#test-element')[0].style.width).toBe('120px');
    });

    it('should set element width with string value with units', () => {
        $('#test-element').width('130px');
        expect($('#test-element')[0].style.width).toBe('130px');

        $('#test-element').width('40%');
        expect($('#test-element')[0].style.width).toBe('40%');
    });

    it('should get window width', () => {
        // Мокируем window.innerWidth
        const originalInnerWidth = window.innerWidth;
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            value: 1024
        });

        const width = $(window).width();
        expect(width).toBe(1024);

        // Восстанавливаем original value
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            value: originalInnerWidth
        });
    });

    it('should get document width', () => {
        // Мокируем document.body.clientWidth
        const originalClientWidth = document.body.clientWidth;
        Object.defineProperty(document.body, 'clientWidth', {
            configurable: true,
            value: 1200
        });

        const width = $(document).width();
        expect(width).toBe(1200);

        // Восстанавливаем original value
        Object.defineProperty(document.body, 'clientWidth', {
            configurable: true,
            value: originalClientWidth
        });
    });

    it('should return undefined for empty collections', () => {
        const result = $('#non-existent').width();
        expect(result).toBeUndefined();
    });
});

describe('outerHeight()', () => {
    it('should get element outer height without margin', () => {
        // Устанавливаем offsetHeight для тестового элемента
        Object.defineProperty($('#test-element')[0], 'offsetHeight', {
            configurable: true,
            value: 54 // Высота (50px) + borders (2px + 2px)
        });

        const outerHeight = $('#test-element').outerHeight();
        expect(outerHeight).toBe(54); // height + border
    });

    it('should get element outer height with margin', () => {
        // Устанавливаем offsetHeight для тестового элемента
        Object.defineProperty($('#test-element')[0], 'offsetHeight', {
            configurable: true,
            value: 54 // Высота (50px) + borders (2px + 2px)
        });

        const outerHeightWithMargin = $('#test-element').outerHeight(true);
        expect(outerHeightWithMargin).toBe(74); // height + border + margin (10px + 10px)
    });

    it('should set outer height considering padding and border', () => {
        $('#test-element').outerHeight(100);

        // Проверяем, что установленная высота учитывает padding и border
        expect(parseInt($('#test-element')[0].style.height)).toBeLessThan(100);
    });

    it('should return undefined for empty collections', () => {
        const result = $('#non-existent').outerHeight();
        expect(result).toBeUndefined();
    });
});

describe('outerWidth()', () => {
    it('should get element outer width without margin', () => {
        // Устанавливаем offsetWidth для тестового элемента
        Object.defineProperty($('#test-element')[0], 'offsetWidth', {
            configurable: true,
            value: 104 // Ширина (100px) + borders (2px + 2px)
        });

        const outerWidth = $('#test-element').outerWidth();
        expect(outerWidth).toBe(104); // width + border
    });

    it('should get element outer width with margin', () => {
        // Устанавливаем offsetWidth для тестового элемента
        Object.defineProperty($('#test-element')[0], 'offsetWidth', {
            configurable: true,
            value: 104 // Ширина (100px) + borders (2px + 2px)
        });

        const outerWidthWithMargin = $('#test-element').outerWidth(true);
        expect(outerWidthWithMargin).toBe(124); // width + border + margin (10px + 10px)
    });

    it('should set outer width considering padding and border', () => {
        $('#test-element').outerWidth(150);

        // Проверяем, что установленная ширина учитывает padding и border
        expect(parseInt($('#test-element')[0].style.width)).toBeLessThan(150);
    });

    it('should return undefined for empty collections', () => {
        const result = $('#non-existent').outerWidth();
        expect(result).toBeUndefined();
    });
});

describe('padding()', () => {
    it('should get element padding values', () => {
        // Устанавливаем разные значения для каждой стороны
        const testElement = $('#test-element')[0];
        testElement.style.padding = '10px 20px 30px 40px';

        const padding = $('#test-element').padding();

        expect(padding).toBeObject({
            top: 10,
            right: 20,
            bottom: 30,
            left: 40
        });
    });

    it('should return undefined for empty collections', () => {
        const result = $('#non-existent').padding();
        expect(result).toBeUndefined();
    });
});

describe('margin()', () => {
    it('should get element margin values', () => {
        // Устанавливаем разные значения для каждой стороны
        const testElement = $('#test-element')[0];
        testElement.style.margin = '5px 15px 25px 35px';

        const margin = $('#test-element').margin();

        expect(margin).toBeObject({
            top: 5,
            right: 15,
            bottom: 25,
            left: 35
        });
    });

    it('should return undefined for empty collections', () => {
        const result = $('#non-existent').margin();
        expect(result).toBeUndefined();
    });
});

describe('border()', () => {
    it('should get element border values', () => {
        // Устанавливаем разные значения для каждой стороны
        const testElement = $('#test-element')[0];
        testElement.style.borderWidth = '1px 3px 5px 7px';

        const border = $('#test-element').border();

        expect(border).toBeObject({
            top: 1,
            right: 3,
            bottom: 5,
            left: 7
        });
    });

    it('should return undefined for empty collections', () => {
        const result = $('#non-existent').border();
        expect(result).toBeUndefined();
    });
});
