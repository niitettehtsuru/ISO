/*
 * Sets everything up
 * ------------------
 * @author: Caleb Nii Tetteh Tsuru Addy
 *          Allswell Nii Feehi Addy 
 * @email:  calebniitettehaddy@gmail.com  
 * @license:GNU General Public License v3.0
 */
'use strict';  
let 
c   = document.getElementById("isolationCanvas"),  
img = document.getElementById("backgroundphoto"),
ctx = c.getContext("2d"); 
/**
 * Gets the size of the browser window. 
 * @return {object} The length and breadth of the browser window.
 */
function getBrowserWindowSize() 
{
    let 
    win     = window,
    doc     = document,
    offset  = 10,
    docElem = doc.documentElement,
    body    = doc.getElementsByTagName('body')[0],
    browserWindowWidth  = win.innerWidth || docElem.clientWidth || body.clientWidth,
    browserWindowHeight = win.innerHeight|| docElem.clientHeight|| body.clientHeight; 
    return {x:browserWindowWidth-offset,y:browserWindowHeight-offset}; 
} 
let browserWindowSize   = getBrowserWindowSize();
//set size of canvas
c.width                 = browserWindowSize.x; 
c.height                = browserWindowSize.y; 

let SCREEN_WIDTH        = browserWindowSize.x,
    SCREEN_HEIGHT       = browserWindowSize.y,   
    game                = new Game(SCREEN_WIDTH,SCREEN_HEIGHT,img),  
    lastTime            = 100, 
    windowSize; 
window.onload = function() {  
    ctx.drawImage(img,0,0);
};  
function onWindowResize()//called every time the window gets resized. 
{  
    windowSize     = getBrowserWindowSize();
    c.width        = windowSize.x; 
    c.height       = windowSize.y; 
    SCREEN_WIDTH   = windowSize.x;
    SCREEN_HEIGHT  = windowSize.y;   
    game.resize(SCREEN_HEIGHT,SCREEN_WIDTH);//let game respond to window resizing
} 
window.addEventListener('resize',onWindowResize); 
function animationLoop(timestamp)
{      
    ctx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);  
    let deltaTime  = timestamp - lastTime; 
        lastTime   = timestamp;
    game.update(deltaTime);
    game.draw(ctx);  
    requestAnimationFrame(animationLoop);  
} 
requestAnimationFrame(animationLoop); 

 
 