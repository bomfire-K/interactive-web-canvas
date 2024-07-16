import { hexToRgb, randomNumBetween } from "./utils.js";
export default class Particle{
    constructor(x,y,deg = 0, colors,shapes,spread = 30){
        this.angle = Math.PI / 180 * randomNumBetween(deg-spread,deg+spread)
        this.radius = randomNumBetween(30,100)
        this.x = x * innerWidth;
        this.y = y * innerHeight;

        this.vx = this.radius * Math.cos(this.angle);
        this.vy = this.radius * Math.sin(this.angle);

        this.friction = 0.89//힘(마찰)
        this.gracity = 0.5//중력

        this.widht = 12;
        this.height = 12;

        this.opacity = 1;

        this.widthDelta = randomNumBetween(0,360);
        this.heightDelta = randomNumBetween(0,360);

        this.rotation = randomNumBetween(0,360)
        this.rotationDelta = randomNumBetween(-1,1)//시계 반시계 방향 정함
        this.colors = colors || ['#FF577F', '#FF884B', '#FFD384', '#FFF9B0']
        this.color = hexToRgb(this.colors[Math.floor(randomNumBetween(0,this.colors.length))])
        this.shapes = shapes || ['circle','square'];
        this.shape = this.shapes[Math.floor(randomNumBetween(0,this.shapes.length ))]

    }
    update(){
        this.vy += this.gracity;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;
        this.opacity -= 0.007;

        this.widthDelta +=2
        this.heightDelta +=2

        this.rotation += this.rotationDelta
    }
    drawSquare(ctx){
        ctx.fillRect(
            this.x,
            this.y,
            this.widht * Math.cos(Math.PI / 180 * this.widthDelta),
            this.height * Math.sin(Math.PI / 180 * this.heightDelta))
    }
    drawCircle(ctx){
        ctx.beginPath()
        ctx.ellipse(
            this.x,
            this.y,
            //양수여야함
            //사각형보다 큰데 width, height이 반지름을 기준으로 해서 그럼 (결국 입력하는 widht가 반지름이 되기때문에 서클이 2배 더 크게 보인다.)
            Math.abs(this.widht * Math.cos(Math.PI / 180 * this.widthDelta))/2,
            Math.abs(this.height * Math.sin(Math.PI / 180 * this.heightDelta))/2,
        0,
        0,
        Math.PI * 2
        )
        ctx.fill()
        ctx.closePath()
    }
    draw(ctx){
        ctx.translate(this.x+this.widht*2, this.y+this.height*2)
        ctx.rotate(Math.PI /180 * this.rotation)
        ctx.translate(-this.x-this.widht*2, -this.y-this.height*2)
        ctx.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.opacity})`;
        
        switch(this.shape){
            case 'square' : this.drawSquare(ctx); break;
            case 'circle' : this.drawCircle(ctx); break;

        }
        
        ctx.resetTransform()
    }
}