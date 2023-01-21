const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const bgImg = document.createElement('img');
bgImg.src = "https://images.unsplash.com/photo-1561016444-14f747499547?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Z3JlZW4lMjBjb2xvcnxlbnwwfHwwfHw%3D&w=1000&q=80";

const data = {
    myTank: {
        x: 1,
        y: canvas.height / 2,
        height: 5,
        width: 10,
        projectiles: 44,

        the_fire: [],
        deleteMy:false,

        xDeltaR: 0,
        xDeltaL: 0,
        yDeltaD: 0,
        yDeltaU: 0,

        draw() {
            context.fillStyle ='#00FFFF'
            
            if(!this.deleteMy){
                context.fillRect(this.x, this.y, this.width, this.height);
            }else{
                location.href = location.href;;
            }
        },
        update() {
            if (this.y >= canvas.height-this.height) {
                this.yDeltaD = 0;    
            }
            
            if (this.y <= 0) {
                this.yDeltaU=0;
            }
    
            if (this.x >= canvas.width-this.width) {
                this.xDeltaR = 0;
            }
        
            if (this.x <= 0) {
                this.xDeltaL = 0;
            }

            this.x += this.xDeltaR;
            this.y += this.yDeltaD;
            this.x += this.xDeltaL;
            this.y += this.yDeltaU; 
        },

        theFire:function(){
            const theFire = new TheFire(3, this.x + this.width, this.y + this.height / 2);

            this.the_fire.push(theFire);

            this.projectiles--;
            if(this.projectiles<=0){
                setTimeout(()=>{
                    this.projectiles=24;
                },5000)
            }
        }
    },
    tank: [],
}

document.addEventListener('keydown', function(e){
    if (e.code === 'ArrowDown') {   
        data.myTank.yDeltaD = 0.7;
    }else if (e.code === 'ArrowUp') {
        data.myTank.yDeltaU = -0.7;
    }else if (e.code === 'ArrowRight') {
        data.myTank.xDeltaR = 0.7;
    }else if (e.code === 'ArrowLeft') {
        data.myTank.xDeltaL = -0.5;
    } else if (e.code ==='Space'){
        data.myTank.theFire();
    }
})

document.addEventListener('keyup', function(e){
    data.myTank.xDeltaR=0;
    data.myTank.yDeltaD=0;
    data.myTank.xDeltaL = 0;
    data.myTank.yDeltaU = 0;
})

loop();

function Tank() {
    this.width = 10;
    this.height = 5;
    this.deleteMy=false;

    this.x = canvas.width - this.width-1;
    this.y = random(0, canvas.height - this.height);

    this.xDalta = -random(0.3,0.7);
    this.yDelta = random(0.5, 0.7);

    this.the_fire=[];

    this.update = function () {
        if (this.y > canvas.height - this.height || this.y < 0) {
            this.yDelta *= -1;
        }
        if (this.x <= 0-this.width) {

            location.href = location.href;
            
        }
        this.x+=this.xDalta;
        this.y+=this.yDelta;
    }

    this.draw = function () {
        context.fillStyle ='#FF0000';
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    this.theFire=function(){
        const theFire=new TheFire(-3,this.x, this.y+this.height/2);
        const self=this;
        self.the_fire.push(theFire);
        
    }

}

function TheFire(delta,x,y){
    this.xDalta=delta;
    this.x=x;
    this.y=y;
    this.r=0.1;
    this.deleteMy=false;
    this.update=function() {
        this.x += this.xDalta;
        if(this.x<=0 || this.x>=canvas.width){
            this.deleteMy=true;
        }
    }
    this.draw=function() {
        context.fillStyle='black'
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        context.fill();
    }
}

function update() {
    data.myTank.update();
    data.myTank.the_fire.forEach(function(v){
            v.update();
        });

    if (data.tank.length !== 0) {
        data.tank.forEach(function (v) {
            v.update();
        })

        data.tank.forEach(function (v) {
            v.the_fire.forEach(function (v) {
                v.update();
            })
        })
    }
    data.myTank.the_fire.forEach(function(v){
        data.tank.forEach(function(t){
            if(intersect(t,v)){
                v.deleteMy=true;
                t.deleteMy=true;
            }
        })
    })
    data.tank.forEach(function(t){
        t.the_fire.forEach(function (v) {
            if (intersect(data.myTank, v)) {
                v.deleteMy = true;
                data.myTank.deleteMy = true;
            }
        })
    });
   
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    data.myTank.draw();

    if(data.myTank.the_fire.length!==0){
        data.myTank.the_fire
        .filter(function(v){
            return !v.deleteMy
        })
        .forEach(function (v) {
            v.draw();
        })
    }

    setInterval(function(){
        const tank=new Tank();
        if(data.tank.filter((v)=>!v.deleteMy).length<=5){
            data.tank.push(tank);
        }
    },3000);

    if(data.tank.length!==0){
        data.tank
        .filter(function(v){
            return !v.deleteMy;
        })
        .forEach(function(v){
            let f=v.the_fire.filter(function(v){
                return !v.deleteMy
            })
            if(f.length<=10){
                v.theFire();
            }
            
            v.draw();
        })
        
        data.tank.
        forEach(function (v) {
            v.the_fire
            .filter(function(v){
                return !v.deleteMy;
            })
            .forEach(function (v) {
                v.draw();
            })
        })
    }
    
}

function loop() {
    requestAnimationFrame(loop);
    draw();
    update();
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function intersect(rect1, rect2) {
    const x = Math.max(rect1.x, rect2.x);
    const num1 = Math.min(rect1.x + rect1.width, rect2.x + rect2.r);
    const y = Math.max(rect1.y, rect2.y);
    const num2 = Math.min(rect1.y + rect1.height, rect2.y + rect2.r);

    return (num1 >= x && num2 >= y);
}
