import Bullet from "./bullet.js";

class Ship {
    constructor(size, x, y) {
        this.size = size;
        this.pos = { x, y }; // pos = position (of centre of rotation)
        this.origPos = { x, y } // for ship reset
        this.heading = 90; // start facing upwards,
        this.rotation = 0;
        this.thrust = {
            on: false,
            x: 0,
            y: 0
        }
        this.firing = {
            on: false,
            available: true
        }
        this.bullets = [];
    }

    angle(offset = 0) {
        return (this.heading + offset) * Math.PI / 180;
    }

    speed() {
        return Math.sqrt( Math.pow(this.thrust.x, 2) + Math.pow(this.thrust.y, 2) );
    }

    points() {
        return [
            {
                x: this.pos.x + 0.9 * this.size * Math.cos(this.angle()),
                y: this.pos.y - 0.9 * this.size * Math.sin(this.angle())
            },
            {
                x: this.pos.x - 0.65 * this.size * (Math.cos(this.angle()) + Math.sin(this.angle())),
                y: this.pos.y + 0.65 * this.size * (Math.sin(this.angle()) - Math.cos(this.angle()))
            },
            {
                x: this.pos.x - 0.25 * this.size * Math.cos(this.angle()),
                y: this.pos.y + 0.25 * this.size * Math.sin(this.angle())
            },
            {
                x: this.pos.x - 0.65 * this.size * (Math.cos(this.angle()) - Math.sin(this.angle())),
                y: this.pos.y + 0.65 * this.size * (Math.sin(this.angle()) + Math.cos(this.angle()))
            }
        ];
    }

    // collision checkPoints on each vertex of the ship + the mid-point of each longer side
    collisionCheckpoints() {
        const check = this.points();
        const addOne = {
            x: (check[0].x + check[1].x) / 2,
            y: (check[0].y + check[1].y) / 2,
        }
        const addTwo = {
            x: (check[0].x + check[3].x) / 2,
            y: (check[0].y + check[3].y) / 2,
        }
        check.push(addOne);
        check.push(addTwo);
        return check;
    }

    adjustSpeed(thrustSpeed, friction, maxSpeed) {
        this.thrust.x = this.thrust.x * friction;
        this.thrust.y = this.thrust.y * friction;
        if(this.thrust.on) {
            this.thrust.x += thrustSpeed * Math.cos(this.angle());
            this.thrust.y -= thrustSpeed * Math.sin(this.angle());
        }
        if (this.speed() > maxSpeed) {
            this.thrust.x = this.thrust.x * maxSpeed / this.speed();
            this.thrust.y = this.thrust.y * maxSpeed / this.speed();
        }
    }

    adjustPosition(maxWidth, maxHeight) {
        this.pos.x += this.thrust.x;
        this.pos.y += this.thrust.y;
        if (this.pos.x < 0 - this.size/2) this.pos.x = maxWidth + this.size/2;
        if (this.pos.y < 0 - this.size/2) this.pos.y = maxHeight + this.size/2;
        if (this.pos.x > maxWidth + this.size/2) this.pos.x = 0 - this.size/2;
        if (this.pos.y > maxHeight + this.size/2) this.pos.y = 0 - this.size/2;
    }

    moveBullets(maxWidth, maxHeight) {
        if (this.bullets.length > 0) {
            for (let i = this.bullets.length - 1; i >= 0; i--) {
                if (this.bullets[i].move(maxWidth, maxHeight)) {
                    this.bullets.splice(i, 1);
                }
            }
        }
    }

    tryFiring(speed, delay, maxDistance) {
        if (this.firing.on && this.firing.available) {
            const bullet = new Bullet(
                this.pos.x + this.size * 1.3 * Math.cos(this.angle()),
                this.pos.y - this.size * 1.3 * Math.sin(this.angle()),
                this.heading,
                speed + this.speed(),
                maxDistance
            )
            this.bullets.push(bullet);
            this.firing.available = false;
            setTimeout( () => {this.firing.available = true }, delay );
        }
    }

    draw(context) {

        context.strokeStyle = "white";
        context.lineWidth = this.size / 20;
        const currPoints = this.points();
        context.beginPath();
        context.moveTo( // nose of the ship
            currPoints[0].x, currPoints[0].y
        );
        context.lineTo( // rear left
            currPoints[1].x, currPoints[1].y
        );
        context.lineTo( // bottom centre
            currPoints[2].x, currPoints[2].y
        )
        context.lineTo( // rear right
            currPoints[3].x, currPoints[3].y
        );
        context.closePath();
        context.stroke();        

        if (this.thrust.on) {
            context.strokeStyle = "steelblue";
            context.lineWidth = this.size / 5;
            context.beginPath();
            context.moveTo(
                this.pos.x - 0.65 * this.size * (Math.cos(this.angle()) + Math.sin(this.angle()))
                        - 0.1 * this.size * (Math.cos(this.angle()) - Math.sin(this.angle())),
                this.pos.y + 0.65 * this.size * (Math.sin(this.angle()) - Math.cos(this.angle()))
                        + 0.1 * this.size * (Math.sin(this.angle()) + Math.cos(this.angle()))
            );
            context.lineTo( // bottom centre
                this.pos.x - 0.25 * this.size * Math.cos(this.angle())
                        + 0.3 * this.size * Math.cos(this.angle(-180)),
                this.pos.y + 0.25 * this.size * Math.sin(this.angle())
                        + 0.3 * this.size * Math.sin(this.angle())
            );
            context.lineTo( // rear right
                this.pos.x - 0.65 * this.size * (Math.cos(this.angle()) - Math.sin(this.angle()))                    
                        - 0.1 * this.size * (Math.cos(this.angle()) + Math.sin(this.angle())),
                this.pos.y + 0.65 * this.size * (Math.sin(this.angle()) + Math.cos(this.angle()))
                        + 0.1 * this.size * (Math.sin(this.angle()) - Math.cos(this.angle()))
            );
            context.stroke();
        }
    }

    drawBullets(context) {
        this.bullets.forEach( bullet => {bullet.draw(context)});
    }
}

export default Ship