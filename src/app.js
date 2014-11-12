var MAX_WIDTH = 960;
var TWO_PI = 2 * Math.PI;

$(".bobble-controls").tabs();
$(".slider").slider({
  range: "min"
});
$(".spinner").spinner();
$("#bobble_it").button();

var Bobbler = function(src) {
  this.src = src;
  this.canvas = document.getElementById("bobbledImage");
  this.data = null;
};

Bobbler.prototype.render = function() {
  var image = new Image();
  var canvas = this.canvas;
  var self = this;
  
  image.onload = function(){
    // Resize image to fit in the 960px layout
    if(image.width > MAX_WIDTH) {
      image.height *= MAX_WIDTH / image.width;
      image.width = MAX_WIDTH;
    }
    
    // Draw resized image to canvas so we can access image data
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0, image.width, image.height);
    
    // Load image data
    self.data = ctx.getImageData(0, 0, image.width, image.height);
    
    self.bobbleGrad();
  };
  
  image.src = this.src;
  
  this.image = image;
};

Bobbler.prototype.bobbleGrad = function() {
  var canvas = this.canvas, data = this.data.data, self=this;
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  var offsetX = 0;
  var offsetY = 0;
  var size = 14;
  var threshold = (size/2 - 1)*(size/2 - 1);
  threshold = 65;
  
  
  requestAnimationFrame(function() {        
    var x, y, lim_x, lim_y, i, x0, y0, col, d;
    var bobbleColors = [];
    for (x=offsetX, lim_x = canvas.width - 2; x < lim_x; x += size) {
      for (y=offsetY, lim_y = canvas.height - 2; y < lim_y; y += size) {
        if (!bobbleColors[x]) {
          bobbleColors[x] = [];
        }
        i = y*4*canvas.width + x*4;
        d = size/2 - 2;
        var ox = d*4 - d*4*canvas.width;
        bobbleColors[x][y] = [{r: data[i+ox], g: data[i+1+ox], b: data[i+2+ox]}, {r: data[i-ox], g: data[i+1-ox], b: data[i+2-ox]}];
      }
    }
    for (x=0, lim_x = canvas.width - 2; x < lim_x; x += 1) {
      for (y=0, lim_y = canvas.height - 2; y < lim_y; y += 1) {
        i = y*4*canvas.width + x*4;
        x0 = Math.round((x - offsetX)/size)*size;
        y0 = Math.round((y - offsetY)/size)*size;
        col = bobbleColors[x0] && bobbleColors[x0][y0];
        if (col && (x-x0)*(x-x0) + (y-y0)*(y-y0) < threshold) {
          var z = (x-x0 + y0-y+size)/(2*size);
          var colM = {r: z*col[0].r + (1-z)*col[1].r,
                  g: z*col[0].g + (1-z)*col[1].b,
                  b: z*col[0].g + (1-z)*col[1].b};
          data[i] = colM.r;
          data[i+1] = colM.g;
          data[i+2] = colM.b;
          data[i+3] = Math.floor((x-x0)/size*256);
        } else {
          data[i] = 255;
          data[i+1] = 255;
          data[i+2] = 255;
        }
        //myData.push({x: x, y: y, r: data[i], g: data[i+1], b: data[i+2], a: data[i+3]});
      }
    }
    ctx.putImageData(self.data, 0, 0);
  });
};

Bobbler.prototype.bobbleDist = function() {
  var canvas = this.canvas, data = this.data.data, self=this;
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  var offsetX = 0;
  var offsetY = 0;
  var size = 14;
  var threshold = (size/2 - 1)*(size/2 - 1);
  threshold = 65;
  
  requestAnimationFrame(function() {        
    var x, y, lim_x, lim_y, i, x0, y0, col;
    var bobbleColors = [];
    for (x=offsetX, lim_x = canvas.width - 2; x < lim_x; x += size) {
      for (y=offsetY, lim_y = canvas.height - 2; y < lim_y; y += size) {
        if (!bobbleColors[x]) {
          bobbleColors[x] = [];
        }
        i = y*4*canvas.width + x*4;
        bobbleColors[x][y] = {r: data[i], g: data[i+1], b: data[i+2]};
      }
    }
    for (x=0, lim_x = canvas.width - 2; x < lim_x; x += 1) {
      for (y=0, lim_y = canvas.height - 2; y < lim_y; y += 1) {
        i = y*4*canvas.width + x*4;
        x0 = Math.round((x - offsetX)/size)*size;
        y0 = Math.round((y - offsetY)/size)*size;
        col = bobbleColors[x0] && bobbleColors[x0][y0];
        if (col && (x-x0)*(x-x0) + (y-y0)*(y-y0) < threshold) {
          data[i] = col.r;
          data[i+1] = col.g;
          data[i+2] = col.b;
        } else {
          data[i] = 255;
          data[i+1] = 255;
          data[i+2] = 255;
        }
        //myData.push({x: x, y: y, r: data[i], g: data[i+1], b: data[i+2], a: data[i+3]});
      }
    }
    ctx.putImageData(self.data, 0, 0);
  });
};

