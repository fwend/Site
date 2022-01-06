export default function pointerTracker(canvas, handler, doScale = true) {

    function processEvent(e) {
        const rect = canvas.getBoundingClientRect();
        const offsetTop = rect.top;
        const offsetLeft = rect.left;

        if (e.touches) {
            return {
                x: Math.round(e.touches[0].clientX - offsetLeft),
                y: Math.round(e.touches[0].clientY - offsetTop)
            }
        } else {
            return {
                x: Math.round(e.clientX - offsetLeft),
                y: Math.round(e.clientY - offsetTop)
            }
        }
    }

    function onDown(e) {
        e.preventDefault();
        let coords = processEvent(e);
        if (doScale) {
            coords = scale(coords);
        }
        handler('down', coords.x, coords.y);
    }

    function onUp(e) {
        e.preventDefault();
        handler('up');
    }

    function onMove(e) {
        e.preventDefault();
        let coords = processEvent(e);
        if (doScale) {
            coords = scale(coords);
        }
        handler('move', coords.x, coords.y);
    }

    function scale(coords) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.round(coords.x * (canvas.width / rect.width));
        const y = Math.round(coords.y * (canvas.height / rect.height));
        return {x, y};
    }

    canvas.ontouchmove = onMove;
    canvas.onmousemove = onMove;
    canvas.ontouchstart = onDown;
    canvas.onmousedown = onDown;
    canvas.ontouchend = onUp;
    canvas.onmouseup = onUp;
}
