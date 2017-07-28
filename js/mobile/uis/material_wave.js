class Wave{
    append_canvas(element){
        var canvas = document.createElement('canvas');
        element.appendChild(canvas);
        canvas.style.width ='100%';
        canvas.style.height='100%';
        canvas.width  =  canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    press(event){

        this.element = event.currentTarget.getElementsByTagName('canvas')[0];
        this.context = this.element.getContext('2d');
        this.color = this.element.parentElement.dataset.color || '#d4d4d0';
        var speed =  this.element.parentElement.dataset.speed || 30;
        this.speed = parseInt(speed)

        this.radius = 0;
        //centerX = event.offsetX;
        //centerY = event.offsetY;
        var cx = event.clientX;
        var cy = event.clientY;
        //var cx =event.changedTouches[0].clientX
        //var cy = event.changedTouches[0].clientY
        var pos = map_from_client(this.element,cx,cy)
        this.centerX=pos[0]
        this.centerY=pos[1]

        this.context.clearRect(0, 0, this.element.width, this.element.height);
        this.draw()
    }
    draw(){
        this.context.beginPath();
        this.context.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI, false);
        this.context.fillStyle = this.color;
        this.context.fill();
        this.radius += this.speed;
        if (this.radius < this.element.width) {
            var self=this
            requestAnimFrame(function(){self.draw()});
        }else{
            this.context.clearRect(0, 0, this.element.width, this.element.height);
        }
    }
}
var requestAnimFrame = function () {
    return (
        window.requestAnimationFrame       ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
} ()


$(document).on('click','.material-wave',function(e){
    var wave=new Wave()
    if($(e.currentTarget).find('canvas').length==0){
        wave.append_canvas(e.currentTarget)
    }
    wave.press(e)

})


window.material_wave_init=function(){
    var canvas = {}
    var centerX = 0
    var centerY = 0
    var color = ''
    var speed= 30
    var containers = document.getElementsByClassName('material-wave')
    var context = {}
    var element = {}
    var radius = 0

    var requestAnimFrame = function () {
        return (
            window.requestAnimationFrame       ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            }
        );
    } ()

    var init = function () {
        containers = Array.prototype.slice.call(containers);
        for (var i = 0; i < containers.length; i += 1) {
            canvas = document.createElement('canvas');
            //canvas.addEventListener('click', press, false);

            containers[i].addEventListener('touchstart', press, false);
            //containers[i].insertBefore(canvas,containers[i].childNodes[0]);
            containers[i].appendChild(canvas);
            canvas.style.width ='100%';
            canvas.style.height='100%';
            canvas.width  =  canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
    }
    var append_canvas=function(element){
        var canvas = document.createElement('canvas');
        element.appendChild(canvas);
        canvas.style.width ='100%';
        canvas.style.height='100%';
        canvas.width  =  canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    var press = function (event) {
        element = event.currentTarget.getElementsByTagName('canvas')[0];
        color = element.parentElement.dataset.color || '#d4d4d0';
        speed =  element.parentElement.dataset.speed || 20;
        speed = parseInt(speed)
        context = element.getContext('2d');
        radius = 0;
        //centerX = event.offsetX;
        //centerY = event.offsetY;
        var cx = event.offsetX;
        var cy = event.offsetY;
        //var cx =event.changedTouches[0].clientX
        //var cy = event.changedTouches[0].clientY
        var pos = map_from_client(element,cx,cy)
        centerX=pos[0]
        centerY=pos[1]

        context.clearRect(0, 0, element.width, element.height);
        draw();
    }

    var draw = function () {
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.fill();
        radius += speed;
        if (radius < element.width) {
            requestAnimFrame(draw);
        }else{
            context.clearRect(0, 0, element.width, element.height);
        }
    };


    //init()
}

function map_from_client(canvas,cx,cy){
    var box = canvas.getBoundingClientRect()
    var mouseX = (cx - box.left) * canvas.width / box.width
    var mouseY = (cy - box.top) * canvas.height / box.height
    return [mouseX,mouseY]
}
