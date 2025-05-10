import { describe, it, expect, beforeEach, afterEach, mock, waitFor as wait } from '@olton/latte';
import { $ } from '../dist/dom.js';

let testElement;
let eventCount;

beforeEach(() => {
    // Создаем тестовую DOM-структуру
    document.body.innerHTML = `
            <div id="test-parent">
                <div id="test-element" class="test-class">
                    <span id="test-child">Test Child</span>
                </div>
                <div id="test-sibling">Test Sibling</div>
            </div>
        `;

    testElement = $('#test-element');
    eventCount = $.events.length;
});

afterEach(() => {
    // Очищаем DOM и удаляем обработчики событий
    document.body.innerHTML = '';
});

describe('Event Registration', () => {
    it('should register a basic event handler', () => {
        const handler = mock();

        testElement.on('click', handler);

        // Проверяем, что событие было зарегистрировано
        expect($.events.length).toBe(eventCount + 1);
        expect($.events[eventCount].element).toBe(testElement[0]);
        expect($.events[eventCount].event).toBe('click');
        expect($.events[eventCount].handler).toBeInstanceOf(Function);

        // Вызываем событие и проверяем, что обработчик сработал
        testElement.trigger('click');
        expect(handler).toHaveBeenCalled()
    });

    it('should register multiple events at once', () => {
        const handler = mock();

        testElement.on('mousedown mouseup', handler);

        // Проверяем, что было зарегистрировано два события
        expect($.events.length).toBe(eventCount + 2);

        // Вызываем события и проверяем обработчики
        testElement.trigger('mousedown');
        expect(handler).toHaveBeenCalledTimes(1);

        testElement.trigger('mouseup');
        expect(handler).toHaveBeenCalledTimes(2);
    });

    it('should register event with namespace', () => {
        const handler = mock();

        testElement.on('click.namespace', handler);

        // Проверяем, что namespace был зарегистрирован
        expect($.events[eventCount].ns).toBe('namespace');

        // Вызываем событие и проверяем, что обработчик сработал
        testElement.trigger('click');
        expect(handler).toHaveBeenCalled()
    });

    it('should register delegated event', () => {
        const handler = mock(function() {
            expect(this.id).toBe('test-child');
        });

        $('#test-parent').on('click', '#test-child', handler);

        // Проверяем, что делегированное событие было зарегистрировано
        expect($.events[eventCount].selector).toBe('#test-child');

        // Вызываем событие на дочернем элементе
        $('#test-child').trigger('click');
        expect(handler).toHaveBeenCalled()
    });

    it('should accept options parameter', () => {
        const handler = mock();
        const options = { capture: true, passive: true };

        testElement.on('click', handler, options);

        expect($.events[eventCount].options).toBeObject(options);
    });
});

describe('Event Removal', () => {
    it('should remove a specific event handler', () => {
        const handler = mock();

        testElement.on('click', handler);
        testElement.off('click');

        const originalHandler = $.events[eventCount].handler;
        expect(originalHandler).toBe(null);

        // Вызываем событие и проверяем, что обработчик не срабатывает
        testElement.trigger('click');
        expect(handler).not.toHaveBeenCalled()
    });


    it('should remove delegated event handler', () => {
        const handler = mock();

        $('#test-parent').on('click', '#test-child', handler);
        $('#test-parent').off('click', '#test-child');

        // Вызываем событие и проверяем, что обработчик не срабатывает
        $('#test-child').trigger('click');
        expect(handler).not.toHaveBeenCalled()
    });

    it('should remove all event handlers with "all" parameter', () => {
        const handler1 = mock();
        const handler2 = mock();

        testElement.on('click', handler1);
        testElement.on('mousedown', handler2);

        testElement.off('all');

        // Вызываем события и проверяем, что обработчики не срабатывают
        testElement.trigger('click');
        testElement.trigger('mousedown');

        expect(handler1).not.toHaveBeenCalled()
        expect(handler2).not.toHaveBeenCalled()
    });
});

describe('Event Triggering', () => {
    it('should trigger event', () => {
        const handler = mock();

        testElement.on('click', handler);
        testElement.trigger('click');

        expect(handler).toHaveBeenCalled()
    });

    it('should pass data to event handler', () => {
        const handler = mock(function(e) {
            expect(e.detail).toBeObject({foo: 'bar'});
        });

        testElement.on('custom', handler);
        testElement.trigger('custom', {foo: 'bar'});

        expect(handler).toHaveBeenCalled()
    });

    it('should alias fire() to trigger()', () => {
        const handler = mock();

        testElement.on('click', handler);
        testElement.fire('click');

        expect(handler).toHaveBeenCalled()
    });
});

