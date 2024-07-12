import CanvasOption from './CanvasOption.js'
export default class Particle extends CanvasOption{
    constructor(x,y,vx,vy,opacity,colorDeg){
        super();//항상 실행시켜줘야 부모값에 접근 가능
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.opacity = opacity;
        this.gravity = 0.12; //중력
        this.friction = 0.93 //마찰, 점점 느려지고 0에 수렴
        this.colorDeg = colorDeg;
    }

    update(){
        this.vy += this.gravity //중력 
        this.vx *= this.friction;//마찰력 곱해주기
        this.vy *= this.friction;//마찰력 곱해주기

        this.x += this.vx;
        this.y += this.vy;
        
        this.opacity -= 0.015;
    }
    draw(){
        this.ctx.fillStyle = `hsla(${this.colorDeg}, 100%, 65%, ${this.opacity})`;
        //기본 원 드로우 로직
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 2, 0, Math.PI * 2)
        this.ctx.fill();
        this.ctx.closePath();
    }
}