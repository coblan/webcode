
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
            canvas.addEventListener('click', press, false);
            containers[i].appendChild(canvas);
            canvas.style.width ='100%';
            canvas.style.height='100%';
            canvas.width  =  canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
    }

    var press = function (event) {
        color = event.toElement.parentElement.dataset.color || '#d4d4d0';
        speed =  event.toElement.parentElement.dataset.speed || 30;
        speed = parseInt(speed)
        element = event.toElement;
        context = element.getContext('2d');
        radius = 0;
        centerX = event.offsetX;
        centerY = event.offsetY;
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

    init()
}

