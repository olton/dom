import { describe, it, expect, beforeEach, afterEach } from '@olton/latte';
import { $ } from '../dist/dom.js';

beforeEach(() => {
    // Создаем тестовую HTML структуру
    document.documentElement.lang = 'en';
    document.head.innerHTML = `
            <meta charset="UTF-8">
            <meta name="description" content="Test description">
            <meta property="og:title" content="Test OG Title">
            <title>Test Document Title</title>
        `;
});

afterEach(() => {
    document.head.innerHTML = '';
});

describe('$.meta()', () => {
    it('should find meta tag by name', () => {
        const meta = $.meta('description');
        expect(meta.attr('content')).toBe('Test description');
    });

    it('should return all meta tags when no name provided', () => {
        expect($.meta().length).toBe(3);
    });
});

describe('$.metaBy()', () => {
    it('should find meta tag by attribute', () => {
        const meta = $.metaBy('property');
        expect(meta.attr('content')).toBe('Test OG Title');
    });
});

describe('$.head(), $.body(), $.html()', () => {
    it('should return head element', () => {
        expect($.head()[0]).toBe(document.head);
    });

    it('should return body element', () => {
        expect($.body()[0]).toBe(document.body);
    });

    it('should return html element', () => {
        expect($.html()[0]).toBe(document.documentElement);
    });
});

describe('$.charset()', () => {
    it('should get document charset', () => {
        expect($.charset()).toBe('UTF-8');
    });

    it('should set document charset', () => {
        $.charset('ISO-8859-1');
        expect($('meta[charset]').attr('charset')).toBe('ISO-8859-1');
    });
});

describe('$.lang()', () => {
    it('should get document language', () => {
        expect($.lang()).toBe('en');
    });

    it('should set document language', () => {
        $.lang('fr');
        expect(document.documentElement.lang).toBe('fr');
    });
});

describe('$.title()', () => {
    it('should get document title', () => {
        expect($.title()).toBe('Test Document Title');
    });

    it('should set document title', () => {
        $.title('New Document Title');
        expect(document.title).toBe('New Document Title');
    });
});
