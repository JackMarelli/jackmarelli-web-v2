const _app = {};
_app.inElement = document.querySelector("#in");
_app.resultContainer = document.querySelector("#container");

function drawCircle(text) {
  const textArr = [...text];
  _app.resultContainer.innerHTML = "";

  const rect = _app.resultContainer.getBoundingClientRect();
  const radius = rect.width / 2;

  for (let i = 0; i < textArr.length; i++) {
    const angle = (i / textArr.length) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    const rotation = (360 / textArr.length) * i + 90;

    const char = document.createElement("div");
    char.className = "char";
    char.textContent = textArr[i];
    char.style.left = `${x + radius}px`;
    char.style.top = `${y + radius}px`;
    char.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

    _app.resultContainer.appendChild(char);
  }
}

_app.inElement.addEventListener("input", (e) => {
  drawCircle(e.target.value);
});

window.addEventListener("resize", () => {
  const text = _app.inElement.value;
  if (text) drawCircle(text);
});