describe('Event Propagation', () => {
    it('should support event bubbling', () => {
        const childHandler = mock();
        const parentHandler = mock();

        $('#test-child').on('click', childHandler);
        $('#test-parent').on('click', parentHandler);

        $('#test-child').trigger('click');

        expect(childHandler).toHaveBeenCalled()
        expect(parentHandler).toHaveBeenCalled()
    });

    it('should stop propagation with stopPropagation()', () => {
        const childHandler = mock(function(e) {
            e.stopPropagation();
        });
        const parentHandler = mock();

        $('#test-child').on('click', childHandler);
        $('#test-parent').on('click', parentHandler);

        $('#test-child').trigger('click');

        expect(childHandler).toHaveBeenCalled()
        expect(parentHandler).not.toHaveBeenCalled()
    });

    it('should stop propagation with Event.prototype.stop()', () => {
        const handler = mock(function(e) {
            e.stop();
        });
        const parentHandler = mock();

        $('#test-child').on('click', handler);
        $('#test-parent').on('click', parentHandler);

        $('#test-child').trigger('click');

        expect(handler).toHaveBeenCalled()
        expect(parentHandler).not.toHaveBeenCalled()
    });
});

describe('Event Hooks', () => {
    it('should execute beforeHook before event handler', () => {
        const beforeSpy = mock();
        const handler = mock();

        $.addEventHook('click', beforeSpy, 'before');

        testElement.on('click', handler);
        testElement.trigger('click');

        expect(beforeSpy).toHaveBeenCalled()
        expect(handler).toHaveBeenCalled()
        expect(beforeSpy.mock.time).toBeLessThan(handler.mock.time);

        // Очищаем хук
        $.removeEventHook('click', 'before');
    });

    it('should execute afterHook after event handler', () => {
        const handler = mock();
        const afterSpy = mock();

        $.addEventHook('click', afterSpy, 'after');

        testElement.on('click', handler);
        testElement.trigger('click');

        expect(handler).toHaveBeenCalled()
        expect(afterSpy).toHaveBeenCalled()
        expect(handler.mock.time).toBeLessThan(afterSpy.mock.time);

        // Очищаем хук
        $.removeEventHook('click', 'after');
    });

    it('should remove event hooks', () => {
        const beforeSpy = mock();
        const afterSpy = mock();

        $.addEventHook('click', beforeSpy, 'before');
        $.addEventHook('click', afterSpy, 'after');

        $.removeEventHooks('click');

        testElement.on('click', () => {});
        testElement.trigger('click');

        expect(beforeSpy).not.toHaveBeenCalled()
        expect(afterSpy).not.toHaveBeenCalled()
    });

    it('should remove all event hooks', () => {
        const beforeSpy = mock();
        const afterSpy = mock();

        $.addEventHook('click', beforeSpy, 'before');
        $.addEventHook('mousedown', afterSpy, 'after');

        $.removeEventHooks();

        expect(Object.keys($.getEventHooks()).length).toBe(0);
    });
});

describe('Event Shortcuts', () => {
    it('should provide shortcut methods for standard events', () => {
        const handler = mock(() => {
            // console.log("Elements clicked");
        });

        testElement[0].onclick = handler;
        testElement.trigger('click');

        expect(handler).toHaveBeenCalled()
    });

    it('should trigger event when called with no arguments', () => {
        const handler = mock();

        testElement.on('click', handler);
        testElement.click();

        expect(handler).toHaveBeenCalled()
    });

    it('should support hover helper', () => {
        const overHandler = mock();
        const outHandler = mock();

        testElement.hover(overHandler, outHandler);

        testElement.trigger('mouseenter');
        expect(overHandler).toHaveBeenCalled()

        testElement.trigger('mouseleave');
        expect(outHandler).toHaveBeenCalled()
    });

    it('should support hover helper with single handler', () => {
        const handler = mock();

        testElement.hover(handler);

        testElement.trigger('mouseenter');
        expect(handler).toHaveBeenCalledTimes(1)

        testElement.trigger('mouseleave');
        expect(handler).toHaveBeenCalledTimes(2)
    });
});

describe('One-time Events', () => {
    it('should execute one-time event handler only once', () => {
        const handler = mock();

        testElement.one('click', handler);

        testElement.click();
        expect(handler).toHaveBeenCalledTimes(1)

        testElement.click();
        expect(handler).toHaveBeenCalledTimes(1)
    });

    it('should support delegated one-time events', () => {
        const handler = mock();

        $('#test-parent').one('click', '#test-child', handler);

        $('#test-child').trigger('click');
        expect(handler).toHaveBeenCalledTimes(1)

        $('#test-child').trigger('click');
        expect(handler).toHaveBeenCalledTimes(1)
    });
});

describe('Document and Window Events', () => {
    it('should handle ready event', () => {
        const handler = mock();

        // Имитируем, что DOMContentLoaded еще не произошел
        Object.defineProperty(document, 'readyState', {
            configurable: true,
            get: function() { return 'loading'; }
        });

        $(document).ready(handler);

        // Теперь имитируем событие DOMContentLoaded
        Object.defineProperty(document, 'readyState', {
            configurable: true,
            get: function() { return 'interactive'; }
        });

        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);

        expect(handler).toHaveBeenCalled()
    });
});
