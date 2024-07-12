import CanvasOption from './js/CanvasOption.js';
import Particle from './js/Particle.js';
import Tail from './js/Tail.js';
import { randomNumBetween,hypotenuse } from './js/utils.js'
import Spark from './js/Spark.js';

class Canvas extends CanvasOption{
    constructor(){
        super();

        this.particles = [];
        this.tails=[];//관리하기 위한 배열
        this.sparks = [];//스파크 배열
    }
    //캔버스 초기화
    init() {
        this.canvasWidth = innerWidth;
        this.canvasHeight=innerHeight
        this.canvas.width = this.canvasWidth * this.dpr;
        this.canvas.height = this.canvasHeight * this.dpr;
        this.ctx.scale(this.dpr, this.dpr);

        this.canvas.style.width = this.canvasWidth + 'px';
        this.canvas.style.height = this.canvasHeight + 'px';

        this.createParticle();
    }
    createTail(){
        const x = randomNumBetween(this.canvasWidth * 0.2,this.canvasWidth *0.8);
        const vy = this.canvasHeight * randomNumBetween(0.01,0.015) * -1;
        const colorDeg = randomNumBetween(0,360);
        this.tails.push(new Tail(x, vy, colorDeg))

    }

    createParticle(x, y, colorDeg){
        const PARTICLE_NUM = 400
        for(let i = 0; i<PARTICLE_NUM; i++){
            const r = randomNumBetween(2,100) * hypotenuse(innerWidth,innerHeight) *0.0001; //범위 확장
            const angle = Math.PI / 180 * randomNumBetween(0,360);//degree가 아니라 radian 단위임
            //속도
            const vx = r* Math.cos(angle); //원형 좌표 수식
            const vy = r* Math.sin(angle); //원형 좌표 수식
            const opacity = randomNumBetween(0.6,0.9)//투명도도 랜덤으로
            const _colorDeg = randomNumBetween(-20,20) + colorDeg;
            this.particles.push(new Particle(x,y,vx,vy,opacity, _colorDeg))
        }
    }

    render(){
        let now, delta;
        let then = Date.now();

        const frame = () => {
            requestAnimationFrame(frame);
            //------------fps
            now = Date.now();
            delta = now - then
            if (delta < this.interval) return
            this.ctx.fillStyle = this.bgColor + '40'; //#0000000에 10을 붙이는데(#00000010) rgb값에서 알파값처럼 만들 수 있다. 
            this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)//새로 캔버스 덮어 씌움
            //파티클 터지면 배경색 밝게
            this.ctx.fillStyle = `rgba(255,255,255,${this.particles.length /50000})`;
            this.ctx.fillRect(0,0,this.canvasWidth,this.canvasHeight)

            if (Math.random() < 0.03) this.createTail();//꼬리 생성

            this.tails.forEach((tail, index) => {
                tail.update()
                tail.draw()

                for(let i =0; i< Math.round(-tail.vy * 0.5);i++){
                    const vx = randomNumBetween(-5,5) * 0.05;
                    const vy = randomNumBetween(-5,5) * 0.05;
                    const opacity = Math.min(-tail.vy, 0.5);//양수로 바꺼준 후 update 함수안에서 0.5이상으로 넘어가는 값은 최대 0.5로 해주고 속도가 0.5이하로 떨어지는 색은  그 값만큼 opacity 적용 
                    this.sparks.push(new Spark(tail.x, tail.y, vx, vy, opacity, tail.colorDeg))
                }

                if (tail.vy > -0.7) {
                    this.tails.splice(index, 1)
                    this.createParticle(tail.x, tail.y, tail.colorDeg)
                }
            })

            this.particles.forEach((particle, index) => {
                particle.update();
                particle.draw();

                if(Math.random() < 0.1){
                    this.sparks.push(new Spark(particle.x, particle.y, 0, 0, 0.3,45))
                }
                

                if (particle.opacity < 0) this.particles.splice(index, 1)
            })

            this.sparks.forEach((spark,index) =>{
                spark.update()
                spark.draw()

                if (spark.opacity < 0) this.sparks.splice(index, 1)
            })

            then = now - (delta % this.interval)
            //------------
        }
        requestAnimationFrame(frame);
    }

}

const canvas = new Canvas()

window.addEventListener("load",()=>{
    canvas.init();
    canvas.render();
})

window.addEventListener("resize",()=>{
    canvas.init();
})