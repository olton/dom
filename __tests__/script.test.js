import { describe, it, expect, beforeEach, afterEach, mock } from '@olton/latte';
import { $ } from '../dist/dom.js';

beforeEach(() => {
    // Создаем тестовую DOM-структуру
    document.body.innerHTML = `
            <div id="container">
                <div id="test-element">Test Element</div>
            </div>
        `;

    // Добавляем глобальную переменную для проверки выполнения скриптов
    window.scriptExecuted = false;
    window.scriptParams = null;
});

afterEach(() => {
    // Очищаем DOM после каждого теста
    document.body.innerHTML = '';
});

describe('$.script', () => {
    it('should execute inline script', () => {
        const script = $('<script>window.scriptExecuted = true;</script>');
        $.script(script);

        expect(window.scriptExecuted).toBe(true);
        // Скрипт должен быть удален из оригинального местоположения
        expect($('script').length).toBe(0);
    });

    it('should execute script with parameters', () => {
        const script = $('<script>window.scriptParams = { value: "test" };</script>');
        $.script(script);

        expect(window.scriptParams).toEqual({ value: "test" });
    });

    it('should handle script with type attribute', () => {
        const script = $('<script type="text/babel">window.scriptExecuted = true;</script>');
        $.script(script);

        expect(window.scriptExecuted).toBe(true);
        const executedScript = document.querySelector('script');
        expect(executedScript.type).toBe('text/babel');
    });

    it('should handle script with async attribute', () => {
        const script = $('<script async>window.scriptExecuted = true;</script>');
        $.script(script);

        expect(window.scriptExecuted).toBe(true);
        const executedScript = document.querySelector('script');
        expect(executedScript.async).toBe(true);
    });

    it('should execute scripts inside a container', () => {
        const container = $('<div><script>window.scriptExecuted = true;</script></div>');
        $.script(container);

        expect(window.scriptExecuted).toBe(true);
        // Скрипт должен быть удален из оригинального местоположения
        expect(container.find('script').length).toBe(0);
    });

    it('should insert scripts into specified container', () => {
        const targetContainer = $('<div id="target-container"></div>');
        document.body.appendChild(targetContainer[0]);

        const script = $('<script>window.scriptExecuted = true;</script>');
        $.script(script, targetContainer[0]);

        expect(window.scriptExecuted).toBe(true);
        expect(targetContainer.find('script').length).toBe(1);
    });

    it('should handle jQuery objects as input', () => {
        const script = $('<script>window.scriptExecuted = true;</script>');
        $.script(script);

        expect(window.scriptExecuted).toBe(true);
    });

    it('should handle DOM elements as input', () => {
        const scriptEl = document.createElement('script');
        scriptEl.textContent = 'window.scriptExecuted = true;';

        $.script(scriptEl);

        expect(window.scriptExecuted).toBe(true);
    });

    it('should handle null or undefined gracefully', () => {
        expect(() => $.script(null)).not.toThrow();
        expect(() => $.script(undefined)).not.toThrow();
    });
});

describe('$.loadScript', () => {
    let originalCreateElement;
    let mockScript;

    beforeEach(() => {
        // Мокируем createElement для перехвата создания скрипта
        originalCreateElement = document.createElement;
        mockScript = {
            type: null,
            src: null,
            onload: null
        };

        document.createElement = function(tag) {
            if (tag.toLowerCase() === 'script') {
                return mockScript;
            }
            return originalCreateElement.call(document, tag);
        };

        // Мокируем appendChild для избежания реальной вставки в DOM
        document.body.appendChild = mock(function(script) {
            // Симулируем загрузку скрипта
            if (script === mockScript && script.onload) {
                setTimeout(script.onload, 10);
            }
        });
    });

    it('should load external script', () => {
        const testUrl = 'https://example.com/script.js';
        $.loadScript(testUrl);

        expect(mockScript.type).toBe('text/javascript');
        expect(mockScript.src).toBe(testUrl);
        expect(document.body.appendChild.called).toBe(true);
    });

    it('should execute callback when script is loaded', (done) => {
        const callback = mock(() => {
            expect(callback).toHaveBeenCalled();
            done();
        });

        $.loadScript('https://example.com/script.js', document.body, callback);
    });

    it('should insert script into specified container', () => {
        const container = $('<div id="container"></div>')[0];
        container.appendChild = mock();

        $.loadScript('https://example.com/script.js', container);

        expect(container.appendChild).toHaveBeenCalled();
    });
});

describe('$.fn.script', () => {
    it('should execute scripts inside selected elements', () => {
        const container = $('<div><script>window.scriptExecuted = true;</script></div>');
        document.body.appendChild(container[0]);

        container.script();

        expect(window.scriptExecuted).toBe(true);
        expect(container.find('script').length).toBe(0);
    });

    it('should insert scripts into specified container', () => {
        const targetContainer = $('<div id="target-container"></div>');
        document.body.appendChild(targetContainer[0]);

        const container = $('<div><script>window.scriptExecuted = true;</script></div>');
        document.body.appendChild(container[0]);

        container.script(targetContainer[0]);

        expect(window.scriptExecuted).toBe(true);
        expect(targetContainer.find('script').length).toBe(1);
    });

    it('should handle multiple elements', () => {
        const containers = $(
            '<div id="c1"><script>window.c1 = true;</script></div>' +
            '<div id="c2"><script>window.c2 = true;</script></div>'
        );
        document.body.appendChild(containers[0]);
        document.body.appendChild(containers[1]);

        window.c1 = false;
        window.c2 = false;

        containers.script();

        expect(window.c1).toBe(true);
        expect(window.c2).toBe(true);

        // Очистка
        delete window.c1;
        delete window.c2;
    });

    it('should support chaining', () => {
        const container = $('<div><script>window.scriptExecuted = true;</script></div>');
        document.body.appendChild(container[0]);

        const result = container.script();

        expect(result).toBe(container);
    });
});
