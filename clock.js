window.onload = function() {
    var clk = document.getElementById("clock");
    var ctx = clk.getContext("2d");
    var width = ctx.canvas.width; //获取html里面canvas标签的width属性
    var height = ctx.canvas.height; ////获取html里面canvas标签的height属性
    var r = width/2;  //表盘半径
    var rem = width/200; //设置的线条基本长度单位，便于缩放时不影响钟表效果

    //表盘（圆形）背景的绘制
    function drawBackground(){
        ctx.save(); // 储存当前canvas状态，便于后续的重绘
        ctx.translate(r,r); // 将圆点移动至画布中央位置
        ctx.beginPath();  //开始绘制
        ctx.lineWidth = 10*rem;
        ctx.arc(0 , 0 , r-ctx.lineWidth/2 , 0 , 2*Math.PI, true); //画圆
        ctx.stroke();  //线条，与fill填充对应

        var hourNumbers=[3,4,5,6,7,8,9,10,11,12,1,2]; //弧度从圆点的x轴正方向开始，与表盘"3"刻度对应，注意数组元素顺序
        //表盘字体、位置、基准的设置
        ctx.font = 18*rem+"px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        //通过三角函数计算每个表盘数字的坐标并使用fillText方法进行填充，使用forEach数组方法对每个数组元素都执行内部的函数(具名函数是个好习惯)
        hourNumbers.forEach(function biaopan(number,i){
            var rad = 2 * Math.PI / 12 * i;
            var x = Math.cos(rad) * (r-30*rem);
            var y = Math.sin(rad) * (r-30*rem);
            ctx.fillText(number,x,y);
        });
        //表盘小刻度的绘制，整点数字处的小刻度为黑色，其余为灰色，共60个
        for(var i = 0; i<60; i++){
            var rad = 2 * Math.PI / 60 * i;
            var x = Math.cos(rad) * (r-18*rem);
            var y = Math.sin(rad) * (r-18*rem);
            ctx.beginPath();
            if (i%5 === 0){  //整点数字，除5取余
                ctx.fillStyle = "#000";
                ctx.arc(x , y , 2*rem ,0, 2 * Math.PI , false);
            }
            else{
               ctx.fillStyle = "#ccc";
               ctx.arc(x , y , 2*rem ,0, 2 * Math.PI , false);
            }
            ctx.fill();
        }
        ctx.closePath(); //结束绘制
    }

    //时针绘制，接收两个参数。接收分钟数是为了模仿真正的时钟，比如5点半时，时针应该指向5、6中间的位置
    function drawHour(hour,minute){
        ctx.save(); //需要往复使用save()和restore()方法，否则每次的指针都会留在画布上
        ctx.beginPath();
        var hrad = 2 * Math.PI / 12 * hour; //时针弧度计算
        var mrad = 2 * Math.PI / 12 / 60 * minute;  //分钟影响的时针弧度计算
        ctx.rotate(hrad + mrad); //旋转
        //时针样式
        ctx.lineWidth = 6*rem;
        ctx.lineCap = "round";
        ctx.moveTo(0,10*rem);
        ctx.lineTo(0,-r/2);
        ctx.stroke();

        ctx.restore();
    }
    //分针绘制，接收两个参数。接收秒数是为了模仿真正的时钟，比如5点30分30秒，分针应该指向30分、31分中间的位置
    function drawMinute(minute,second){
        ctx.save();
        ctx.beginPath();
        var mrad = 2 * Math.PI / 60 * minute;//分针弧度计算
        var srad = 2 * Math.PI / 60 / 60 * second;//秒影响的分针弧度计算
        ctx.rotate(mrad+srad);
        //分针样式
        ctx.lineWidth = 4*rem;
        ctx.lineCap = "round";
        ctx.moveTo(0,10*rem);
        ctx.lineTo(0,-r + 30*rem);
        ctx.stroke();
        ctx.restore();
    }
    //秒针绘制
    function drawSecond(second){
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "#ddd";
        var srad = 2 * Math.PI / 60 * second;
        ctx.rotate(srad);
        //秒针样式
        ctx.moveTo(-2*rem,20);
        ctx.lineTo(2*rem,20);
        ctx.lineTo(1,-r+18*rem);
        ctx.lineTo(-1,-r+18*rem);
        ctx.fill();
        ctx.restore();
    }
    //指针轴绘制
    function drawDot(){
        ctx.beginPath();
        ctx.fillStyle = "yellow";
        ctx.arc(0,0,3*rem,0,2*Math.PI,false);
        ctx.fill();
    }

    function draw(){
        ctx.clearRect(0,0,width,height);//每次画都要先清除上次画的内容，简称"重绘"
        var now = new Date();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        drawBackground();//顺序不能乱，因为在该函数中进行了保存操作与调整原点的操作
        drawHour(hour,minute);
        drawMinute(minute,second);
        drawSecond(second);
        drawDot();
        ctx.restore();
    }

    draw();
    setInterval(draw,1000);
};


