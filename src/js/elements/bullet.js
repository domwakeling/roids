class Bullet {
    constructor(x, y, heading, speed, maxDistance) {
        this.pos = { x, y };
        this.heading = heading;
        this.speed = speed;
        this.distance = 0;
        this.maxDistance = maxDistance;
    }

    angle() {
        return this.heading * Math.PI / 180;
    }

    move(maxWidth, maxHeight) {
        this.pos.x += this.speed * Math.cos(this.angle());
        this.pos.y -= this.speed * Math.sin(this.angle());
        if (this.pos.x < 0) {
            this.pos.x += maxWidth;
        } else if (this.pos.x > maxWidth) {
            this.pos.x -= maxWidth;
        }
        if (this.pos.y < 0) {
            this.pos.y += maxHeight;
        } else if (this.pos.y > maxHeight) {
            this.pos.y -= maxHeight;
        }
        this.distance += this.speed;
        if (this.distance > this.maxDistance) {
            return true;
        }
        return false;
    }

    draw(context) {
        context.fillStyle = "navajowhite";
        context.beginPath();
        context.arc(this.pos.x, this.pos.y, 2, 0, 2 * Math.PI);
        context.fill();
    }
}

export default Bullet;