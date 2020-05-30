'use strict'; 
/* Classes for artefacts(PPEs),hospital and bonus point animation objects
 * -----------------------------------------------------------------------
 * @author: Caleb Nii Tetteh Tsuru Addy
 *          Allswell Nii Feehi Addy 
 * @email:  calebniitettehaddy@gmail.com  
 * @license:GNU General Public License v3.0
 */ 
class Artefact
{
    constructor(gameWidth,gameHeight,imgElementId,size,startFinishOffset)
    {     
        this.image      = document.getElementById(imgElementId);
        this.gameWidth  = gameWidth;//width of browser window screen
        this.gameHeight = gameHeight;//height of browser window screen  
        this.startFinishOffset=startFinishOffset;
        this.lifespan   = 100; 
        this.isCollected= false;//true if player collects the artefact, false otherwise 
        this.isInUse    = false;//true if player is using the artefact, false otherwise  
        this.size       = size;//length of the sides of the square that contains the artefact;
        //set the position of the artefact on the canvas 
        this.xCoord     = ~~(this.getRandomNumber(this.size,this.gameWidth - this.size));//so the right edge of the artefact doesn't go beyond the right wall of the screen.
        this.yCoord     = ~~(this.getRandomNumber(this.size,this.gameHeight - this.size));//so the bottom edge of the artefact doesn't go beyond the bottom wall of the screen. 
    } 
    getData()
    {
        return {x:this.xCoord,y:this.yCoord,size:this.size,lifespan:this.lifespan};
    } 
    isTouched(playerData)//checks if player has touched artefact
    {     
        let artefactPosition= {x:this.xCoord + this.size/2,y:this.yCoord + this.size/2};//center of the square that represents the artefact  
        let targetDistance = playerData.radius + this.size/2 + 10/* +10 is a temporary measure to take into account the vertices of the artefact*/;  
        if
        (   //if player is not close to the artefact, don't even bother 
            Math.abs(artefactPosition.x - playerData.x) > targetDistance || 
            Math.abs(artefactPosition.y - playerData.y) > targetDistance
        )
        {
            return false; 
        }  
        let artefactWidth = this.size, artefactHeight = this.size;//its a square so width === height.
        // temporary variables to set edges for testing
        let testX = playerData.x;
        let testY = playerData.y; 
        //which edge is closest?
        if (playerData.x < this.xCoord)         
        {
            testX = this.xCoord;//test left edge
        }
        else if (playerData.x > this.xCoord+artefactWidth)
        {
            testX = this.xCoord+artefactWidth;//right edge
        }
        if (playerData.y < this.yCoord) 
        {
            testY = this.yCoord;//top edge
        }
        else if (playerData.y > this.yCoord+artefactHeight)
        {
            testY = this.yCoord+artefactHeight;//bottom edge
        } 
        // get distance from closest edges
        let distX = playerData.x-testX;
        let distY = playerData.y-testY;
        let distance = Math.sqrt( (distX*distX) + (distY*distY) );  
        if (distance <= playerData.radius)// if the distance is less than the radius, collision!
        {
            return true;
        }
        return false; 
    }    
    getLifeSpan()
    {
        return this.lifespan; 
    }  
    setIsCollected(state)
    {
        this.isCollected = state; 
    } 
    getIsCollected()
    {
        return this.isCollected;
    }
    /**
    * Returns a random number between min (inclusive) and max (exclusive)
    * @param  {number} min The lesser of the two numbers. 
    * @param  {number} max The greater of the two numbers.  
    * @return {number} A random number between min (inclusive) and max (exclusive)
    */
    getRandomNumber(min, max) 
    {
        return Math.random() * (max - min) + min;
    } 
    /**
    * Let node correspond to window resizing.
    * @param  {number} screenHeight The height of the screen. 
    * @param  {number} screenWidth  The width of the screen.  
    * @param  {number} dy           The percentage change in browser window height 
    * @param  {number} dx           The percentage change in browser window width  .  
    */
    resize(screenHeight,screenWidth,dx,dy)
    {   
        this.gameHeight   = screenHeight;  
        this.gameWidth    = screenWidth; 
        this.xCoord *= dx; 
        this.yCoord *= dy;  
    }   
    setIsInUse(state)
    {
        this.isInUse = state; 
    }
    getIsInUse()
    {
        return this.isInUse; 
    }
    draw(ctx)
    {     
        if(!this.isCollected)
        {
            ctx.drawImage(this.image,this.xCoord,this.yCoord,this.size,this.size);  
        } 
    }    
    update(deltaTime)
    {     
        if(this.isCollected && this.isInUse)
        {
            this.lifespan -= 0.1;//start counting down to the expiration of the artefact
        } 
    }    
} 
class Facemask extends Artefact 
{
   
}
class Sanitizer extends Artefact 
{
   
}
class Glove extends Artefact 
{
   
}  
class Respirator extends Artefact 
{
   
}
class IsolationGown extends Artefact 
{
   
}
class Hospital extends Artefact 
{ 
    constructor(gameWidth,gameHeight,imgElementId,size,startFinishOffset)
    {     
        super(gameWidth,gameHeight,imgElementId,size,startFinishOffset);
        this.isInHospital = false;//true if player is in hospital, false otherwise 
    } 
    setIsInHospital(state)
    {
        this.isInHospital = state; 
    }
    playerIsInHospital(playerData) 
    {   
        if(playerData.x + playerData.radius > this.xCoord + this.size)
        {   //it is outside of the rectangle on the right side
            return false; 
        }
        if(playerData.x - playerData.radius < this.xCoord)
        {  //it is outside on the left side
            return false; 
        }
        if(playerData.y + playerData.radius > this.yCoord +this.size)
        {   //it is outside of the rectangle on the bottom side
            return false; 
        }
        if(playerData.y - playerData.radius < this.yCoord)
        {   //it is outside on the top side
            return false; 
        }
        return true;//player is in hospital
    }
    draw(ctx)
    {     
        super.draw(ctx);//draw the hospital image 
        if(this.isInHospital)
        {   //draw a green square around the hospital
            let delta = this.size/5; 
            ctx.beginPath();
            ctx.rect(this.xCoord-delta,this.yCoord-delta,this.size + delta*2,this.size + delta*2);  
            ctx.fillStyle   = "rgba(0,128,0,0.5)";//green
            ctx.fill();  
        } 
    }
    update(deltaTime)
    {     
        if(this.isInHospital)
        {
            this.lifespan -= 0.1;//start counting down to the expiration of the facemask  
        } 
    }   
}
//bonus and penalty animation object
class BonusPoint 
{
    constructor(data)
    {     
        this.gameWidth  = data.gameWidth; 
        this.gameHeight = data.gameHeight; 
        this.rectHeight = 13;//height of rectangle that contains the text
        this.score      = data.score; 
        this.xCoord     = data.x; 
        this.yCoord     = data.y;  
        if(this.yCoord + this.rectHeight > this.gameHeight)//if the bonus animation is beyond the bottom edge of the canvas
        {
           this.yCoord =  this.gameHeight - this.rectHeight*2;//adjust it 
        }
        this.size       = 40; 
        this.ascending = data.up; 
        this.color     = this.ascending? 'rgba(0,128,0,0.4)'/*green*/:'rgba(128,0,0,0.4)'/*maroon*/;
        this.text      = `${this.ascending?'+':'-'}${this.score} ${this.ascending?'BONUS':'PENALTY'}`;
    }
    getData()
    {
        return {x:this.xCoord,y:this.yCoord,size:this.size}; 
    }
    isGoingUp()
    {
        return this.ascending; 
    }
    /**
    * Let node correspond to window resizing.
    * @param  {number} screenHeight The height of the screen. 
    * @param  {number} screenWidth  The width of the screen.  
    * @param  {number} dy           The percentage change in browser window height 
    * @param  {number} dx           The percentage change in browser window width  .  
    */
    resize(screenHeight,screenWidth,dx,dy)
    {   
        this.gameHeight = screenHeight;  
        this.gameWidth  = screenWidth; 
        this.xCoord *= dx; 
        this.yCoord *= dy;  
    } 
    draw(ctx)
    {      
        let textWidth = ctx.measureText(this.text).width; 
        ctx.beginPath();
        let rectX = this.xCoord; 
        if(this.xCoord + textWidth >this.gameWidth)//if the bonus animation is beyond the right edge of the canvas
        {
           rectX =  this.gameWidth - textWidth;//adjust it 
        }   
        ctx.rect(rectX,this.yCoord,textWidth,this.rectHeight); 
        ctx.fillStyle   = this.color;//green for bonus, maroon for penalty
        ctx.fill();
        ctx.font =  "14px arial";//set the font of the text
        ctx.fillStyle = "white";//set color of text
        ctx.textAlign = "left";//set alignment of text at writing point(left-align)  
        ctx.fillText(this.text,rectX, this.yCoord + this.rectHeight);//write the text
        ctx.closePath(); 
    }    
    update(deltaTime)
    {     
        if(this.isGoingUp())
        {
            this.yCoord -= 1;//move the bonus rectangle up 
        }
        else
        {
            this.yCoord += 1;//move the bonus rectangle down
        } 
    }
}
