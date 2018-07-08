import Ship from "./elements/ship.js";
import Roid from "./elements/roid.js";
import {
    distance,
    getSafeRoidLocation,
    keyDown,
    keyUp,
    randomHeading,
    randomNumVertices
} from "./utilities.js";

// get canvas, score and context
let canv = document.getElementById("gameCanvas");
let ctx = canv.getContext("2d");
let scoreBox = document.getElementById("score");

// global globals
const FPS = 30; // frames per second
let running = true;
let score = 0;

// ship globals
const SHIP_SIZE = 15; // sizes ship
const ROT_RATE = 300; // rotation rate, degrees per second
const FRICTION = 0.94; // friction co-efficient
const THRUST = 40; // acceleration rate, pixels per second per second
const MAX_THRUST = 200// maximum thrust, pixels per second
const SAFE_ZONE = 150; // radius around ship where no roids will spawn
const BULLET_SPEED = 160; // speed of bullets, pixels per second
const BULLET_DELAY = 250; // bullet interval in miliseconds
const BULLET_DISTANCE = canv.height * 0.9; // // max distance bullets travel in pixels

// roid globals
const ROID_SIZES = [30, 18, 8]; // radii of different sizes
const ROID_SCORES = [10, 25, 50]; // points for each size
const ROID_SPEED = 40; // pixles per second
const ROID_NUM = 5; // number of starting roids, first level
const roids = [];

// get a ship
const ship = new Ship(SHIP_SIZE, canv.width / 2, canv.height / 2);

// get some roids
let num_roids = ROID_NUM;
for (let i = 0; i < num_roids; i++) {
    const newPos = getSafeRoidLocation(canv.width, canv.height, ship.pos, SAFE_ZONE);
    const r = new Roid(
        ROID_SIZES[0], 0, randomNumVertices(), newPos.x, newPos.y, randomHeading(), ROID_SPEED / FPS
    );
    roids.push(r);
}

// add event handlers
document.addEventListener("keydown", keyDownHelper);
document.addEventListener("keyup", keyUpHelper);

function keyDownHelper(e) {
    keyDown(e, ship, ROT_RATE / FPS);
}

function keyUpHelper(e) {
    keyUp(e, ship);
}

// main game update event loop
function update() {
    // break if not running
    if (!running) return;

    // draw blank canvas;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);

    // rotate ship, apply thrust and move
    ship.heading += ship.rotation;
    ship.adjustSpeed(THRUST / FPS, FRICTION, MAX_THRUST / FPS);
    ship.adjustPosition(canv.width, canv.height);

    // move bullets and check if firing
    ship.tryFiring(BULLET_SPEED / FPS, BULLET_DELAY, BULLET_DISTANCE);
    ship.moveBullets(canv.width, canv.height);

    // move roids
    roids.forEach((roid) => { roid.move(canv.width, canv.height); });

    // check for bullet hitting roid
    if (roids.length > 0 && ship.bullets.length > 0) {
        // iterate through roids backwards so we can pop them reliably
        for (let i = roids.length - 1; i >= 0; i--) {
            // iterate through bullets backwards so we can pop them reliably
            for (let j = ship.bullets.length - 1; j >= 0; j--) {
                if (distance(roids[i].pos, ship.bullets[j].pos) <= (roids[i].radius + 2)) {
                    if (roids[i].sizeClass < (ROID_SIZES.length - 1) ) {
                        const newSizeClass = roids[i].sizeClass + 1;
                        const newRoidA = roids[i].spawn(
                            ROID_SIZES[newSizeClass], newSizeClass, randomNumVertices(), 45, 1.75
                        );
                        const newRoidB = roids[i].spawn(
                            ROID_SIZES[newSizeClass], newSizeClass, randomNumVertices(), -45, 1.75
                        );
                        roids.push(newRoidA);
                        roids.push(newRoidB);
                    }
                    score += ROID_SCORES[roids[i].sizeClass];
                    roids.splice(i, 1);
                    ship.bullets.splice(j, 1);
                    break;
                }
            }
        }
    }
    
    // check for roid hitting ship
    const checkPoints = ship.collisionCheckpoints();
    roids.forEach((roid) => {
        checkPoints.forEach((point) => {
            if (distance(roid.pos, point) <= roid.radius) {
                running = false;
            }
        });
    });

    // re-draw ship and bullets
    ship.draw(ctx);
    ship.drawBullets(ctx);

    // re-draw draw roids
    roids.forEach((roid) => { roid.draw(ctx); });

    // updaate score on screen
    scoreBox.innerText = `Score: ${score}`;

}

//game loop
setInterval(update, 1000 / FPS);
