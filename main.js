// Buttons
var lastPress = 0,
    pressCount = 0,
    pos=0,
    timeout;
    
    
// Lights    
SPI2.setup({baud:3200000, mosi:B15});
var rgb = new Uint8Array(25*3),
    cycle,
    r = 0,
    g = 0,
    b = 0,
    patterns = [],
    patternBlock = [],
    patternNumber = 0,
    col = 5,
    pos=0,
    directionUp = true,
    offLight=0;
    


// !Patterns /////////////////////////////////////////////

// !slow colour change
patterns.push(function() {
  pos++;
  var rr = 0, gg = 0, bb = 0;
  var posSlow = pos/18;
  // pick next colour
  rr = (1 + Math.sin(posSlow*0.1324)) * col;
  gg = (1 + Math.sin(posSlow*0.1654)) * col;
  bb = (1 + Math.sin(posSlow*0.1)) * col;
  
  // draw all pixels with same rgb values
  for (var i=0;i<rgb.length;i+=3) {
    rgb[i  ] = rr;
    rgb[i+1] = gg;
    rgb[i+2] = bb;
  }
});

// !left / right, single bulb chaser, with colour change on direction change
patterns.push(function() {  
  // all off
  for (var i=0;i<rgb.length+1;i+=3) {
    rgb[i  ] = 0;
    rgb[i+1] = 0;
    rgb[i+2] = 0;
  }
  
  // light these up
    rgb[pos] = r;
    rgb[pos+1] = g;
    rgb[pos+2] = b;
  
  // direction change
  if(pos>74) {
      directionUp = false;
    // pick next colour
    r = (r + Math.sin(pos/2*0.1324)) * 20;
    g = (g + Math.sin(pos/2*0.1654)) * 20;
    b = (b + Math.sin(pos/2*0.1)) * 20;
  }
  if(pos<=0) {
    directionUp = true;
    //console.log('r='+r);
    if (r<-99999999999){r=0;}
    if (g<-99999999999){g=0;}
    if (b<-99999999999){b=0;}
  }
  
  // increment pos
  if(directionUp){
    pos+=3;
  }else{
    pos-=3;
  }
});

// !pattern shift - knight rider
// move pattern back and forth
patterns.push(function() {
  patternBlock = [
    0,1,5,25,35,80,35,25,5,1,0
  ];
  
  // paint each led
  for (var p=0;p<rgb.length;p+=3) {
      rgb[p+offLight] = patternBlock[p/3];
      rgb[p+1] = 0;
      rgb[p+2] = 0;
    }
    pos++;

  if(offLight>=43) {
      directionUp = false;
  }
  if(offLight===0) {
      directionUp = true;
  }
  
  if(directionUp){
    offLight+=1;
  }else{
    offLight-=1;
  }

  //console.log(rgb);
});


// !knight rider
// tapered line, move left-right
patterns.push(function() {
  pos++;
  
  var r = 0, g = 0, b = 0;
  var posSlow = pos/2;

  // draw all pixels
  for (var i=0;i<rgb.length;i+=3) {
    rgb[i  ] = (1 + Math.sin((i+pos)*0.08)) * 30;
    rgb[i+1] = 0;
    rgb[i+2] = 0;
  }

});


// !chasing rainbow
patterns.push(function() {
  pos++;
  for (var i=0;i<rgb.length;i+=3) {
     rgb[i  ] = (1 + Math.sin((i+pos)*0.15)) * 80;
     rgb[i+1] = (1 + Math.sin((i+pos)*0.2)) * 80;
     rgb[i+2] = (1 + Math.sin((i+pos)*0.08)) * 80;
  }
});


// !reverse chaser rainbow
// with moving off bulb
patterns.push(function() {
  pos++;
  var col = Math.random()*255;
  for (var i=0;i<rgb.length;i+=3) {
     var randPos = Math.random();
     rgb[i  ] = (1 + Math.sin((randPos+pos)*0.1654)) * 50;
     rgb[i+1] = (1 + Math.sin((i+pos)*0.1654)) * 50;
     rgb[i+2] = (1 + Math.sin((randPos+pos)*0.1)) * 50;
  }
  
  if(offLight>75) {
      directionUp = false;
  }
  if(offLight<0) {
      directionUp = true;
  }

     rgb[offLight] = 0;
     rgb[offLight] = 0;
     rgb[offLight] = 0;

     rgb[offLight+1] = 0;
     rgb[offLight+1] = 0;
     rgb[offLight+1] = 0;

     rgb[offLight+2] = 0;
     rgb[offLight+2] = 0;
     rgb[offLight+2] = 0;
  
  if(directionUp){
    offLight+=3;
  }else{
    offLight-=3;
  }
});


