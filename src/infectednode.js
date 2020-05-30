'use strict'; 
/* A node infected with COVID-19 (representing an infected person).
 * ---------------------------------------------------------------
 * @author: Caleb Nii Tetteh Tsuru Addy
 *          Allswell Nii Feehi Addy 
 * @email:  calebniitettehaddy@gmail.com  
 * @license:GNU General Public License v3.0
 */
class InfectedNode
{  
    constructor(data)
    {     
        this.gameWidth        = data.width;//width of browser window screen
        this.gameHeight       = data.height;//height of browser window screen 
        this.startFinishOffset= data.startFinishOffset; 
        this.radius           = data.radius;//radius of innermost circle
        this.outermostRadius  = data.outermostRadius;//radius of outermost circle 
        this.innerCircleColor = 'rgba(0,0,0,0.7)';//less transparent black
        this.outerCircleColor = 'rgba(0,0,0,0.3)';//more transparent black
        this.velocityMagnitude= data.speed; 
        this.velocity         = this.getRandomVelocity();//the direction and speed with which the node moves on start  
        this.xCoordOfCenter   = data.x; 
        this.yCoordOfCenter   = data.y;    
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
    getData()
    {
        return {x:this.xCoordOfCenter,y:this.yCoordOfCenter,radius:this.outermostRadius};
    }
    collisionDetected(playerData,linkDistance)//check if player has collided with this infected node
    {    
        let playerPosition = {x:playerData.x, y:playerData.y};  
        let infectedNodePosition = {x:this.xCoordOfCenter,y:this.yCoordOfCenter,distance:0}; 
        if(//if player is not close to this infected node...
            Math.abs(infectedNodePosition.x - playerPosition.x) > linkDistance || 
            Math.abs(infectedNodePosition.y - playerPosition.y) > linkDistance
            )
        {
            return {collided:false,collisionCoordinates:[]};//...don't even bother 
        } 
        let distance    = this.getDistanceBetweenTwoPoints(playerPosition,infectedNodePosition);   
        if( distance   <= playerData.radius + this.outermostRadius)//if an infected node is within range  
        { 
            infectedNodePosition.distance = distance; 
            return {collided:true,collisionCoordinates:[infectedNodePosition]};//collision detected 
        } 
        if( distance <= linkDistance)//if infected node is within 25 feet,
        {  
            infectedNodePosition.distance = distance; 
            return {collided:false,collisionCoordinates:[infectedNodePosition]};  
        }  
        return {collided:false,collisionCoordinates:[]};  
    }   
    getDistanceBetweenTwoPoints(pointA,pointB) 
    {
        let dx      = pointA.x - pointB.x,
            dy      = pointA.y - pointB.y,  
            distance= ~~(Math.sqrt(dx*dx + dy*dy)); 
        return distance; 
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
            this.xCoordOfCenter *= dx; 
            this.yCoordOfCenter *= dy;  
    } 
    /**
    * Set the node in a random direction on start
    * @return  {object} The direction of the node (depicted as x and y coordinates).  
    */
    getRandomVelocity() 
    {  
        var x = Math.random() > 0.5? -this.velocityMagnitude: this.velocityMagnitude;//flip a coin to decide if node moves forwards or backwards
        var y = Math.random() > 0.5? -this.velocityMagnitude: this.velocityMagnitude;//flip a coin to decide if node moves upwards or downwards
        return {x:x, y:y};
    }   
    draw(ctx)
    { 
        for(var i = 0; i < 2; i++)
        {    
            var color   = ''; 
            var radius  = 0; 
            switch(i)
            { 
                case 0: 
                    radius  =   this.radius * 3; 
                    color   =   this.getInnerCircleColor();; 
                    break; 
                case 1: 
                    radius  =   this.outermostRadius;  
                    color   =   this.getOuterCircleColor(); 
                    break; 
            }
            //draw the node
            ctx.beginPath(); 
            ctx.arc(this.xCoordOfCenter,this.yCoordOfCenter,radius,0,2*Math.PI);
            ctx.fillStyle = color; 
            ctx.fill();  
        } 
    }  
    checkHospitalCollision(hospitals)
    {
        //check if node has touched hospital
        for(let i = 0; i < hospitals.length; i++)
        {
            let hospital = hospitals[i];
            if(hospital.isTouched(this.getData()))//if node touches hospital,
            {
                this.velocity.x = -this.velocity.x;//move node to the opposite horizontal direction 
                this.velocity.y = -this.velocity.y;//move node to the opposite vertical direction 
            }
        }
    }
    update(deltaTime)
    {   
        //randomly change the angle of movement in the current direction 
        this.velocity.x += Math.random() > 0.5? -Math.random()/20:Math.random()/20; 
        this.velocity.y += Math.random() > 0.5? -Math.random()/20:Math.random()/20; 
        //keep the node moving in its current direction  
        this.xCoordOfCenter += this.velocity.x;//if node is going left or right at an angle, keep it going
        this.yCoordOfCenter += this.velocity.y;//if node is going up or down at an angle, keep it going  
        if(this.xCoordOfCenter - this.outermostRadius < this.startFinishOffset)//if node touches the start box(right wall of the start box) 
        { 
            this.xCoordOfCenter = this.startFinishOffset+ this.outermostRadius * 2;//push node slightly out of the start box 
            this.velocity.x = -this.velocity.x;//move to the right 
            this.velocity.y = Math.random() > 0.5? -this.velocityMagnitude: this.velocityMagnitude ;//flip a coin to move either up or down
        }   
        if(this.xCoordOfCenter + this.radius> this.gameWidth)//if node touches the right wall
        {
            this.xCoordOfCenter = this.gameWidth - this.radius * 2;//push node slightly to the left
            this.velocity.x = -this.velocity.x;//move to the left
            this.velocity.y = Math.random() > 0.5? -this.velocityMagnitude: this.velocityMagnitude ;//flip a coin to move either up or down 
        } 
        if( this.yCoordOfCenter - this.radius< 0)//if node touches the top of the wall 
        {
            this.yCoordOfCenter = this.radius * 2;//push node slightly down
            this.velocity.y = -this.velocity.y;//move down 
            this.velocity.x = Math.random() > 0.5? -this.velocityMagnitude: this.velocityMagnitude ;//flip a coin to move either left or right
        } 
        if(this.yCoordOfCenter + this.radius > this.gameHeight)//if node touches the bottom of the wall
        { 
            this.yCoordOfCenter = this.gameHeight - this.radius * 2;//push node slightly up 
            this.velocity.y = -this.velocity.y;//move up  
            this.velocity.x = Math.random() > 0.5? -this.velocityMagnitude: this.velocityMagnitude ;//flip a coin to move either left or right 
        }   
    }  
} 