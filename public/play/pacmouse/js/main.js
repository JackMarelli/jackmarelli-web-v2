const _app = {}
_app.arena = document.querySelector("#arena");
_app.step = 50;
_app.dots = [];
_app.initialX = 0;
_app.initialY = 0;

_app.createDot = (diam, x, y) => {

    const currentX = x;
    const currentY = y;

    const distance = Math.sqrt((currentX - _app.initialX) ** 2 + (currentY - _app.initialY) ** 2);

    if (distance > 50) {
        if (_app.dots.length > 12) {
            _app.dots.shift();
        }

        const newDot = {
            diameter: diam,
            x: x,
            y: y
        };

        _app.dots.push(newDot);

        _app.initialX = currentX;
        _app.initialY = currentY;
    }

}

_app.updateDots = () => {
    _app.arena.innerHTML = "";
    for (let i = 0; i < _app.dots.length; i++) {
        let d = document.createElement("div");
        d.style.position = "absolute";
        d.style.transform = "translateX(-50%) translateY(-50%)";
        d.style.left = `${_app.dots[i].x}px`;
        d.style.top = `${_app.dots[i].y}px`;
        d.style.width = `${_app.dots[i].diameter}px`;
        d.style.height = `${_app.dots[i].diameter}px`;
        d.style.borderRadius = `${_app.dots[i].diameter}px`;
        d.style.backgroundColor = "#eee";

        if (i == 0) {
            d.style.width = `${_app.dots[i].diameter * 5}px`;
            d.style.height = `${_app.dots[i].diameter * 5}px`;
            d.style.borderRadius = `${_app.dots[i].diameter * 5}px`;
            d.style.backgroundColor = "#ff0";
        }

        _app.arena.appendChild(d);
    }

}

_app.startUp = () => {
    _app.arena.addEventListener("mousemove", (e) => {
        _app.createDot(10, e.clientX, e.clientY);
        _app.updateDots();
    })
}

_app.startUp();