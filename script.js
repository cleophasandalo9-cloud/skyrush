// Get input elements
const widthInput = document.getElementById("width");
const lengthInput = document.getElementById("length");
const roomsInput = document.getElementById("rooms");
const button = document.getElementById("generateBtn");
const output = document.getElementById("planDisplay");

// Predefined room types and colors
const roomTypes = [
    { name: "Living Room", width: 200, height: 150, color: "rgb(34,197,94)" },  // green
    { name: "Bedroom", width: 150, height: 120, color: "rgb(59,130,246)" },      // blue
    { name: "Kitchen", width: 120, height: 100, color: "rgb(234,179,8)" },       // yellow
    { name: "Bathroom", width: 100, height: 80, color: "rgb(248,113,113)" }      // red
];

// Generate unique random color
function getRandomColor(existingColors) {
    let color;
    do {
        color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    } while (existingColors.includes(color));
    return color;
}

// Drag functionality
function makeDraggable(el) {
    let offsetX = 0, offsetY = 0, initialX = 0, initialY = 0;
    el.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        initialX = e.clientX;
        initialY = e.clientY;
        document.onmousemove = elementDrag;
        document.onmouseup = stopDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        offsetX = e.clientX - initialX;
        offsetY = e.clientY - initialY;
        initialX = e.clientX;
        initialY = e.clientY;

        const rect = el.getBoundingClientRect();
        const parentRect = el.parentElement.getBoundingClientRect();

        let newLeft = el.offsetLeft + offsetX;
        let newTop = el.offsetTop + offsetY;

        newLeft = Math.max(0, Math.min(newLeft, parentRect.width - rect.width));
        newTop = Math.max(0, Math.min(newTop, parentRect.height - rect.height));

        el.style.left = newLeft + "px";
        el.style.top = newTop + "px";
    }

    function stopDrag() {
        document.onmousemove = null;
        document.onmouseup = null;
    }
}

// Auto-arrange rooms neatly inside plot
function autoArrangeRooms(plot) {
    const rooms = Array.from(plot.children);
    const padding = 5; // space between rooms
    let x = padding, y = padding, maxRowHeight = 0;

    rooms.forEach(room => {
        const roomWidth = parseInt(room.style.width);
        const roomHeight = parseInt(room.style.height);

        if (x + roomWidth + padding > plot.clientWidth) {
            x = padding;
            y += maxRowHeight + padding;
            maxRowHeight = 0;
        }

        room.style.left = x + "px";
        room.style.top = y + "px";

        x += roomWidth + padding;
        maxRowHeight = Math.max(maxRowHeight, roomHeight);
    });
}

// Download plot as image
function downloadPlot(plot) {
    html2canvas(plot).then(canvas => {
        const link = document.createElement("a");
        link.download = "floor_plan.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}

// Main button click event
button.addEventListener("click", function () {
    const width = parseFloat(widthInput.value);
    const length = parseFloat(lengthInput.value);
    const totalRooms = parseInt(roomsInput.value);

    if (!width || !length || !totalRooms) {
        output.innerHTML = "Please fill all fields.";
        return;
    }

    output.innerHTML = "";

    // Show plot info
    const info = document.createElement("p");
    info.innerText = "Plot: " + width + "m x " + length + "m";
    output.appendChild(info);

    // Create plot container
    const plot = document.createElement("div");
    plot.style.width = width * 10 + "px";
    plot.style.height = length * 10 + "px";
    plot.style.border = "3px solid rgb(255,255,255)";
    plot.style.position = "relative";
    plot.style.backgroundColor = "rgb(20,30,50)";
    plot.style.boxSizing = "border-box";
    output.appendChild(plot);

    // Track used colors
    const usedColors = roomTypes.map(r => r.color);
    const plotWidthPx = width * 10;
    const plotHeightPx = length * 10;

    // Generate rooms
    for (let i = 0; i < totalRooms; i++) {
        const room = document.createElement("div");
        let type;

        if (i < roomTypes.length) {
            type = roomTypes[i];
        } else {
            const randColor = getRandomColor(usedColors);
            usedColors.push(randColor);
            type = { name: "Extra Room " + (i - roomTypes.length + 1), width: 120, height: 100, color: randColor };
        }

        const roomWidth = Math.min(type.width, plotWidthPx - 10);
        const roomHeight = Math.min(type.height, plotHeightPx - 10);

        room.style.width = roomWidth + "px";
        room.style.height = roomHeight + "px";
        room.style.backgroundColor = type.color;
        room.style.color = "rgb(255,255,255)";
        room.style.fontWeight = "bold";
        room.style.display = "flex";
        room.style.alignItems = "center";
        room.style.justifyContent = "center";
        room.style.position = "absolute";

        // Random initial position
        const maxLeft = plotWidthPx - roomWidth;
        const maxTop = plotHeightPx - roomHeight;
        room.style.left = Math.floor(Math.random() * maxLeft) + "px";
        room.style.top = Math.floor(Math.random() * maxTop) + "px";

        room.innerText = type.name;

        makeDraggable(room);
        plot.appendChild(room);
    }

    // Auto-arrange button
    const arrangeBtn = document.createElement("button");
    arrangeBtn.innerText = "Arrange Automatically";
    arrangeBtn.style.marginTop = "10px";
    arrangeBtn.onclick = () => autoArrangeRooms(plot);
    output.appendChild(arrangeBtn);

    // Download button
    const downloadBtn = document.createElement("button");
    downloadBtn.innerText = "Download Floor Plan";
    downloadBtn.style.marginTop = "10px";
    downloadBtn.style.marginLeft = "10px";
    downloadBtn.onclick = () => downloadPlot(plot);
    output.appendChild(downloadBtn);
});