// !white 
patterns.push(function() { 
  pos++;
  for (var i=0;i<rgb.length;i+=3) {
     rgb[i  ] = col;
     rgb[i+1] = col;
     rgb[i+2] = col;
  }
});
// !green
patterns.push(function() {
  pos++;
  for (var i=0;i<rgb.length;i+=3) {
     rgb[i  ] = 0;
     rgb[i+1] = col;
     rgb[i+2] = 0;
  }
});
// !blue
patterns.push(function() {
  pos++;
  for (var i=0;i<rgb.length;i+=3) {
     rgb[i  ] = 0;
     rgb[i+1] = 0;
     rgb[i+2] = col;
  }
});
// !turq
patterns.push(function() {
  pos++;
  for (var i=0;i<rgb.length;i+=3) {
     rgb[i  ] = 0;
     rgb[i+1] = col;
     rgb[i+2] = col;
  }
});
// !purp
patterns.push(function() {
  pos++;
  for (var i=0;i<rgb.length;i+=3) {
     rgb[i  ] = col;
     rgb[i+1] = 0;
     rgb[i+2] = col;
  }
});
// !yellow
patterns.push(function() {
  pos++;
  for (var i=0;i<rgb.length;i+=3) {
     rgb[i  ] = col;
     rgb[i+1] = col;
     rgb[i+2] = 0;
  }
});
    
    
    
// !Buttons /////////////////////////////////////////////
function executePressFn() {
    timeout = undefined;

    switch(pressCount) {
        case 1:
          LED1.write(1);
          LED2.write(0);
          LED3.write(0);
          col = col + 20;
          if (col >= 255) {col = 5;}
          console.log('single press ' +col);
          break;
        case 2:
          LED1.write(0);
          LED2.write(1);
          LED3.write(0);
          console.log('ChangePattern (double-press)');
          lightsOff();
          changePattern();
          startLights();
          break;
        case 3:
          LED1.write(0);
          LED2.write(0);
          LED3.write(1);
          console.log('Restart (triple-press)');
          lightsOff();
          patternNumber = 0;
          startLights();
          break;
    }
    
    pressCount = 0;
  
  // turn off STATUS LEDS
  setTimeout(function() {
    digitalWrite([LED1,LED2,LED3], 0);
  }, 200);
}

function onPress(timeDiff) {
  pressCount++;
  //console.log(pressCount);
  // if we had a timeout from another button press, remove it
  if (timeout) clearTimeout(timeout);
  // short delay after this press, then execute 
  timeout = setTimeout(executePressFn, 350);
}

function buttonWatcher(e) {
  var timeDiff = e.time - lastPress;
  lastPress = e.time;
  if (timeDiff>0.1) onPress(timeDiff);
  console.log(timeDiff);
}

setWatch(buttonWatcher, B12, { repeat:true, edge:'falling' }); 



// !Lights /////////////////////////////////////////////
var getPattern = patterns[0];
function doLights() {
    getPattern();
    SPI2.send4bit(rgb, 0b0001, 0b0011);
}

function lightsOff() {
    clearInterval(cycle);

    // reset
    pos=0;
    cycle = null;
    offLight=0;
    directionUp = true;
    patternBlock = [];
    col = 5;
    r = 0;
    g = 0;
    b = 0;
  
    for (var i=0;i<rgb.length;i+=3) {
        rgb[i  ] = 0;
        rgb[i+1] = 0;
        rgb[i+2] = 0;
    }
    SPI2.send4bit(rgb, 0b0001, 0b0011);
}
 
function changePattern() {
    patternNumber = (patternNumber+1) % patterns.length;
    getPattern = patterns[patternNumber];
    console.log('pattern - '+patternNumber);
}

function startLights(){
    cycle =  setInterval(function(){doLights();},30); 
}