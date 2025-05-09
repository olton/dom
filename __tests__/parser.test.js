import { describe, it, expect } from '@olton/latte';
import { $ } from '../dist/dom.js';

describe('$.parseHTML', () => {
    it('should parse a single tag', () => {
        const result = $.parseHTML('<div></div>');

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0] instanceof HTMLElement).toBe(true);
        expect(result[0].tagName.toLowerCase()).toBe('div');
    });

    it('should parse a self-closing tag', () => {
        const result = $.parseHTML('<input />');

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0] instanceof HTMLElement).toBe(true);
        expect(result[0].tagName.toLowerCase()).toBe('input');
    });

    it('should parse complex HTML structures', () => {
        const result = $.parseHTML(`
                <div class="container">
                    <h1>Title</h1>
                    <p>Paragraph with <a href="#">link</a></p>
                </div>
            `);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0] instanceof HTMLElement).toBe(true);
        expect(result[0].tagName.toLowerCase()).toBe('div');
        expect(result[0].className).toBe('container');
        expect(result[0].children.length).toBe(2);
        expect(result[0].querySelector('h1').textContent).toBe('Title');
        expect(result[0].querySelector('p').textContent).toContain('Paragraph with');
        expect(result[0].querySelector('a').getAttribute('href')).toBe('#');
    });

    it('should parse multiple sibling elements', () => {
        const result = $.parseHTML('<div>First</div><span>Second</span>');

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
        expect(result[0].tagName.toLowerCase()).toBe('div');
        expect(result[1].tagName.toLowerCase()).toBe('span');
        expect(result[0].textContent).toBe('First');
        expect(result[1].textContent).toBe('Second');
    });

    it('should parse text nodes', () => {
        const result = $.parseHTML('Just some text');

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0].nodeType).toBe(Node.TEXT_NODE);
        expect(result[0].textContent).toBe('Just some text');
    });

    it('should parse text with HTML', () => {
        const result = $.parseHTML('Text before <span>in the middle</span> and after');

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(3);
        expect(result[0].nodeType).toBe(Node.TEXT_NODE);
        expect(result[1].nodeType).toBe(Node.ELEMENT_NODE);
        expect(result[2].nodeType).toBe(Node.TEXT_NODE);
        expect(result[0].textContent).toBe('Text before ');
        expect(result[1].textContent).toBe('in the middle');
        expect(result[2].textContent).toBe(' and after');
    });

    it('should parse HTML with attributes', () => {
        const result = $.parseHTML(
            '<div id="test-id" class="test-class" data-test="value" aria-label="accessible"></div>'
        );

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0].id).toBe('test-id');
        expect(result[0].className).toBe('test-class');
        expect(result[0].getAttribute('data-test')).toBe('value');
        expect(result[0].getAttribute('aria-label')).toBe('accessible');
    });

    it('should return empty array for non-string input', () => {
        expect($.parseHTML(null)).toEqual([]);
        expect($.parseHTML(undefined)).toEqual([]);
        expect($.parseHTML(123)).toEqual([]);
        expect($.parseHTML({})).toEqual([]);
        expect($.parseHTML([])).toEqual([]);
    });

    it('should parse HTML with comments', () => {
        const result = $.parseHTML('<!-- A comment --><div>Content</div>');

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
        expect(result[0].nodeType).toBe(Node.COMMENT_NODE);
        expect(result[0].textContent).toBe(' A comment ');
        expect(result[1].tagName.toLowerCase()).toBe('div');
    });

    it('should trim whitespace from input', () => {
        const result = $.parseHTML('   <div></div>   ');

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0].tagName.toLowerCase()).toBe('div');
    });

    it('should parse HTML with special characters', () => {
        const result = $.parseHTML('<div title="Special &quot;quoted&quot; text">Content with &amp; symbol</div>');

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0].title).toBe('Special "quoted" text');
        expect(result[0].textContent).toBe('Content with & symbol');
    });
});
