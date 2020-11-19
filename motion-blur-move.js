async function motionBlur(
  element,
  {
    durationMs = 1000,
    xTargetDistancePx = 0,
    yTargetDistancePx = 0,
    xTarget, // Optional absolute alternative.
    yTarget,
    applyToggle = false,
    easing = 'easeOutExpo',
    useMotionBlur = true,
    blurMultiplier = 1,
    docRoot = document,
  } = {}
) {
  return new Promise((resolve, reject) => {
    const easings = easingFactory();
    let start;
    const elStartPosition = window.getComputedStyle(element);
    const originPos = {
      x: parseInt(elStartPosition.left),
      y: parseInt(elStartPosition.top),
    };
    // Moition blur.
    let previousX, previousY;
    if (useMotionBlur) initMotionBlur();
    //
    convertOptionalAbsoluteToRelative();
    handleToggleMode();

    function step(timestamp) {
      start || (start = timestamp);
      const elapsedMs = timestamp - start;
      const linearProgress = elapsedMs / durationMs;
      const easedProgress = {
        x: easings[easing](linearProgress) * xTargetDistancePx,
        y: easings[easing](linearProgress) * yTargetDistancePx,
      };
      //
      if (useMotionBlur) applyMotionBlur(easedProgress);
      //
      element.style.left = originPos.x + easedProgress.x + 'px';
      element.style.top = originPos.y + easedProgress.y + 'px';

      if (elapsedMs < durationMs) {
        window.requestAnimationFrame(step);
      } else {
        // Movement done.
        if (useMotionBlur) resetMotionBlur();
        with (element.style) {
          left = Math.round(parseInt(left)) + 'px';
          top = Math.round(parseInt(top)) + 'px';
        }
        resolve(element);
      }
    }
    window.requestAnimationFrame(step);

    function convertOptionalAbsoluteToRelative() {
      if (yTargetDistancePx + xTargetDistancePx !== 0 || !xTarget || !yTarget)
        return;
      xTargetDistancePx = xTarget - originPos.x;
      yTargetDistancePx = yTarget - originPos.y;
    }

    function handleToggleMode() {
      if (element.dataset.toggle && applyToggle) {
        [xTargetDistancePx, yTargetDistancePx] = element.dataset.toggle
          .split(',')
          .map((x) => x * -1);
        delete element.dataset.toggle;
      } else if (applyToggle) {
        element.dataset.toggle = `${xTargetDistancePx},${yTargetDistancePx}`;
      }
    }

    function initMotionBlur() {
      // create svg imperatively.
      if (false) {
        // Skip until I figure out how to make it stick.
        const svgEl = document.createElement('svg');
        svgEl.setAttribute('width', '1');
        svgEl.setAttribute('height', '1');
        const defsEl = svgEl.appendChild(document.createElement('defs'));
        const filterEl = defsEl.appendChild(document.createElement('filter'));
        filterEl.setAttribute('id', 'svg-motion-blur');
        const feGaussianBlurEl = filterEl.appendChild(
          document.createElement('feGaussianBlur')
        );
        feGaussianBlurEl.setAttribute('in', 'SourceGraphic');
        feGaussianBlurEl.setAttribute('stdDeviation', '0 0');
        docRoot.body.appendChild(svgEl);
      }
      element.style.filter = 'url("#svg-motion-blur")';
      return;
    }

    function applyMotionBlur(easedProgress) {
      previousX || (previousX = easedProgress.x);
      previousY || (previousY = easedProgress.y);
      const diff = [
        Math.abs(Math.round((easedProgress.x - previousX) * blurMultiplier)),
        Math.abs(Math.round((easedProgress.y - previousY) * blurMultiplier)),
      ];
      const svg = docRoot.querySelector('feGaussianBlur');
      svg.setAttribute('stdDeviation', diff.join(' '));
      [previousX, previousY] = [easedProgress.x, easedProgress.y];
    }

    function resetMotionBlur() {
      element.style.filter = null;
      const svg = docRoot.querySelector('feGaussianBlur');
      svg.setAttribute('stdDeviation', '0 0');
    }

    function easingFactory() {
      // Add more from https://easings.net/
      const easeInSine = (x) => 1 - Math.cos((x * Math.PI) / 2);
      const easeOutSine = (x) => Math.sin((x * Math.PI) / 2);
      const easeInOutSine = (x) => (-1 * (Math.cos(Math.PI * x) - 1)) / 2;
      const easeInCubic = (x) => x * x * x;
      const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
      const easeInOutCubic = (x) =>
        x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
      const easeInQuint = (x) => x * x * x * x * x;
      const easeOutQuint = (x) => 1 - Math.pow(1 - x, 5);
      const easeInOutQuint = (x) =>
        x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
      const easeInQuad = (x) => x * x;
      const easeOutQuad = (x) => 1 - (1 - x) * (1 - x);
      const easeInOutQuad = (x) =>
        x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
      const easeInQuart = (x) => x * x * x * x;
      const easeOutQuart = (x) => 1 - Math.pow(1 - x, 4);
      const easeInOutQuart = (x) =>
        x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
      const easeInExpo = (x) =>
        x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
      const easeOutExpo = (x) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x));
      const easeInOutExpo = (x) =>
        x === 0
          ? 0
          : x === 1
          ? 1
          : x < 0.5
          ? Math.pow(2, 20 * x - 10) / 2
          : (2 - Math.pow(2, -20 * x + 10)) / 2;

      return {
        easeOutExpo,
        easeInSine,
        easeOutSine,
        easeInOutSine,
        easeInCubic,
        easeOutCubic,
        easeInOutCubic,
        easeInQuint,
        easeInQuad,
        easeOutQuad,
        easeInOutQuad,
        easeInQuart,
        easeOutQuart,
        easeInOutQuart,
        easeInExpo,
        easeOutExpo,
        easeInOutExpo,
      };
    }
  });
}

function moveobj() {
  motionBlur(document.getElementById('moveme'), {
    durationMs: 200,
    xTargetDistancePx: 300,
    applyToggle: true,
    easing: 'easeInQuad',
    useMotionBlur: true,
    blurMultiplier: 2,
  }).then((el) => console.log('done', el));
}
