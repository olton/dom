import { describe, it, expect, beforeEach, afterEach } from '@olton/latte';
import { $ } from '../dist/dom.js';

beforeEach(() => {
    // Создаем тестовую DOM-структуру перед каждым тестом
    document.body.innerHTML = `
            <div id="container">
                <div id="test-element" class="test-class">
                    <span id="child1">Child 1</span>
                    <span id="child2">Child 2</span>
                </div>
                <div id="sibling">Sibling</div>
            </div>
            <div id="outside">Outside Element</div>
        `;
});

afterEach(() => {
    // Очищаем DOM после каждого теста
    document.body.innerHTML = '';
});

describe('Text Manipulation', () => {
    it('should append text to elements', () => {
        $('#test-element').appendText(' Appended Text');
        expect($('#test-element').html()).toContain('Child 1');
        expect($('#test-element').html()).toContain('Child 2');
        expect($('#test-element').html()).toContain('Appended Text');
    });

    it('should prepend text to elements', () => {
        $('#test-element').prependText('Prepended Text ');
        expect($('#test-element').html()).toContain('Child 1');
        expect($('#test-element').html()).toContain('Child 2');
        expect($('#test-element').html()).toContain('Prepended Text');
    });
});

describe('Element Insertion - append/prepend', () => {
    it('should append element to target', () => {
        const newElement = $('<div id="appended">New Element</div>');
        $('#test-element').append(newElement);

        expect($('#test-element #appended').length).toBe(1);
        expect($('#test-element').children().length).toBe(3);
        expect($('#test-element').children().last().attr('id')).toBe('appended');
    });

    it('should prepend element to target', () => {
        const newElement = $('<div id="prepended">New Element</div>');
        $('#test-element').prepend(newElement);

        expect($('#test-element #prepended').length).toBe(1);
        expect($('#test-element').children().length).toBe(3);
        expect($('#test-element').children().first().attr('id')).toBe('prepended');
    });

    it('should handle string HTML for append', () => {
        $('#test-element').append('<div id="appended">New Element</div>');

        expect($('#test-element #appended').length).toBe(1);
        expect($('#test-element').children().last().attr('id')).toBe('appended');
    });

    it('should handle string HTML for prepend', () => {
        $('#test-element').prepend('<div id="prepended">New Element</div>');

        expect($('#test-element #prepended').length).toBe(1);
        expect($('#test-element').children().first().attr('id')).toBe('prepended');
    });

    it('should handle multiple elements for append', () => {
        $('#test-element').append('<div id="append1">One</div><div id="append2">Two</div>');

        expect($('#test-element').children().length).toBe(4);
        expect($('#test-element #append1').length).toBe(1);
        expect($('#test-element #append2').length).toBe(1);
    });

    it('should handle multiple elements for prepend', () => {
        $('#test-element').prepend('<div id="prepend1">One</div><div id="prepend2">Two</div>');

        expect($('#test-element').children().length).toBe(4);
        expect($('#test-element #prepend1').length).toBe(1);
        expect($('#test-element #prepend2').length).toBe(1);
    });

    it('should clone elements when appending to multiple targets', () => {
        $('<div class="container"></div><div class="container"></div>')
            .appendTo('#container');

        $('.container').append('<span class="appended">Appended</span>');

        expect($('.appended').length).toBe(2);
    });

    it('should clone elements when prepending to multiple targets', () => {
        $('<div class="container"></div><div class="container"></div>')
            .appendTo('#container');

        $('.container').prepend('<span class="prepended">Prepended</span>');

        expect($('.prepended').length).toBe(2);
    });

    it('should not append an element to itself', () => {
        const el = $('#test-element');
        el.append(el);
        expect($('#test-element #test-element').length).toBe(0);
    });

    it('should not prepend an element to itself', () => {
        const el = $('#test-element');
        el.prepend(el);
        expect($('#test-element #test-element').length).toBe(0);
    });
});

