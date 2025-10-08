////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// Global definitions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// Intro Modal popup
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const introModal = document.getElementById("introDialog");

if (introModal) {
  introModal.addEventListener("close", toneInit);
}

let acceptedOscTypes = ["fatsine", "fatsquare", "fatsawtooth", "fattriangle"];

let canvas = document.getElementById("stage");
let ctx = canvas.getContext('2d');
let circles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

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
    // Click trigger
    shape.addEventListener('click', async () => {
        await Tone.start();
        const type = shape.dataset.sound;
        if (type === 'synth1') playRandomNote(synth1);
        if (type === 'synth2') playRandomNote(synth2);
        if (type === 'synth3') playRandomNote(synth3);
        if (type === 'synth4') playRandomNote(synth4);
        if (type === 'synth5') playRandomNote(synth5);
        drawBackground();
    });
});

// Collision
function isOverlap(el1, el2) {
    const r1 = el1.getBoundingClientRect();
    const r2 = el2.getBoundingClientRect();
    return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
}

let collisionCooldown = false;

function checkCollision(dragged) {
    if(collisionCooldown) return;
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach(other => {
        if (other !== dragged && isOverlap(dragged, other)) {
            const notes = {
                synth1: "C4",
                synth2: "D4",
                synth3: "E4",
                synth4: "G4",
                synth5: "A4"
            };
            
            const note1 = notes[other.dataset.sound] || "C4";
            const note2 = notes[dragged.dataset.sound] || "E4";
            polySynth.triggerAttackRelease([note1, note2], "8n");

            // Visual feedback
            other.style.transform = "scale(1.3)";
            dragged.style.transform = "scale(1.3)";
            setTimeout(() => { 
                other.style.transform = "scale(1)";
                dragged.style.transform = "scale(1)";
            }, 300);

            collisionCooldown = true;
            setTimeout(() => collisionCooldown = false, 500);
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


