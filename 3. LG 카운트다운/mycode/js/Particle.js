import { randomNumBetween } from "./utils.js";

export default class Particle {
    constructor(){
        this.rFriction = randomNumBetween(0.95, 1.01)//r에 관한 마찰 1보다 크면 가속도
        this.rAlpha = randomNumBetween(0,5)
        this.r = innerHeight / 4 ;
        this.angleFriction =randomNumBetween(0.97, 0.99)//angle에 관한 마찰 1보다 크면 가속도
        this.angleAlpha = randomNumBetween(1,2)
        this.angle = randomNumBetween(0,360);
        this.opacity = randomNumBetween(0.2,1)
    }
    update(){
        this.rAlpha *= this.rFriction //점점 0에 수렴
        this.angleAlpha *= this.angleFriction; // 점점 0에 수렴
        this.r += this.rAlpha;
        this.angle += this.angleAlpha;
        //r과 angle 두개 값을 이용해서 대각선 방향으로 흩어지게
        this.x = innerWidth / 2 + (this.r * Math.cos(Math.PI/180 * this.angle));
        this.y = innerHeight / 2+ (this.r * Math.sin(Math.PI/180 * this.angle));
        this.opacity -= 0.003
    }
    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
        ctx.fill()
        ctx.closePath();
    }
}