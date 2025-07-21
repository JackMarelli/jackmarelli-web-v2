const _app = {};
_app.blurSlider = document.querySelector("#blurSlider");
_app.canvas = document.querySelector("#arena");
_app.canvasW = _app.canvas.width;
_app.canvasH = _app.canvas.height;

_app.randomizeColors = () => {
    _app.col1 = Math.floor(Math.random() * 16777215).toString(16)
    _app.col1 = "#" + _app.col1;
    _app.col2 = Math.floor(Math.random() * 16777215).toString(16)
    _app.col2 = "#" + _app.col2;
}

_app.updateBlur = () => {
    _app.blurSliderValue = _app.blurSlider.value;
    _app.canvas.style.filter = `blur(${_app.blurSliderValue}px) contrast(1000)`;
    console.log('_app.canvas.style.filter', _app.canvas.style);
}

function setup() {

    console.log('_app.canvas, _app.canvasW, _app.canvasH', _app.canvas, _app.canvasW, _app.canvasH);

    _app.ctx = _app.canvas.getContext("2d");
    _app.size = 50;
    _app.step = _app.canvasW / _app.size;
    _app.sum1 = 0;
    
    _app.randomizeColors()
    initialize();
    _app.interval = setInterval(run, 120);
}

function initialize() {
    Old = new Array(_app.size);
    New = new Array(_app.size);
    Neigh = new Array(_app.size);
    Ratio1 = new Array(_app.size);

    for (i = 0; i < Old.length; ++i) {
        Old[i] = new Array(_app.size);
        New[i] = new Array(_app.size);
        Neigh[i] = new Array(_app.size);
        Ratio1[i] = new Array(_app.size);

    }
    for (i = 0; i < _app.size; ++i) {
        for (j = 0; j < _app.size; ++j) {
            Ratio1[i][j] = 0;
            Neigh[i][j] = 8;
            if (i === 0 || i === _app.size - 1) {
                Neigh[i][j] = 5;
                if (j === 0 || j === _app.size - 1) {
                    Neigh[i][j] = 3
                }
            }
            if (j === 0 || j === _app.size - 1) {
                Neigh[i][j] = 5;
                if (i === 0 || i === _app.size - 1) {
                    Neigh[i][j] = 3
                }
            }


            if (i < _app.size / 2) {
                Old[i][j] = 1;
                _app.sum1 += 1
            }
            else {
                Old[i][j] = 0;
            }
            New[i][j] = Old[i][j];
        }
    }
    _app.sum1 = _app.sum1 / (_app.size * _app.size);
}

function ratio() {
    for (i = 0; i < _app.size; ++i) {
        for (j = 0; j < _app.size; ++j) {
            Ratio1[i][j] = 0;
            if (i > 0) {
                if (j > 0) { Ratio1[i][j] += Old[i - 1][j - 1]; }
                Ratio1[i][j] += Old[i - 1][j];
                if (j < _app.size - 1) { Ratio1[i][j] += Old[i - 1][j + 1]; }
            }

            if (j > 0) { Ratio1[i][j] += Old[i][j - 1]; }
            if (j < _app.size - 1) { Ratio1[i][j] += Old[i][j + 1]; }

            if (i < _app.size - 1) {
                if (j > 0) { Ratio1[i][j] += Old[i + 1][j - 1]; }
                Ratio1[i][j] += Old[i + 1][j];
                if (j < _app.size - 1) { Ratio1[i][j] += Old[i + 1][j + 1]; }
            }

            Ratio1[i][j] = Ratio1[i][j] / Neigh[i][j];
        }
    }

}

function draw() {


    for (i = 0; i < _app.size; ++i) {
        for (j = 0; j < _app.size; ++j) {
            _app.ctx.fillStyle = _app.col1;
            if (Old[i][j] === 1) { _app.ctx.fillStyle = _app.col2; }
            _app.ctx.fillRect(i * _app.step, j * _app.step, _app.step, _app.step);
        }
    }
}

function calculate() {

    for (i = 0; i < _app.size; ++i) {
        for (j = 0; j < _app.size; ++j) {
            help = Math.random();

            if ((Ratio1[i][j]) > help) {
                Old[i][j] = 1;
            } else {
                Old[i][j] = 0;
            }
        }
    }


    _app.sum1 = 0;
    for (i = 0; i < _app.size; ++i) {
        for (j = 0; j < _app.size; ++j) {
            if (Old[i][j] == 1) _app.sum1 += 1;
        }
    }
    _app.sum1 = _app.sum1 / (_app.size * _app.size);


}

function run() {
    ratio();
    draw();
    calculate();
}

_app.blurSlider.addEventListener("input", _app.updateBlur)

setup();