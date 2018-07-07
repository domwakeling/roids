class Bullet {
    constructor(x, y, heading, speed) {
        this.pos = { x, y };
        this.heading = heading;
        this.speed = speed;
    }

    angle() {
        return this.heading * Math.PI / 180;
    }

    move(maxWidth, maxHeight) {
        this.pos.x += this.speed * Math.cos(this.angle());
        this.pos.y -= this.speed * Math.sin(this.angle());
        if (this.pos.x < 0 || this.pos.x > maxWidth || this.pos.y < 0 || this.pos.y > maxHeight) {
            return true;
        } else {
            return false;
        }
    }

    draw(context) {
        context.fillStyle = "navajowhite";
        context.beginPath();
        context.arc(this.pos.x, this.pos.y, 2, 0, 2 * Math.PI);
        context.fill();
    }
}

export default Bullet;