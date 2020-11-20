# motion-blur-move

Move a dom element with exponential speeds and motionblur. Motion blur i achieved through the SVG filter method.

## Usage

Load the motion-blur-move.js into your template. Add the svg to the template.

```
<svg width="1" height="1">
    <defs>
        <filter id="svg-motion-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0 0" />
        </filter>
    </defs>
</svg>
```

Engage a motion by running this.

```
motionBlur(document.getElementById('moveme'), {
    durationMs: 200,
    xTargetDistancePx: 300,
    applyToggle: true,
    easing: 'easeInQuad',
    useMotionBlur: true,
    blurMultiplier: 2,
  }).then((el) => console.log('done', el));
```

Or minimal with defaults

```
motionBlur(document.getElementById('moveme'));
```

The function returns a promise when the move is finnished.

## Available easing methods

- easeOutExpo,
- easeInSine,
- easeOutSine,
- easeInOutSine,
- easeInCubic,
- easeOutCubic,
- easeInOutCubic,
- easeInQuint,
- easeInQuad,
- easeOutQuad,
- easeInOutQuad,
- easeInQuart,
- easeOutQuart,
- easeInOutQuart,
- easeInExpo,
- easeOutExpo,
- easeInOutExpo,
- easeInCirc,
- easeOutCirc,
- easeInOutCirc,
- easeInBack,
- easeOutBack,
- easeInOutBack,
- easeInElastic,
- easeOutElastic,
- easeInOutElastic,
- easeInBounce,
- easeOutBounce,
- easeInOutBounce,

## Gotchas

- The blur wont extend outside the target element borders and then the blur effect will not look good. Instead create a invisible wrapper div with enough padding to the visible element for the motion blur effect to spill over outside the visible elements border.
- The blur amount is calculated in proportion to the number of pixels moved per time unit. This means that if the element is moving slowly the effect is smaller. If you still want exagerate the effect use the multiplier argument to increase the blur.

## Todos

- Make the function take multiple css properties, possibly on set of in and one out, and let the easing method work those too.
- Make it accept other units than px for distance.
- Create the svg implicitly from within the function itself. For now the filter won't work when done this way.
- Look into extending a div element (or all) with this as a function.
- Look into making a custom web component that wraps a target element.
