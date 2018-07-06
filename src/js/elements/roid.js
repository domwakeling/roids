class Roid {
    constructor(radius, sizeClass, vertices, x, y, heading, speed) {
        this.radius = radius;
        this.sizeClass = sizeClass;
        this.vertices = vertices;
        this.x = x;
        this.y = y;
        this.heading = heading;
        this.speed = speed;
        this.offsets = this.generateOffsets();
    }

    generateOffsets() {
        let offsets = [];
        for (let i = 0; i < this.vertices; i++) {
            let x = this.generateOffset();
            let y = this.generateOffset();
            offsets.push({x, y});
        }
        return offsets;
    }

    generateOffset() {
        return Math.floor(Math.random() * 3);
    }

    angle() {
        return this.heading * Math.PI / 180;
    }

    move(maxWidth, maxHeight) {
        this.x += this.speed * Math.cos(this.angle());
        this.y += this.speed * Math.sin(this.angle());
        if (this.x < 0 - this.radius) this.x = maxWidth + this.radius;
        if (this.y < 0 - this.radius) this.y = maxHeight + this.radius;
        if (this.x > maxWidth + this.radius) this.x = 0 - this.radius;
        if (this.y > maxHeight + this.radius) this.y = 0 - this.radius;
    }

    draw(context) {
        context.strokeStyle = "cornsilk";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(
            this.x + this.radius * Math.cos(0) + this.offsets[0].x,
            this.y - this.radius * Math.sin(0) + this.offsets[0].y
        );
        for (let i = 0; i < this.vertices; i++) {
            const angle = ( i * 360 / this.vertices) * Math.PI / 180;
            context.lineTo(
                this.x + this.radius * Math.cos(angle) + this.offsets[i].x,
                this.y - this.radius * Math.sin(angle) + this.offsets[i].y
            );
        }
        context.closePath();
        context.stroke();
    }

    spawn(radius, sizeClass, vertices, headingAdjust, speedFactor) {
        const angleA = (this.heading + headingAdjust) * Math.PI / 180;
        const newRoid = new Roid(
            radius,
            sizeClass,
            vertices,
            this.x + this.radius * 0.3 * (Math.cos(angleA) + Math.sin(angleA)),
            this.y + this.radius * 0.3 * (Math.sin(angleA) - Math.cos(angleA)),
            this.heading + headingAdjust,
            this.speed * speedFactor
        );
        return newRoid;
    }
}

export default Roid