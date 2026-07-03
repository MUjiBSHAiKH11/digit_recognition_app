// Get canvas element
const canvas = document.getElementById("canvas");

// Get 2D drawing context
const ctx = canvas.getContext("2d");

// Fill canvas with black background
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Drawing variables
let drawing = false;

// Start drawing
canvas.addEventListener("mousedown", () => {
    drawing = true;
});

// Stop drawing
canvas.addEventListener("mouseup", () => {
    drawing = false;
    ctx.beginPath();
});

// Draw when mouse moves
canvas.addEventListener("mousemove", draw);

function draw(event) {

    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";

    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Predict Button
document.getElementById("predictBtn").addEventListener("click", function () {

    const image = canvas.toDataURL("image/png");

    fetch("/predict", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            image: image
        })

    })

    .then(response => response.json())

    .then(data => {

        document.getElementById("digit").innerHTML = data.digit;

        document.getElementById("confidence").innerHTML =
            "Confidence : " + data.confidence + "%";

    });

});

// Clear Button
document.getElementById("clearBtn").addEventListener("click", function () {

    ctx.fillStyle = "black";

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.getElementById("digit").innerHTML = "-";

    document.getElementById("confidence").innerHTML = "";

});