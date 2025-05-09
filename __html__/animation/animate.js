import {$} from "../../dist/dom.js"

var field = document.querySelector(".field");
var w = field.clientWidth, h = field.clientHeight;
var ball = $(".ball");

ball.animate([
    {
        draw: {
            left: [0, w - ball.width()]
        },
        dur: 2000,
        ease: "easeOutQuad",
        loop: true
    },
    {
        draw: {
            top: [0, h - ball.height()]
        },
        dur: 2000,
        ease: "easeOutBounce",
        loop: true
    },
    {
        draw: {rotate: "2turn"},
        dur: 2000,
        loop: true
    }
]);

field.addEventListener("mouseenter", function(){
    $.pauseAll(document.querySelector('.ball'));
});

field.addEventListener("mouseleave", function(){
    $.resumeAll(document.querySelectorAll('.ball'));
});

field.addEventListener("click", function(){
    $.stopAll(true, '.ball');
});