describe('Element Insertion - appendTo/prependTo', () => {
    it('should append element to target using appendTo', () => {
        const newElement = $('<div id="appended">New Element</div>');
        newElement.appendTo('#test-element');

        expect($('#test-element #appended').length).toBe(1);
        expect($('#test-element').children().length).toBe(3);
        expect($('#test-element').children().last().attr('id')).toBe('appended');
    });

    it('should prepend element to target using prependTo', () => {
        const newElement = $('<div id="prepended">New Element</div>');
        newElement.prependTo('#test-element');

        expect($('#test-element #prepended').length).toBe(1);
        expect($('#test-element').children().length).toBe(3);
        expect($('#test-element').children().first().attr('id')).toBe('prepended');
    });

    it('should clone elements when using appendTo with multiple targets', () => {
        const newElement = $('<div id="appended">New Element</div>');
        newElement.appendTo('#test-element, #sibling');

        expect($('#test-element #appended').length).toBe(1);
        expect($('#sibling #appended').length).toBe(1); // Должен быть перемещен, а не склонирован
        expect($('#sibling').children().length).toBe(1);
        expect($('#sibling').children().attr('id')).toBe('appended');
    });

    it('should clone elements when using prependTo with multiple targets', () => {
        const newElement = $('<div id="prepended">New Element</div>');
        newElement.prependTo('#test-element, #sibling');

        expect($('#test-element #prepended').length).toBe(1);
        expect($('#sibling #prepended').length).toBe(1);
        expect($('#sibling').children().first().attr('id')).toBe('prepended');
    });

    it('should not append an element to itself', () => {
        const el = $('#test-element');
        el.appendTo(el);
        expect($('#test-element #test-element').length).toBe(0);
    });

    it('should not prepend an element to itself', () => {
        const el = $('#test-element');
        el.prependTo(el);
        expect($('#test-element #test-element').length).toBe(0);
    });
});

describe('Element Insertion - before/after', () => {
    it('should insert element before target', () => {
        const newElement = $('<div id="before">Before Element</div>');
        $('#test-element').before(newElement);

        expect($('#container').children().first().attr('id')).toBe('before');
        expect($('#before + #test-element').length).toBe(1);
    });

    it('should insert element after target', () => {
        const newElement = $('<div id="after">After Element</div>');
        $('#test-element').after(newElement);

        expect($('#test-element + #after').length).toBe(1);
    });

    it('should handle string HTML for before', () => {
        $('#test-element').before('<div id="before">Before Element</div>');

        expect($('#before').length).toBe(1);
        expect($('#before + #test-element').length).toBe(1);
    });

    it('should handle string HTML for after', () => {
        $('#test-element').after('<div id="after">After Element</div>');

        expect($('#after').length).toBe(1);
        expect($('#test-element + #after').length).toBe(1);
    });
});

describe('Element Insertion - insertBefore/insertAfter', () => {
    it('should insert element before target using insertBefore', () => {
        const newElement = $('<div id="before">Before Element</div>');
        newElement.insertBefore('#test-element');

        expect($('#container').children().first().attr('id')).toBe('before');
        expect($('#before + #test-element').length).toBe(1);
    });

    it('should insert element after target using insertAfter', () => {
        const newElement = $('<div id="after">After Element</div>');
        newElement.insertAfter('#test-element');

        expect($('#test-element + #after').length).toBe(1);
    });

    it('should clone elements when using insertBefore with multiple targets', () => {
        const newElement = $('<div id="new-element">New Element</div>');
        newElement.insertBefore('#child1, #child2');

        expect($('#new-element').length).toBe(2);
        expect($('#child1').prev().attr('id')).toBe('new-element');
        expect($('#child2').prev().attr('id')).toBe('new-element');
    });

    it('should clone elements when using insertAfter with multiple targets', () => {
        const newElement = $('<div id="new-element">New Element</div>');
        newElement.insertAfter('#child1, #child2');

        expect($('#new-element').length).toBe(2);
        expect($('#child1').next().attr('id')).toBe('new-element');
        expect($('#child2').next().attr('id')).toBe('new-element');
    });
});

describe('clone', () => {
    it('should clone elements', () => {
        const original = $('#test-element');
        const cloned = original.clone();

        expect(cloned.length).toBe(1);
        expect(cloned.attr('id')).toBe('test-element');
        expect(cloned.hasClass('test-class')).toBe(true);
        expect(cloned[0]).not.toBe(original[0]);
    });

    it('should clone elements with children when deep=true', () => {
        const original = $('#test-element');
        const cloned = original.clone(true);

        expect(cloned.children().length).toBe(2);
        expect(cloned.find('#child1').length).toBe(1);
        expect(cloned.find('#child2').length).toBe(1);
    });

    it('should not clone children when deep=false', () => {
        const original = $('#test-element');
        const cloned = original.clone(false);

        expect(cloned.children().length).toBe(0);
    });

    it('should clone data when withData=true', () => {
        const original = $('#test-element');
        original.data('test', 'value');
        const cloned = original.clone(true, true);
        expect($(cloned).data('test')).toBe('value');
    });

    it('should not clone data when withData=false', () => {
        const original = $('#test-element');
        original.data('test', 'value');
        const cloned = original.clone(true, false);

        expect($(cloned).data('test')).toBeUndefined();
    });
});

