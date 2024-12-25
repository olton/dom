# ✨✨✨ DOM ✨✨✨

Welcome to DOM – a simple, lightweight, and fast JavaScript library for working with DOM elements.
Dom is written in pure JavaScript and provides the ability to create and manipulate DOM elements.
Dom designed for manipulating HTML elements in [Metro UI Library](https://metroui.org.ua).
Dom is similar in interfaces to `jQuery`, but is not a complete replacement for it.

**With Dom, you can:**

+ [x] Create, move, and remove DOM elements
+ [x] Change attributes of elements
+ [x] Change the content of elements
+ [x] Add and remove classes and styles of elements
+ [x] Work with events
+ [x] Work with AJAX requests

## Installation

```shell
npm install @olton/dom
```

## Using example

```javascript
import $ from '@olton/dom';

$('body').append('<div>Hello, world!</div>');
$('body').addClass('body-class');

$('button').on('click', function(){
    alert('Hello, world!');
});

$.ajax({
    url: 'https://api.example.com/data',
    onSuccess: function(data){
        console.log(data);
    }
});
```

---
Copyright 2024, [Serhii Pimenov](https://pimenov.com.ua)