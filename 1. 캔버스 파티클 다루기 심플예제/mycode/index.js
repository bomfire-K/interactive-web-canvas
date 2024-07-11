const canvas = document.querySelector("canvas");
console.log(canvas);

const ctx = canvas.getContext("2d");//우리가 그릴 도구
console.log(window.devicePixelRatio);
const dpr = window.devicePixelRatio;

let canvasWidth;
let canvasHeight;

const randomNumBetween = (min, max) => {
    return Math.random() * (max - min + 1) + min;
}

let particles;


let interval = 1000 / 60 ; //60fps 1초에 60번
let now, delta
let then = Date.now();

const feGaussianBlur = document.querySelector("feGaussianBlur");
const feColorMatrix = document.querySelector("feColorMatrix");
const controls = new function(){
    this.blurValue = 40;
    this.alphaChannel = 100;
    this.alpahOffset = -23;
    this.acc = 1.03;
}

let gui = new dat.GUI();
const f1 = gui.addFolder("Gooey Effect");
f1.open();
f1.add(controls, 'blurValue', 0, 100).onChange(value => {
    feGaussianBlur.setAttribute("stdDeviation",value);
})
f1.add(controls, 'alphaChannel', 1, 200).onChange(value => {
    feColorMatrix.setAttribute("values",`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${value} ${controls.alpahOffset}`);
})
f1.add(controls, 'alpahOffset', -40, 40).onChange(value => {
    feColorMatrix.setAttribute("values",`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 100 ${value} ${controls.alphaChannel}`);
})
const f2 = gui.addFolder("particle Property");
f2.open();
f2.add(controls, 'acc', 1, 1.5,0.01).onChange(value => {
    particles.forEach(particle =>{
        particle.acc = value;
    })
})
//애니메이션은 프레임마다 캐릭터 위치를 변경(캠퍼스 애니메이션의 핵심)
//그린 원을 파티클이라고 생각했을때 프레임마다 원의 시작 액수, Y위치를 다른곳으로 옮겨주면 종합적으로 실행시킬때 하나의 애니메이션 이펙트를 만들 수 있음

//class를 만들어서 클래스 인스턴스 마다 파티클을 만든다.
class Particle{
    constructor(x,y,radius,vy){//인스턴스 객체 생성, 초기화 필수적인 메소드
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vy = vy;
        this.acc = 1.03;//가속도
    }
    update(){
        this.vy *= this.acc;//가속도
        this.y += this.vy;
    }
    draw() {
        ctx.beginPath();//나 그리기 시작할게~하고 알리는 메소드
        //단위가 deg가 아니라 radian이기 때문에 Math.PI / 180 * 360으로 계산해주어야 한다.
        //각도 1도는 3.14(pi)/180과 같다.
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI / 180 * 360)
        ctx.fillStyle = "orange"//색상 채우기
        ctx.fill()//색상 채우기
        // ctx.stroke()//선 그리기
        ctx.closePath();//끝났다 알리는 메소드
    }
}

function init() {
    canvasWidth = innerWidth;
    canvasHeight = innerHeight;

    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';
    canvas.width = canvasWidth * dpr;//dpr이 2 이상인 코드에서 맞춰주면 해상도가 더 높아짐
    canvas.height = canvasHeight * dpr;
    ctx.scale(dpr, dpr);
    particles = [];
    
    const TOTAL = canvasWidth / 10;
    for (let i = 0; i < TOTAL; i++) {
        const x = randomNumBetween(0, canvasWidth)
        const y = randomNumBetween(0, canvasHeight)
        const radius = randomNumBetween(50, 100);
        const vy = randomNumBetween(1, 5)
        const particle = new Particle(x, y, radius, vy);
        particles.push(particle);
    }

}




function animate(){
    window.requestAnimationFrame(animate);//애니메이트 함수를 요청하고 매 프레임마다 무한으로 실행되는 함수 만들어짐
    //window.requestAnimationFrame 효율적 사용 방법 윈도우 주사율을 기반으로 회수가 찍힘(게이밍 모니터 144hz주사율 가지는데 1초에 144번 실행됨, 사무용 모니터 60hz)
    now = Date.now();
    delta = now - then;

    if(delta < interval) return
    
    ctx.clearRect(0,0,canvasWidth,canvasHeight);//매 프레임마다 전체화면을 지우고 새로운 파티클 드로우
    
    particles.forEach(particle =>{
        particle.update();
        particle.draw();
        if (particle.y - particle.radius > canvasHeight) {
            particle.x = randomNumBetween(0, canvasWidth)
            particle.radius = randomNumBetween(50, 100);
            particle.vy = randomNumBetween(1, 5);
            particle.y = -particle.radius;
        }
    })

    then = now - (delta % interval)
}

window.addEventListener("load",()=>{
    init();
    animate();
})


window.addEventListener("resize",()=>{
    init();
})