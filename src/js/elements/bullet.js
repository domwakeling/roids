class Bullet {
    constructor(x, y, heading, speed) {
        this.x = x;
        this.y = y;
        this.heading = heading;
        this.speed = speed;
    }

    angle() {
        return this.heading * Math.PI / 180;
    }

    move(maxWidth, maxHeight) {
        this.x += this.speed * Math.cos(this.angle());
        this.y -= this.speed * Math.sin(this.angle());
        if (this.x < 0 || this.x > maxWidth || this.y < 0 || this.y > maxHeight) {
            return true;
        } else {
            return false;
        }
    }

    draw(context) {
        context.fillStyle = "navajowhite";
        context.beginPath();
        context.arc(this.x, this.y, 2, 0, 2 * Math.PI);
        context.fill();
    }
}

export default Bullet;