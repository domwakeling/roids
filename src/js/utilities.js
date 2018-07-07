function distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function getSafeRoidLocation(canvasWidth, canvasHeight, shipPos, safeDistance) {
    let newPos = {
        x: 0,
        y: 0
    };
    while (true) {
        newPos.x = Math.floor(Math.random() * canvasWidth);
        newPos.y = Math.floor(Math.random() * canvasHeight);
        if (distance(newPos, shipPos) > safeDistance) {
            return newPos;
        }
    }
}

function keyDown(e, ship, rotationRate) {
    switch (e.keyCode) {
        case 32:
            ship.firing.on = true;
            break;
        case 38:
            ship.thrust.on = true;
            break;
        case 37:
            ship.rotation = rotationRate;
            break;
        case 39:
            ship.rotation = - rotationRate;
            break;
    }
}

function keyUp(e, ship) {
    switch (e.keyCode) {
        case 32:
            ship.firing.on = false;
            break;
        case 37:
            ship.rotation = 0;
            break;
        case 38:
            ship.thrust.on = false;
            break;
        case 39:
            ship.rotation = 0;
            break;
    }
}

function randomHeading() {
    return Math.floor(Math.random() * 360);
}

function randomNumVertices() {
    return Math.floor(Math.random() * 10) + 20;
}

export {
    distance,
    getSafeRoidLocation,
    keyDown,
    keyUp,
    randomHeading,
    randomNumVertices
}