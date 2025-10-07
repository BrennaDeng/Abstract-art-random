////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// Global definitions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//let testRange = document.getElementById("");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// Intro Modal popup
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const introModal = document.getElementById("introDialog");
/* find modal */
/* let introModal = document.getElementById("introDialog");
/* to get the backdrop working we need to open the modal with js */
/* document.getElementById("introDialog").showModal();
/* find modal close button and add an eventlistener */
/* document.getElementById("dialogCloseButton").addEventListener("click", () => {
  introModal.close();
});*/
/* find modal */
/* to get the backdrop working we need to open the modal with js */

document.getElementById("introDialog").showModal();
/* find modal close button and add an eventlistener */
document.getElementById("dialogCloseButton").addEventListener("click", () => {
  introModal.close();
});
/* finally we want to initialize the synthesizer when the modal is closed */
/* because this can be through the above button, or by pressing esc, we tie it to the actual close event */
/* the referenced toneInit function is defined in toneSetup.js */
introModal.addEventListener("close", toneInit);

let acceptedOscTypes = ["fatsine", "fatsquare", "fatsawtooth", "fattriangle"];


let canvas = document.getElementById("bgCanvas");
let ctx = canvas.getContext('2d');
let circles = [];



function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
//resizeCanvas();
//window.addEventListener('resize', resizeCanvas);

function randomColor() {
    return `hsl(${Math.random() * 360}, 70%, 50%)`;
}

function drawBackground() {
    ctx.fillStyle = randomColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}



function playRandomNote(synth) {
    const notes = ["C4", "D4", "E4", "G4", "A4"];
    const note = notes[Math.floor(Math.random() * notes.length)];
    synth.triggerAttackRelease(note, "8n");
}


// Shape interactions
document.querySelectorAll('.shape').forEach(shape => {

    // Ensure absolute positioning
    shape.style.position = "absolute";

    // Random initial position
    shape.style.left = Math.random() * (window.innerWidth - 60) + "px";
    shape.style.top = Math.random() * (window.innerHeight - 60) + "px";

    // Click trigger
    shape.addEventListener('click', async () => {
        await Tone.start();
        const type = shape.dataset.sound;
        if (type === 'synth1') playRandomNote(synth1);
        if (type === 'synth2') playRandomNote(synth2);
        if (type === 'synth3') playRandomNote(synth3);
        drawBackground();
    });

    // Drag & drop
    shape.onmousedown = (e) => {
        e.preventDefault();
        let offsetX = e.clientX - shape.offsetLeft;
        let offsetY = e.clientY - shape.offsetTop;

        function moveHandler(e) {
            shape.style.left = (e.clientX - offsetX) + "px";
            shape.style.top = (e.clientY - offsetY) + "px";
            checkCollision(shape);
        }

        function upHandler() {
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', upHandler);
        }

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
    };
});


// Collision

function isOverlap(el1, el2) {
    const r1 = el1.getBoundingClientRect();
    const r2 = el2.getBoundingClientRect();
    return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
}

let collisionCooldown = false; // Prevents rapid retrigger

function checkCollision(dragged) {
    if(collisionCooldown) return;
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach(other => {
        if (other !== dragged && isOverlap(dragged, other)) {
            const note1 = other.dataset.sound === "synth1" ? "C4" : "D4";
            const note2 = dragged.dataset.sound === "synth1" ? "E4" : "G4";
            polySynth.triggerAttackRelease([note1, note2], "8n");

            // Visual feedback
            other.style.transform = "scale(1.3)";
            dragged.style.transform = "scale(1.3)";
            setTimeout(() => { 
                other.style.transform = "scale(1)";
                dragged.style.transform = "scale(1)";
            }, 300);

            collisionCooldown = true;
            setTimeout(() => collisionCooldown = false, 500); // 0.5s cooldown
        }
    });
}


function loop() {
    ctx.fillStyle = "rgba(195, 131, 131, 0.05)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    for (let i = circles.length - 1; i >= 0; i--) {
        let c = circles[i];
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI*2);
        ctx.fillStyle = c.color;
        ctx.fill();
        c.radius += 1;
        if (c.radius > 100) circles.splice(i,1);
    }

    requestAnimationFrame(loop);
}
loop();