describe('import and adopt', () => {
    it('should import nodes from external documents', () => {
        // Создаем новый документ
        const doc = document.implementation.createHTMLDocument('New Document');
        const externalDiv = doc.createElement('div');
        externalDiv.id = 'external';
        doc.body.appendChild(externalDiv);

        // Импортируем узел из внешнего документа
        const importedNode = $(externalDiv).import(true);

        expect(importedNode.length).toBe(1);
        expect(importedNode[0].ownerDocument).toBe(document);
        expect(importedNode.attr('id')).toBe('external');
    });

    it('should adopt nodes from external documents', () => {
        // Создаем новый документ
        const doc = document.implementation.createHTMLDocument('New Document');
        const externalDiv = doc.createElement('div');
        externalDiv.id = 'external';
        doc.body.appendChild(externalDiv);

        // Адаптируем узел из внешнего документа
        const adoptedNode = $(externalDiv).adopt();

        expect(adoptedNode.length).toBe(1);
        expect(adoptedNode[0].ownerDocument).toBe(document);
        expect(adoptedNode.attr('id')).toBe('external');
        expect(doc.getElementById('external')).toBe(null); // Узел должен быть удален из оригинального документа
    });
});

describe('remove', () => {
    it('should remove element from DOM', () => {
        $('#test-element').remove();

        expect($('#test-element').length).toBe(0);
        expect($('#container').children().length).toBe(1);
    });

    it('should remove elements matching selector', () => {
        $('span').remove('#child1');

        expect($('#child1').length).toBe(0);
        expect($('#child2').length).toBe(1);
        expect($('#test-element').children().length).toBe(1);
    });

    it('should clean data when removing elements', () => {
        $('#test-element').data('test', 'value');
        const removed = $('#test-element').remove();

        expect($.hasData(removed[0])).toBe(false);
    });

    it('should return removed elements', () => {
        const removed = $('#test-element').remove();

        expect(removed.length).toBe(1);
        expect(removed.attr('id')).toBe('test-element');
        expect(removed.hasClass('test-class')).toBe(true);
    });
});

describe('wrap operations', () => {
    it('should wrap element with another element', () => {
        $('#child1').wrap('<div class="wrapper"></div>');

        expect($('.wrapper').length).toBe(1);
        expect($('.wrapper').children().attr('id')).toBe('child1');
        expect($('#child1').parent().hasClass('wrapper')).toBe(true);
    });

    it('should handle deep wrapping structure', () => {
        $('#child1').wrap('<div class="outer"><div class="inner"></div></div>');

        expect($('.outer').length).toBe(1);
        expect($('.inner').length).toBe(1);
        expect($('#child1').parent().hasClass('inner')).toBe(true);
        expect($('#child1').parent().parent().hasClass('outer')).toBe(true);
    });

    it('should wrap all elements individually', () => {
        $('span').wrap('<div class="wrapper"></div>');

        expect($('.wrapper').length).toBe(2);
        expect($('#child1').parent().hasClass('wrapper')).toBe(true);
        expect($('#child2').parent().hasClass('wrapper')).toBe(true);
        expect($('#child1').parent()[0]).not.toBe($('#child2').parent()[0]);
    });

    it('should wrap all elements together with wrapAll', () => {
        $('span').wrapAll('<div class="wrapper"></div>');

        expect($('.wrapper').length).toBe(1);
        expect($('.wrapper').children().length).toBe(2);
        expect($('#child1').parent()[0]).toBe($('#child2').parent()[0]);
        expect($('#child1').parent().hasClass('wrapper')).toBe(true);
    });

    it('should wrap inner contents with wrapInner', () => {
        $('#test-element').wrapInner('<div class="inner-wrapper"></div>');

        expect($('.inner-wrapper').length).toBe(1);
        expect($('.inner-wrapper').parent().attr('id')).toBe('test-element');
        expect($('#child1').parent().hasClass('inner-wrapper')).toBe(true);
        expect($('#child2').parent().hasClass('inner-wrapper')).toBe(true);
    });

    it('should handle DOM element for wrap', () => {
        const wrapper = document.createElement('div');
        wrapper.className = 'dom-wrapper';

        $('#child1').wrap(wrapper);

        expect($('.dom-wrapper').length).toBe(1);
        expect($('#child1').parent().hasClass('dom-wrapper')).toBe(true);
    });

    it('should handle jQuery object for wrap', () => {
        const wrapper = $('<div class="jquery-wrapper"></div>');

        $('#child1').wrap(wrapper);

        expect($('.jquery-wrapper').length).toBe(1);
        expect($('#child1').parent().hasClass('jquery-wrapper')).toBe(true);
    });

    it('should handle deep nested structure for wrapAll', () => {
        $('span').wrapAll('<div class="outer"><div class="inner"></div></div>');

        expect($('.outer').length).toBe(1);
        expect($('.inner').length).toBe(1);
        expect($('#child1').parent().hasClass('inner')).toBe(true);
        expect($('#child2').parent().hasClass('inner')).toBe(true);
    });
});