Bobbler.prototype.bobble = function() {
  var canvas = this.canvas, data = this.data;
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  var drawCircle = function(x, y, r, g, b, a) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, TWO_PI, false);
    ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
    ctx.closePath();
    ctx.fill();
  }
  requestAnimationFrame(function() {
    //var myData = [];
    
    var x, y, lim_x, lim_y, i;
    for (x=2, lim_x = canvas.width - 2; x < lim_x; x += 5) {
      for (y=2, lim_y = canvas.height - 2; y < lim_y; y += 5) {
        i = y*4*canvas.width + x*4;
        //myData.push({x: x, y: y, r: data[i], g: data[i+1], b: data[i+2], a: data[i+3]});
        drawCircle(x, y, data[i], data[i+1], data[i+2], data[i+3]/255);
      }
    }
    
    /*var count = 0;
    myData.forEach(function (d) {
      drawCircle(d.x, d.y, d.r, d.g, d.b, d.a);
    });*/
  });
};

Bobbler.prototype.bobbleMask = function() {
  var canvas = this.canvas, data = this.data;
  var ctx = canvas.getContext("2d");
  //ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  var drawCircle = function(x, y, r, g, b, a) {
    maskctx.moveTo(x, y);
    maskctx.arc(x, y, 3, 0, TWO_PI, false);
  }
  
  var mask = document.createElement("canvas");
  mask.width = canvas.width;
  mask.height = canvas.height;
  var maskctx = mask.getContext("2d");
  
  requestAnimationFrame(function() {
    
    maskctx.fillStyle = "white";
    maskctx.fillRect(0, 0, canvas.width, canvas.height);
    
            
    maskctx.globalCompositeOperation = 'xor';
    maskctx.fillStyle = "white";
    maskctx.beginPath();
    
    var x, y, lim_x, lim_y, i;
    for (x=2, lim_x = canvas.width - 2; x < lim_x; x += 5) {
      for (y=2, lim_y = canvas.height - 2; y < lim_y; y += 5) {
        i = y*4*canvas.width + x*4;
        drawCircle(x, y, data[i], data[i+1], data[i+2], data[i+3]/255);
      }
    }
    
    maskctx.closePath();
    maskctx.fill();

    
    ctx.drawImage(mask, 0, 0);
  
  });
};

Bobbler.prototype.bobbleClip = function() {
  var canvas = this.canvas, data = this.data;
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  var drawCircle = function(x, y, r, g, b, a) {
    ctx.moveTo(x, y);
    ctx.arc(x, y, 3, 0, TWO_PI, false);
  }
  var self = this;
  requestAnimationFrame(function() {

    ctx.beginPath();
    
    var x, y, lim_x, lim_y, i;
    for (x=2, lim_x = canvas.width - 2; x < lim_x; x += 15) {
      for (y=2, lim_y = canvas.height - 2; y < lim_y; y += 15) {
        i = y*4*canvas.width + x*4;
        drawCircle(x, y, data[i], data[i+1], data[i+2], data[i+3]/255);
      }
    }
    
    ctx.clip();
    
    ctx.drawImage(self.image, 0, 0, self.image.width, self.image.height);
  
  });
};

var LoadedImage = null;

function loadImage(src){
  //	Prevent any non-image file type from being read.
  if(!src.type.match(/image.*/)){
    console.log("The dropped file is not an image: ", src.type);
    return;
  }
  
  //	Create our FileReader and run the results through the render function.
  var reader = new FileReader();
  reader.onload = function(e){
    LoadedImage = new Bobbler(e.target.result);
    LoadedImage.render();
  };
  reader.readAsDataURL(src);
}

var target = $(".drop-target");
target.dragenterCount = 0;

// Add hover effect when we hover over the draggable area
target.on("dragenter", function(e){
  if (target.dragenterCount === 0) {
    target.addClass("file-hover");
  }
  target.dragenterCount++;
});
target.on("dragleave", function(e){
  target.dragenterCount--;
  if (target.dragenterCount === 0) {
    target.removeClass("file-hover");
  }
});

// Show that files can be moved here
target.on("dragover", function(e){
  e.preventDefault(); 
});

// When we drop an image over the container, trigger the loading
target.on("drop", function(e){
  e.preventDefault();
  loadImage(e.originalEvent.dataTransfer.files[0]);
  target.removeClass("file-hover");
  target.addClass("image-loaded");
  target.dragenterCount = 0;
});