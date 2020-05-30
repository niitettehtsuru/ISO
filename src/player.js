'use strict';
/* The player of the game
 * ----------------------
 * @author: Caleb Nii Tetteh Tsuru Addy
 *          Allswell Nii Feehi Addy 
 * @email:  calebniitettehaddy@gmail.com  
 * @license:GNU General Public License v3.0
 */ 
class Player
{
    constructor(gameWidth,gameHeight,speed)
    {    
        this.gameWidth        = gameWidth;//width of game window
        this.gameHeight       = gameHeight;//height of game window 
        this.radius           = 2;//radius of innermost circle
        this.outermostRadius  = this.radius * 5;//radius of outermost circle 
        this.innerCircleColor = 'rgba(255,255,255,0.7)';//less transparent white
        this.outerCircleColor = 'rgba(255,255,255,0.3)';//more transparent white
        this.upKeyIsPressed   = false; 
        this.downKeyIsPressed = false; 
        this.rightKeyIsPressed= false; 
        this.leftKeyIsPressed = false;   
        this.xfarthestPoint   = this.outermostRadius;//farthest displacement of player horizontally from the left wall of the canvas
        this.velocityMagnitude= speed; 
        this.life             = 100.0; //Player is most healthy if life is at 100, game is over if player life is 0. 
        this.velocity         = {x:0, y:0};;//make the player stationary on start  
        //set the starting position of the player on the canvas(on the bottom of the left wall)
        this.xCoordOfCenter   = this.outermostRadius; 
        this.yCoordOfCenter   = this.gameHeight - this.outermostRadius;  
        this.setControls(); //set player navigational controls
    } 
    getInnerCircleColor()
    {
        return this.innerCircleColor;
    }
    setInnerCircleColor(color)
    {
        this.innerCircleColor = color; 
    }
    getOuterCircleColor()
    {
       return this.outerCircleColor; 
    }
    setOuterCircleColor(color)
    {
        this.outerCircleColor = color; 
    }
    setVelocityMagnitude(speed)
    {
        this.velocityMagnitude = speed; 
    } 
    getVelocityMagnitude()
    {
        return this.velocityMagnitude; 
    }
    setLife(life) 
    {
        this.life = life; 
    }
    getLife() 
    {
        return this.life; 
    } 
    setXCoordOfCenter(coord)
    {
        this.xCoordOfCenter = coord;
    }
    setYCoordOfCenter(coord)
    {
        this.yCoordOfCenter = coord;
    }
    getData()
    {
        return {x:this.xCoordOfCenter,y:this.yCoordOfCenter,radius:this.outermostRadius,xfarthest:this.xfarthestPoint};
    }
    setControls()
    {
        /*set arrow key navigation*/  
        document.addEventListener('keydown',(event)=>
        {  
            event.preventDefault();//disable arrow key scrolling in browser
            switch(event.keyCode)
            {
                case 37: //when left arrow key is pressed
                    this.setLeftKeyIsPressed(true);
                    if(this.playerTouchesLeftWall() ) 
                    {
                        this.stop();  
                    }
                    else
                    {
                        this.moveLeft();  
                    } 
                    break; 
                case 39: //when right arrow key is pressed
                    this.setRightKeyIsPressed(true); 
                    if(this.playerTouchesRightWall())
                    {
                        this.stop();  
                    }
                    else 
                    {
                        this.moveRight();  
                    } 
                    break; 
                case 38: //when up arrow key is pressed
                    this.setUpKeyIsPressed(true); 
                    if(this.playerTouchesTopWall())
                    {
                        this.stop(); 
                    }
                    else 
                    {
                        this.moveUp();
                    } 
                    break; 
                case 40: //when down arrow key is pressed
                    this.setDownKeyIsPressed(true);
                    if(this.playerTouchesBottomWall() )
                    {
                        this.stop(); 
                    }
                    else 
                    {
                        this.moveDown();  
                    } 
                    break;  
            }
        });
        document.addEventListener('keyup',(event)=>
        { 
            switch(event.keyCode)
            {
                case 37: //when left arrow key is released
                    this.setLeftKeyIsPressed(false);
                    //stop only if healthy player is moving left, and up and down keys are not pressed
                    if(this.velocity.x < 0 && (!this.getUpKeyIsPressed() && !this.getUpKeyIsPressed()))
                    {
                        this.stop(); 
                    }   
                    this.velocity.x = 0;
                    break; 
                case 39: //when right arrow key is released
                    this.setRightKeyIsPressed(false); 
                    //stop only if healthy player is moving right, and up and down keys are not pressed
                    if(this.velocity.x > 0 && (!this.getUpKeyIsPressed() && !this.getUpKeyIsPressed()))
                    {
                        this.stop(); 
                    } 
                    this.velocity.x = 0;
                    break; 
                case 38: //when up arrow key is released
                    this.setUpKeyIsPressed(false);  
                    if(this.velocity.y < 0 && (!this.getRightKeyIsPressed() && !this.getLeftKeyIsPressed()))//stop only if healthy player is moving up
                    {
                        this.stop(); 
                    }   
                    this.velocity.y = 0;
                    break; 
                case 40: //when down arrow key is pressed
                    this.setDownKeyIsPressed(false);
                    //stop only if healthy player is moving up
                    if(this.velocity.y > 0 && (!this.getRightKeyIsPressed() && !this.getLeftKeyIsPressed()))
                    {
                        this.stop(); 
                    }  
                    this.velocity.y = 0;
                    break;  
            }
        }); 
    }
    getLeftKeyIsPressed()
    {
       return this.leftKeyIsPressed; 
    }
    setLeftKeyIsPressed(state)
    {
        this.leftKeyIsPressed = state; 
    } 
    getRightKeyIsPressed()
    {
       return this.rightKeyIsPressed; 
    }
    setRightKeyIsPressed(state)
    {
        this.rightKeyIsPressed = state; 
    }
    getDownKeyIsPressed()
    {
       return this.downKeyIsPressed; 
    }
    setDownKeyIsPressed(state)
    {
       this.downKeyIsPressed = state; 
    }
    getUpKeyIsPressed()
    {
       return this.upKeyIsPressed; 
    }
    setUpKeyIsPressed(state)
    {
       this.upKeyIsPressed = state; 
    }
    stop() 
    {
        this.velocity =  {x:0, y:0}; 
    }
    moveLeft() 
    {  
        this.velocity.x = -this.velocityMagnitude ;  
    }
    moveRight()
    {
        this.velocity.x = this.velocityMagnitude ;  
    }
    moveUp() 
    { 
        this.velocity.y = -this.velocityMagnitude ;  
    }
    moveDown() 
    {
        this.velocity.y = this.velocityMagnitude ;  
    }
    playerTouchesLeftWall() 
    {
        if(this.xCoordOfCenter - this.outermostRadius < 0)//if player touches the left wall of the canvas
        {
            return true;
        }
        return false; 
    }
    playerTouchesRightWall() 
    {
        if(this.xCoordOfCenter + this.outermostRadius> this.gameWidth)
        {
            return true; 
        }
        return false; 
    }
    playerTouchesTopWall() 
    {
        if(this.yCoordOfCenter - this.outermostRadius < 0)//if player touches the top of the wall 
        {
            return true; 
        }
        return false; 
    }
    playerTouchesBottomWall() 
    {
        if(this.yCoordOfCenter + this.outermostRadius > this.gameHeight) 
        { 
            return true;  
        } 
        return false; 
    } 
    /**
    * Let player respond to window resizing.
    * @param  {number} screenHeight The height of the screen. 
    * @param  {number} screenWidth  The width of the screen.  
    * @param  {number} dy           The percentage change in browser window height 
    * @param  {number} dx           The percentage change in browser window width  .  
    */
    resize(screenHeight,screenWidth,dx,dy)
    {   
        this.gameHeight   = screenHeight;  
        this.gameWidth    = screenWidth; 
        this.xCoordOfCenter *= dx; 
        this.yCoordOfCenter *= dy;  
    } 
    setXFarthestPoint(xcoordinate)
    {
        this.xfarthestPoint = xcoordinate; 
    }
    getXFarthestPoint()
    {
        return this.xfarthestPoint; 
    }   
    draw(ctx)
    {   //draw the player
        for(var i = 0; i < 2; i++)
        {
            var color   = ''; 
            var radius  = 0; 
            switch(i)
            { 
                case 0: 
                    radius  =   this.radius * 2;  
                    color   =   this.getInnerCircleColor(); 
                    break; 
                case 1: 
                    radius  =   this.outermostRadius;
                    color   =   this.getOuterCircleColor(); 
                    break; 
            }
            //draw the player
            ctx.beginPath(); 
            ctx.arc(this.xCoordOfCenter,this.yCoordOfCenter,radius,0,2*Math.PI);
            ctx.fillStyle = color; 
            ctx.fill();  
        } 
    } 
    update(deltaTime)
    {     
        //keep the player moving in its current direction  
        this.xCoordOfCenter += this.velocity.x;//if player is going left or right at an angle, keep it going
        this.yCoordOfCenter += this.velocity.y;//if player is going up or down at an angle, keep it going  
        //record the farthest distance the player has moved to the right.
        if(this.xCoordOfCenter > this.getXFarthestPoint())
        {    
            this.setXFarthestPoint(this.xCoordOfCenter);   
        }  
        if(this.playerTouchesLeftWall())
        {
            this.xCoordOfCenter = this.outermostRadius; 
        }
        if(this.playerTouchesRightWall())
        { 
            //then the level is complete
        }
        if(this.playerTouchesTopWall())
        {
            this.yCoordOfCenter = this.outermostRadius;  
        }
        if(this.playerTouchesBottomWall())
        {
            this.yCoordOfCenter = this.gameHeight - this.outermostRadius;  
        }
    }      
}
