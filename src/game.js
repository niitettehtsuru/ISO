'use strict';
/* Creates, controls and coordinates all aspects of the game
 * ---------------------------------------------------------
 * @author: Caleb Nii Tetteh Tsuru Addy
 *          Allswell Nii Feehi Addy 
 * @email:  calebniitettehaddy@gmail.com  
 * @license:GNU General Public License v3.0
 */
class Game
{
    constructor(screenWidth,screenHeight,img)
    {     
        this.dataset    = data["data"];//data on provisional COVID-19 Death Counts by Sex, Age, and State. Used to randomly spawn artefacts.
        this.gameWidth  = screenWidth;//width of browser window screen
        this.gameHeight = screenHeight;//height of browser window screen 
        this.img        = img;//background image  
        this.states     = {'gameover':false,'paused':false,'nextLevelWait':false};//game states 
        this.levelNum   = 1;//start from level 1  
        this.gameLevels = //levels of the game.
        [
            {id:1,name:'Niue',population:1625},{id:2,name:'Stradbroke,Australia',population:2026},{id:3,name:'Ayuthaya,Thailand',population:53725},{id:4,name:'Samarkand,Uzbekistan',population:513572},{id:5,name:'Al-Ain,UAE',population:766936},{id:6,name:'Geneva,Switzerland',population:1395356},
            {id:7,name:'Amsterdam,Netherlands',population:1380872},{id:8,name:'Ulaanbaatar,Mongolia',population:1584358},{id:9,name:'Warsaw,Poland',population:1800000},{id:10,name:'Paris,France',population:2148271},{id:11,name:'Queens,New York,USA',population:2300000},{id:12,name:'Chicago,USA',population: 2693976},
            {id:13,name:'Rome,Italy',population: 2693976},{id:14,name:'Dubai,UAE',population:2878344},{id:15,name:'Jaipur,India',population:310000},{id:16,name:'Madrid',population: 3300000},{id:17,name:'Brasilia,Brasil.',population: 4645843},{id:18,name:'Hokkaido,Japan',population: 5285430},
            {id:19,name:'Riyadh,Saudi Arabia',population: 7231447},{id:20,name:'Quebec,Canada',population:8180000},{id:21,name:'London,UK',population:12500000},{id:22,name:'Moscow',population:20400000},{id:23,name:'Shanghai',population:24280000},{id:24,name:'Cairo,Egypt',population: 20400000},
            {id:25,name:'Seoul,South Korea',population:25620000},{id:26,name:'Tokyo,Japan',population: 37393129}
        ];
        this.covid19tidbits = //snippets of information about COVID-19
        [//source:https://www.cdc.gov/coronavirus/2019-ncov/prevent-getting-sick/prevention.html?CDC_AA_refVal=https%3A%2F%2Fwww.cdc.gov%2Fcoronavirus%2F2019-ncov%2Fprepare%2Fprevention.html
            "Wash your hands often with soap and water for at least 20 seconds especially after you have been in a public place, or after blowing your nose, coughing, or sneezing.",
            "There is currently no vaccine to prevent coronavirus disease 2019 (COVID-19).",
            "The best way to prevent illness is to avoid being exposed to this virus.",
            "The virus is thought to spread mainly from person-to-person.",
            "Older adults and people who have severe underlying medical conditions like heart or lung disease or diabetes seem to be at higher risk for developing serious complications from COVID-19 illness.",
            "Avoid touching your eyes, nose, and mouth with unwashed hands.",
            "If soap and water are not readily available, use a hand sanitizer that contains at least 60% alcohol.",
            "Remember that some people without symptoms may be able to spread virus.",
            "The best way to prevent illness is to avoid being exposed to this virus.",
            "Some recent studies have suggested that COVID-19 may be spread by people who are not showing symptoms.",
            "Stay at least 6 feet from other people.",
            "Stay out of crowded places and avoid mass gatherings.",
            "Cover your mouth and nose with a cloth face cover when around others",
            "The cloth face cover is not a substitute for social distancing.",
            "The cloth face cover is meant to protect other people in case you are infected.",
            "Clean AND disinfect frequently touched surfaces daily.",
            "If surfaces are dirty, clean them. Use detergent or soap and water prior to disinfection.",
            "Be alert for symptoms. Watch for fever, cough, shortness of breath, or other symptoms of COVID-19.",
            "Take your temperature if symptoms develop.",
            "Do not take your temperature within 30 minutes of exercising or after taking medications that could lower your temperature, like acetaminophen.",
            "If you are in a private setting and do not have on your cloth face covering, remember to always cover your mouth and nose with a tissue when you cough or sneeze or use the inside of your elbow.",
            "Throw used tissues in the trash.",
            "Keeping distance from others is especially important for people who are at higher risk of getting very sick.",
            "Do NOT use a facemask meant for a healthcare worker.",
            "Cloth face coverings should not be placed on young children under age 2, anyone who has trouble breathing, or is unconscious, incapacitated or otherwise unable to remove the mask without assistance.",
            "Everyone should wear a cloth face cover when they have to go out in public",
            "You could spread COVID-19 to others even if you do not feel sick."
        ]; 
        this.activeInfo = this.covid19tidbits[~~(Math.random() * (this.covid19tidbits.length-1))];//randomly select a snippet of information about COVID-19
        this.score      = 0;//start from a score of 0  
        this.player     = this.createPlayer(); //the player of the game 
        this.playerData = this.player.getData();//data about the coordinates of the player on the canvas   
        
        //game objects
        this.infected = [];this.hospitals = [];this.bonusPointObjects = []; 
        this.facemasks = [];this.collectedFacemasks = [];
        this.isolationGowns = [];this.collectedIsolationGowns = [];
        this.sanitizers = [];this.collectedSanitizers = [];
        this.respirators = [];this.collectedRespirators = [];
        this.gloves = [];this.collectedGloves = []; 
        
        //The life and score of the player when a new level starts.This is useful if the player wants to replay a level.
        this.playerLifeOnStartOfNewLevel = 100; 
        this.playerScoreOnStartOfNewLevel = 0;  
        
        this.closeInfectedNodes = [];//ccoordinates of infected nodes that are within link distance with the player 
        this.noCollisionsAtAll = true;//true if NONE of the infected nodes collide with the player in an animation frame
        this.unitLifeReduction = 2.0;//the amount of health to deduct from the player upon every collision  
        this.linkDistance = 100;//the distance for drawing linked lines between the player and the infected node  
        this.startFinishOffset = 40;//horizontal space for drawing the START and FINISH boxes at the left and right ends of the canvas respectively.
        this.tempPenaltyStore = 0;//stores cummulative penalties for collisions with infected nodes until player disengages from collision 
        
        this.setControls();//set controls for pause,gameover, etc  
        this.createLevel();//start from level 1
    }   
    createGameObjects()//create infected nodes, hospitals and ppes
    {
        this.hospitals  =this.createHospitals();
        this.sanitizers = this.createSanitizers(); 
        this.isolationGowns = this.createIsolationGowns(); 
        this.facemasks = this.createFaceMasks(); 
        this.respirators = this.createRespirators(); 
        this.gloves = this.createGloves();  
        this.infected   = this.createInfected();//create the nodes infected with COVID-19  
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
    //randomly get the number of artefacts to create based on Provisional COVID-19 Death Counts by Sex, Age, and State.
    getRandomArtefactNum() 
    { 
        for(;;)
        {
            let index = ~~(this.getRandomNumber(0,this.dataset.length-1)), 
                subIndex = ~~(this.getRandomNumber(15,20)); 
            let number = this.dataset[index][subIndex];//get a random number from the dataset
            if(number !== null)
            {
                let lastDigit  = +`${number.substr(number.length-1)}`;
                let firstDigit = +`${number[0]}`;
                let ans = lastDigit > 4? 4/*Math.abs(lastDigit-firstDigit)*/: lastDigit;   
                return ans; 
            }     
        }   
    }
    createRespirators()//create respirator artefacts
    { 
        let respirators = [], 
            numOfRespirators = this.getRandomArtefactNum(); 
        for(let i = 0; i < numOfRespirators; i++)
        {
            respirators.push(new Respirator(this.gameWidth,this.gameHeight,'respirator_img',20,this.startFinishOffset)); 
        } 
        return respirators;
    }
    createGloves()//create glove artefacts
    {
        let gloves = [], 
            numOfGloves = this.getRandomArtefactNum(); 
        for(let i = 0; i < numOfGloves; i++)
        {
            gloves.push(new Glove(this.gameWidth,this.gameHeight,'gloves_img',20,this.startFinishOffset)); 
        } 
        return gloves; 
    }
    createGoggles()//create goggles artefacts
    {
        let goggles = [], 
            numOfGoggles = this.getRandomArtefactNum(); 
        for(let i = 0; i < numOfGoggles; i++)
        {
            goggles.push(new Goggle(this.gameWidth,this.gameHeight,'goggles_img',20,this.startFinishOffset)); 
        } 
        return goggles;
    }
    createSanitizers()//create sanitizer artefacts
    {
        let sanitizers = [], 
            numOfSanitizers = this.getRandomArtefactNum(); 
        for(let i = 0; i < numOfSanitizers; i++)
        {
            sanitizers.push(new Sanitizer(this.gameWidth,this.gameHeight,'sanitizer_img',20,this.startFinishOffset)); 
        } 
        return sanitizers;
    }
    createIsolationGowns()//create isolation gown artefacts
    {
        let isolationGowns = [], 
            numOfIsolationGowns = this.getRandomArtefactNum(); 
        for(let i = 0; i < numOfIsolationGowns; i++)
        {
            isolationGowns.push(new IsolationGown(this.gameWidth,this.gameHeight,'isolationgown_img',20,this.startFinishOffset)); 
        } 
        return isolationGowns;
    }
    createFaceMasks()//create face mask artefacts
    {
        let facemasks = [], 
            numOfFacemasks = this.getRandomArtefactNum(); 
        for(let i = 0; i < numOfFacemasks; i++)
        {
            facemasks.push(new Facemask(this.gameWidth,this.gameHeight,'facemask_img',20,this.startFinishOffset)); 
        } 
        return facemasks;
    }   
    createHospitals()
    {
        let hospitals = [], 
            numOfHospitals = this.getRandomArtefactNum(); 
        for(let i = 0; i < numOfHospitals; i++)
        { 
            hospitals.push(new Hospital(this.gameWidth,this.gameHeight,'hospital_img',50,this.startFinishOffset)); 
        } 
        return hospitals;
    }
    emptyArtefacts() 
    {  
        //get rid of all artefacts...
        this.facemasks = []; this.collectedFacemasks = [];
        this.isolationGowns= []; this.collectedIsolationGowns= [];
        this.sanitizers= [];this.collectedSanitizers= [];
        this.respirators = []; this.collectedRespirators = [];
        this.gloves = []; this.collectedGloves = [];
        //... and hospitals and bonus point animations
        this.hospitals = []; this.bonusPointObjects = []; 
        //hide the artefact progress indicators
        document.getElementById('hospitalprogress').classList.add("hide-it"); 
        document.getElementById('facemaskprogress').classList.add("hide-it"); 
        document.getElementById('isolationgownprogress').classList.add("hide-it"); 
        document.getElementById('respiratorprogress').classList.add("hide-it"); 
        document.getElementById('gloveprogress').classList.add("hide-it"); 
        document.getElementById('goggleprogress').classList.add("hide-it"); 
        document.getElementById('sanitizerprogress').classList.add("hide-it");  
    } 
    getGameObjects()//get all infected nodes, artefacts, hospitals and bonus/penalty animation objects
    {
        return [...this.infected,
                ...this.facemasks,...this.collectedFacemasks,
                ...this.isolationGowns,...this.collectedIsolationGowns,
                ...this.sanitizers,...this.collectedSanitizers,
                ...this.respirators,...this.collectedRespirators,
                ...this.gloves,...this.collectedGloves, 
                ...this.hospitals,...this.bonusPointObjects]; 
    } 
    getArtefactPairs() 
    {
        return [
            {original:this.facemasks,collected:this.collectedFacemasks,tag:'facemask'},
            {original:this.isolationGowns,collected:this.collectedIsolationGowns,tag:'gown'},
            {original:this.sanitizers,collected:this.collectedSanitizers,tag:'sanitizer'},
            {original:this.respirators,collected:this.collectedRespirators,tag:'respirator'},
            {original:this.gloves,collected:this.collectedGloves,tag:'glove'} 
        ]; 
    } 
    /*Determines by how much the life of the player should be reduced upon collision with an infected node.
     *This is dependent on the artefacts(PPEs) the player currently has.*/ 
    getLifeReduction() 
    { 
        let lifeReduction = this.unitLifeReduction; 
        if(this.collectedSanitizers.length > 0)//if player has collected sanitizers
        {  
            lifeReduction = lifeReduction.toFixed(2); 
            lifeReduction -=  (this.unitLifeReduction * 0.40).toFixed(2);//set sanitizers use alone to be 40% effective  
        }
        if(this.collectedRespirators.length > 0)//if player has collected respirators
        { 
            lifeReduction = lifeReduction.toFixed(2); 
            lifeReduction -=  (this.unitLifeReduction * 0.25).toFixed(2);//set respirator use alone to be 25% effective 
        }
        if(this.collectedFacemasks.length > 0)//if player has collected facemasks
        { 
            lifeReduction = lifeReduction.toFixed(2); 
            lifeReduction -=  (this.unitLifeReduction * 0.20).toFixed(2);//set facemask use alone to be 20% effective 
        }
        if(this.collectedIsolationGowns.length > 0)//if player has collected isolation gown
        { 
            lifeReduction = lifeReduction.toFixed(2); 
            lifeReduction -=  (this.unitLifeReduction * 0.10).toFixed(2);//set isolation gown use alone to be 10% effective   
        }  
        if(this.collectedGloves.length > 0)////if player has collected gloves
        { 
            lifeReduction = lifeReduction.toFixed(2); 
            lifeReduction -=  (this.unitLifeReduction * 0.05).toFixed(2);//set glove use alone to be 5% effective   
        }  
        return lifeReduction; 
    }
    createPlayer()//create the player of the game
    { 
        return new Player(this.gameWidth,this.gameHeight,this.getPlayerSpeedForThisLevel());
    }  
    createInfected()//create nodes infected with COVID-19
    {
        let numOfNodes      = this.getNumOfInfectedNodesForThisLevel(); 
        let infectedNodes   = [];
        for(let i = 0; i< numOfNodes; i++)
        {  
            let nodeTouchedHospital = false; 
            let radius          =   0;//radius of innermost circle
            let outermostRadius =   0;//radius of outermost circle  
            let xCoordOfCenter  =   0;//x coordinate of the center of the circle
            let yCoordOfCenter  =   0;//y coordinate of the center of the circle
            for(;;)//node is only valid if it does not overlap or collide with a hospital 
            { 
                nodeTouchedHospital = false; 
                radius          =   2;//radius of innermost circle
                outermostRadius =   radius * 6;//radius of outermost circle  
                xCoordOfCenter  =   ~~((Math.random() * (this.gameWidth)) + 100 ) ;//a random number between 100 and the width of the screen.
                xCoordOfCenter  =   xCoordOfCenter + outermostRadius > this.gameWidth?//if xcoord is beyond the width of the canvas
                                        this.gameWidth - outermostRadius://position node to touch the right wall
                                        /*NB:Player starts from the left wall of the canvas, so give it some berth(of say this.startFinishOffset px)*/
                                        xCoordOfCenter + outermostRadius < this.startFinishOffset?//if xcoord is within the start box
                                            this.startFinishOffset + outermostRadius://position node just outside the start box
                                            xCoordOfCenter;//otherwise, keep the x position
                yCoordOfCenter  =   ~~((Math.random() * this.gameHeight) + 1);//a random number between 1 and the height of the screen. 
                let infectedNodeCoord = {x:xCoordOfCenter,y:yCoordOfCenter,radius:outermostRadius};

                this.hospitals.forEach(function(hospital)
                {
                    if(hospital.isTouched(infectedNodeCoord))//if the node position overlaps with the hospital position on the canvas
                    {
                        nodeTouchedHospital = true; 
                    }
                }); 
                if(!nodeTouchedHospital)//if the node position has NOT overlapped with the hospital position on the canvas
                {
                    break; //we have found our quarry.
                }
            }  
            let data = 
            {   
                width:this.gameWidth,
                height:this.gameHeight,
                speed:this.getSpeedOfInfectedNodesForThisLevel(), 
                startFinishOffset:this.startFinishOffset,
                x:xCoordOfCenter, 
                y:yCoordOfCenter,
                radius:radius,
                outermostRadius:outermostRadius
            }; 
            infectedNodes.push(new InfectedNode(data));  
        } 
        return infectedNodes; 
    }
    getNumOfInfectedNodesForThisLevel()
    {
        return 5 * this.levelNum; 
    } 
    setControls()
    { 
        let pausedPopUpPrompt = //prompt that shows when the user pauses the game
        `<article id='pausedpopup' class='hide-it'>
            <header> 
                <div class = 'row text-center'>
                    <label>Paused</label>
                    <h1>Press [Esc] to resume game.</h1> 
                </div>   
                <hr>
                <h1>Choose a Level</h1>  
                <select id='levelselect' class='form-control select2' style='width: 100%;'></select>
                <hr>
                <div class = 'row'>
                    <div class="col-xs-6 text-center">  
                        <button type='button' id='resumegamebutton' class='btn btn-warning btn-xs'>Resume Game</button>  
                    </div>
                    <div class="col-xs-6 text-center">
                        <button type='button' id='levelbutton' class='btn btn-success btn-xs'>Go To Level</button> 
                    </div> 
                </div>   
            </header>    
        </article>`; 
        let gameoverPopUpPrompt = //prompt that shows when the game is over
        `<article id='gameoverpopup' class='hide-it'>
            <header> 
                <div class = 'row text-center'>
                    <label>Gameover</label>
                </div> 
                <hr>  
                <h2>Reasons for Game Over :)</h2>
                <h2>--------------------------------------------------------</h2>
                <h2>You could not keep your social distance.</h2> 
                <h2>1. Your health is at 0%.You got sicker anytime you crushed into an infected node.</h2> 
                <h2>2. OR Your score is below 0.</h2>  
                <hr>  
                <p></p>
                <div class = 'row'>
                    <div class="col-xs-6 text-center">
                        <button type='button' id='restartbutton' class='btn btn-primary btn-xs'>Start All Over</button> 
                    </div>
                    <div class="col-xs-6 text-center">
                        <button type='button' id='replaylevelbutton' class='btn btn-warning btn-xs'>Replay Level</button> 
                    </div>
                </div> 
            </header>    
        </article>`; 
        let gameStatsIndicator = //prompt that shows the current statistics of the game
        `<article id='gamestatsindicator'>
            <header> 
                <h1>Level: <span id='gamestatslevel'></span></h1>  
                <h1>Score: <span id='gamestatsscore'></span></h1>  
                <div class="progress xs" id='healthprogress'></div> 
                <div class="progress xs hide-it" id='hospitalprogress'></div> 
                <div class="progress xs hide-it" id='facemaskprogress'></div>  
                <div class="progress xs hide-it" id='isolationgownprogress'></div>
                <div class="progress xs hide-it" id='respiratorprogress'></div>
                <div class="progress xs hide-it" id='gloveprogress'></div> 
                <div class="progress xs hide-it" id='goggleprogress'></div> 
                <div class="progress xs hide-it" id='sanitizerprogress'></div>  
            </header>   
        </article>`;
        let levelIntroPrompt = //prompt that shows at the start of every level
        `<article id='levelintropopup' class='hide-it'>
            <header> 
                <div class = 'row text-center'>
                    <label>Welcome to Level <span id='numOfLevel'></span> (<span id='nameOfLevel'></span>)</label> 
                </div>  
                <hr>  
                <h2>COVID-19 TIDBIT</h2>
                <h2>==============</h2>
                <span id='covid19tidbit'></span>   
                <hr> 
                <div class = 'row'>
                    <div class="col-xs-2"> 
                    </div>
                    <div class="col-xs-8 text-center">
                        <button type='button' id='startlevelbutton' class='btn btn-warning btn-xs'>Play Level</button>
                    </div>
                    <div class="col-xs-2"> 
                    </div>
                </div>   
            </header>    
        </article>`;  
        $('body').append(pausedPopUpPrompt);  
        $('body').append(gameoverPopUpPrompt);
        $('body').append(gameStatsIndicator);
        $('body').append(levelIntroPrompt); 
        $(function ()//Initialize Select2 Elements
        {   
            $('.select2').select2(); 
        }); 
        this.gameLevels.forEach(function(level)//fill the select element with the list of game levels
        { 
            let levelValue = `<option value='${level.id}'>${level.id} (${level.name})</option>`; 
            $('#levelselect').append(levelValue); //add to select element
        }); 
        $('#gamestatslevel').html(`${this.gameLevels[0].id} (${this.gameLevels[0].name})`);//set initial game level( level 1)  
          
        document.addEventListener('keydown',(event)=>
        {  
            let x = event.which || event.keyCode; 
            switch(x)
            { 
                case 27: //when esc key is pressed
                    if(!this.gameIsOver() && !this.newLevelIsIntroduced())//if it's not game over and new level prompt is not showing
                    {
                        this.togglePausedState();  
                    } 
                    break;  
            } 
        }); 
        //when user clicks button to resume a paused game
        document.getElementById('resumegamebutton').addEventListener('click',(event)=>
        {   
            this.togglePausedState();   
        });  
        //when user clicks button to start a level 
        document.getElementById('startlevelbutton').addEventListener('click',(event)=>
        {     
            this.toggleLevelIntroState();  
            document.getElementById('gamestatsindicator').classList.remove("hide-it"); //show the game stats indicator 
        }); 
        //when user clicks button to select a new level
        document.getElementById('levelbutton').addEventListener('click',(event)=>
        {   //get the selected level
            let selectedLevel =   Number(parseInt($(`#levelselect`).children("option").filter(":selected").val().trim()));  
            if(selectedLevel < 1 || selectedLevel > this.gameLevels.length)//validate the value of the selected level
            {
                selectedLevel = 1; 
            }   
            if(selectedLevel < this.getLevel())//keep score only if user selects same or higher level
            { 
                this.setGameScore(0);
            }
            else 
            { 
                this.setGameScore((Number(this.getGameScore()) + this.getLevelScore(this.playerData)));
            }
            this.setLevel(selectedLevel);//upgrade the level
            this.togglePausedState(); 
            this.createLevel();  
        });
        //when user clicks button to start all over from level 1
        document.getElementById('restartbutton').addEventListener('click',(event)=>
        {   
            this.setGameOver(false);  
            this.player.setLife(100);//restore player life to 100%
            this.setLevel(1);//upgrade level to level 1 
            this.setGameScore(0);//set score to 0 
            this.emptyArtefacts();//empty all artefacts 
            this.createLevel(); 
        });
        //when user clicks button to repeat the current level
        document.getElementById('replaylevelbutton').addEventListener('click',(event)=>
        {    
            this.setGameOver(false); 
            this.player.setLife(this.playerLifeOnStartOfNewLevel);//restore the life the player started the current level with 
            this.setGameScore(this.playerScoreOnStartOfNewLevel);//restore the score the player started the current level with
            this.bonusPointObjects = [];//clear the bonus and penalty point animation
            this.createLevel();   
        });
    }  
    createLevel()
    {  
        //set the background image for the level
        let imgNumber = this.levelNum % this.gameLevels.length;  
        if(imgNumber < 1)
        {
            imgNumber = this.gameLevels.length;
        }  
        let imgPath         = `img/bg${imgNumber}.jpg`;  
        this.img.src        = imgPath; 
        $('#gamestatslevel').html(`${this.levelNum} (${this.gameLevels[imgNumber -1].name})`);//display game level  
        this.createGameObjects();//create game objects for this level 
        let playerLife    = this.player.getLife(); 
        if(playerLife <= 0)//if player is dead(gameover)
        {
            playerLife = 100; 
            this.player.setLife(playerLife); //restore player health
        }
        if(playerLife === 100)//if the player is in perfect health(has not touched any infected nodes or health is restored after going to hospital)
        {
            this.player.setVelocityMagnitude(this.getPlayerSpeedForThisLevel());//set full speed for the level
        }
        else //if the player health is diminished, 
        {   
            this.player.setVelocityMagnitude(this.getPlayerSpeedForThisLevel() * playerLife/100);//adjust the speed to the health of the player
        }   
        this.player.setXCoordOfCenter(this.playerData.radius);//position player on the left wall of the canvas, at the ending vertical height of the previous level 
        this.player.setXFarthestPoint(this.playerData.radius);//reset the farthest distance the player has moved from the left wall.
        //if the background image is the image of a city at night... 
        if(imgNumber === 10 || imgNumber === 13 || imgNumber === 14 || imgNumber === 19 || imgNumber === 23 || imgNumber === 25 || imgNumber === 26 ) 
        {
            this.infected.forEach(function(infected)//...make the infected nodes purplish
            {
                infected.setInnerCircleColor('rgba(255,0,140,0.7)'); 
                infected.setOuterCircleColor('rgba(255,0,140,0.3)');  
            }); 
        }
        else //otherwise...
        {
            this.infected.forEach(function(infected)//...keep the black color
            {
                infected.setInnerCircleColor('rgba(0,0,0,0.7)'); 
                infected.setOuterCircleColor('rgba(0,0,0,0.3)');  
            }); 
        }
        this.states.nextLevelWait = true;//show prompt that introduces next level 
        document.getElementById('gamestatsindicator').classList.add("hide-it"); //hide the game stats indicator  
    }
    gameIsPaused() 
    {
        return this.states.paused;   
    } 
    newLevelIsIntroduced() 
    {
        return this.states.nextLevelWait; 
    }
    toggleLevelIntroState() 
    {
        this.states.nextLevelWait = !this.states.nextLevelWait;   
        if(!this.states.nextLevelWait)
        {   //hide the 'level intro' popup is user begins to play the level
            document.getElementById('levelintropopup').classList.add("hide-it");
        }
    }
    togglePausedState() 
    {
        this.states.paused = !this.states.paused;   
        if(!this.states.paused)
        {   //hide the 'paused' popup menu if game is resumed
            document.getElementById('pausedpopup').classList.add("hide-it");
        }
    }
    gameIsOver()
    { 
        return this.states.gameover; 
    }
    setGameOver(state)
    {
        this.states.gameover = state;
        if(!this.states.gameover)
        {   //hide the gameover popup menu if user decides to replay current level or start from level 1
            document.getElementById('gameoverpopup').classList.add("hide-it");
        } 
    } 
    getGameScore() 
    {
        return this.score; 
    } 
    setGameScore(score)
    {
        this.score = score; 
    }  
    getLevel()
    {
        return this.levelNum;
    }
    setLevel(level) 
    {
        this.levelNum = level;
    } 
    getGameWidth()
    {
        return this.gameWidth; 
    }
    getGameHeight()
    {
        return this.gameHeight; 
    }
    /**
    * Let game respond to window resizing.
    * @param  {number} screenHeight The height of the screen. 
    * @param  {number} screenWidth  The width of the screen.  
    */
    resize(screenHeight,screenWidth)
    { 
        if(this.gameHeight !== screenHeight || this.gameWidth !== screenWidth)//if the screen size has changed
        { 
            let dy          = screenHeight/this.gameHeight;//percentage change in browser window height 
            let dx          = screenWidth/this.gameWidth;  //percentage change in browser window width  
            this.gameHeight = screenHeight;  
            this.gameWidth  = screenWidth;  
            this.player.resize(screenHeight,screenWidth,dx,dy);//resize the player's position 
            //resize all other components of the game 
            this.getGameObjects().forEach(function(gameObject)
            {
                gameObject.resize(screenHeight,screenWidth,dx,dy);  
            });  
        } 
    }   
    levelIsCompleted(playerData)
    { 
        //if player touches the right wall of the canvas,then the level is completed
        if(playerData.x + playerData.radius> this.gameWidth)
        {
            return true; 
        }
        return false; 
    }
    getLevelScore()//the score at the current level
    { 
        let levelScore = 0; 
        if(this.playerData.xfarthest > this.playerData.radius)//if player has moved forwards since the start of the level
        {
            levelScore = ((this.playerData.xfarthest/this.gameWidth) * 100).toFixed(2);  
        }
        return levelScore; 
    }  
    getBonusPoint(tag)//get the bonus to give to player for every artefact collected
    { 
        switch(tag) 
        { 
            case 'gown': 
                return 10; 
            case 'facemask': 
                return 20;  
            case 'sanitizer': 
                return 40; 
            case 'respirator': 
                return 25; 
                break; 
            case 'glove': 
                return 5;  
        } 
        return 0; 
    }
    pushAndPopArtefacts(tag,i)
    { 
        switch(tag) 
        { 
            case 'gown': 
                this.collectedIsolationGowns.push(this.isolationGowns[i]);//consider the isolation gown as collected 
                this.isolationGowns.splice(i,1);//delete the isolation gown so it doesn't show on the screen anymore 
                break; 
            case 'facemask': 
                this.collectedFacemasks.push(this.facemasks[i]);//consider the facemask as collected 
                this.facemasks.splice(i,1);//delete the facemask so it doesn't show on the screen anymore 
                break;
            case 'sanitizer': 
                this.collectedSanitizers.push(this.sanitizers[i]);//consider the sanitizer as collected 
                this.sanitizers.splice(i,1);//delete the sanitizer so it doesn't show on the screen anymore  
                break; 
            case 'respirator': 
                this.collectedRespirators.push(this.respirators[i]);//consider the respirator as collected 
                this.respirators.splice(i,1);//delete the respirator so it doesn't show on the screen anymore 
                break; 
            case 'glove': 
                this.collectedGloves.push(this.gloves[i]);//consider the glove as collected 
                this.gloves.splice(i,1);//delete the glove so it doesn't show on the screen anymore 
                break;   
        } 
    }
    setArtefactIsCollected(tag,index)
    {
        switch(tag) 
        {
            case 'gown': 
                this.isolationGowns[index].setIsCollected(true);  
                break; 
            case 'facemask':  
                this.facemasks[index].setIsCollected(true); 
                break;
            case 'sanitizer':  
                this.sanitizers[index].setIsCollected(true); 
                break; 
            case 'respirator':   
                this.respirators[index].setIsCollected(true);  
                break; 
            case 'glove':   
                this.gloves[index].setIsCollected(true);
                break;  
        }
    }
    hideProgress(tag,state)//hides the progress bar for every artefact that is exhausted in its use
    {
        switch(tag) 
        { 
            case 'gown': 
                state? document.getElementById('isolationgownprogress').classList.add("hide-it"):document.getElementById('isolationgownprogress').classList.remove("hide-it");  
                break; 
            case 'facemask': 
                state? document.getElementById('facemaskprogress').classList.add("hide-it"):document.getElementById('facemaskprogress').classList.remove("hide-it");  
                break;
            case 'sanitizer': 
                state? document.getElementById('sanitizerprogress').classList.add("hide-it"):document.getElementById('sanitizerprogress').classList.remove("hide-it");  
                break; 
            case 'respirator': 
                state? document.getElementById('respiratorprogress').classList.add("hide-it"):document.getElementById('respiratorprogress').classList.remove("hide-it");  
                break; 
            case 'glove': 
                state? document.getElementById('gloveprogress').classList.add("hide-it"):document.getElementById('gloveprogress').classList.remove("hide-it");  
                break; 
            case 'goggle': 
                state? document.getElementById('goggleprogress').classList.add("hide-it"):document.getElementById('goggleprogress').classList.remove("hide-it");  
                break; 
        }
    }
    setArtefactIsInUse(tag)
    {      
        switch(tag) 
        {
            case 'gown': 
                this.collectedIsolationGowns[0].setIsInUse(true); 
                break; 
            case 'facemask': 
                this.collectedFacemasks[0].setIsInUse(true);  
                break;
            case 'sanitizer': 
                this.collectedSanitizers[0].setIsInUse(true);   
                break; 
            case 'respirator': 
                this.collectedRespirators[0].setIsInUse(true);  
                break; 
            case 'glove': 
                this.collectedGloves[0].setIsInUse(true);  
                break; 
        } 
    }
    displayProgress(lifespan,tag,numOfCollectedArtefacts)//displays the progress bar for every artefact in use
    {
        switch(tag) 
        {
            case 'gown': 
                document.getElementById('isolationgownprogress').innerHTML =`<div class="progress-bar progress-bar-warning progress-bar-striped active" style="width: ${lifespan}%;">Gown(${numOfCollectedArtefacts})</div>`; 
                break; 
            case 'facemask': 
                document.getElementById('facemaskprogress').innerHTML =`<div class="progress-bar progress-bar-warning progress-bar-striped active" style="width: ${lifespan}%;">Facemask(${numOfCollectedArtefacts})</div>`; 
                break;
            case 'sanitizer': 
                document.getElementById('sanitizerprogress').innerHTML =`<div class="progress-bar progress-bar-warning progress-bar-striped active" style="width: ${lifespan}%;">Sanitizer(${numOfCollectedArtefacts})</div>`; 
                break; 
            case 'respirator':
                document.getElementById('respiratorprogress').innerHTML =`<div class="progress-bar progress-bar-warning progress-bar-striped active" style="width: ${lifespan}%;">Respirator(${numOfCollectedArtefacts})</div>`; 
                break; 
            case 'glove': 
                document.getElementById('gloveprogress').innerHTML =`<div class="progress-bar progress-bar-warning progress-bar-striped active" style="width: ${lifespan}%;">Glove(${numOfCollectedArtefacts})</div>`; 
                break; 
            case 'goggle': 
                document.getElementById('goggleprogress').innerHTML =`<div class="progress-bar progress-bar-warning progress-bar-striped active" style="width: ${lifespan}%;">Goggle(${numOfCollectedArtefacts})</div>`; 
                break;
        }       
    }
    popCollectedArtefact(tag)//gets rid of the first collected artefact in the queue(the one that is currently in use and exhausted in its use)
    {
        switch(tag) 
        {
            case 'gown': 
                this.collectedIsolationGowns.splice(0,1);//get rid of it
                if(this.collectedIsolationGowns.length === 0)//if player has no more collected isolation gowns
                {    
                    this.hideProgress(tag,true);  
                } 
                break; 
            case 'facemask':
                this.collectedFacemasks.splice(0,1);//get rid of it
                if(this.collectedFacemasks.length === 0)//if player has no more collected facemasks
                {    
                    this.hideProgress(tag,true);  
                }  
                break;
            case 'sanitizer': 
                this.collectedSanitizers.splice(0,1);//get rid of it
                if(this.collectedSanitizers.length === 0)//if player has no more collected sanitizers
                {    
                    this.hideProgress(tag,true);  
                }   
                break; 
            case 'respirator': 
                this.collectedRespirators.splice(0,1);//get rid of it
                if(this.collectedRespirators.length === 0)//if player has no more collected respirators
                {    
                    this.hideProgress(tag,true);  
                } 
                break; 
            case 'glove': 
                this.collectedGloves.splice(0,1);//get rid of it
                if(this.collectedGloves.length === 0)//if player has no more collected gloves
                {    
                    this.hideProgress(tag,true);  
                } 
                break;  
        }  
    }
    displayProgressOfArtefacts(artefactPairs) 
    { 
        /*NB: Artefact pairs consist of the original artefacts (those created at the start of the level), 
         * and the collected artefacts(original artefacts that have been touched by the player)*/
        for(let k = 0; k < artefactPairs.length; k++)//for each artefact pair
        {
            let artefactPair= artefactPairs[k];
            //sort out the artefact pair
            let original    = artefactPair.original; //get the original artefact
            let collected   = artefactPair.collected;//get the collected artefact 
            let tag         = artefactPair.tag;//tag helps to know the type of artefact. Whether it's a facemask, respirator,gown, etc.   
            for(let i = 0; i < original.length; i++)//for each original artefact
            { 
                let artefact = original[i];
                if(artefact.getIsCollected())//if the original artefact is already collected by the player...
                { 
                    //display bonus point
                    let artefactData= artefact.getData();  
                    let bonusScore  = this.getBonusPoint(tag);
                    let data = 
                    {
                        gameWidth:this.gameWidth,
                        gameHeight:this.gameHeight,
                        score:bonusScore,
                        x:artefactData.x,
                        y:artefactData.y,
                        up:true//true if it is going up, false if it is going down
                    }; 
                    this.bonusPointObjects.push(new BonusPoint(data));//start the bonus point animation
                    this.setGameScore((Number(this.getGameScore())+bonusScore).toFixed(2));//add the bonus point to the current game score
                    this.pushAndPopArtefacts(tag,i);  
                    continue; //skip
                } 
                if(artefact.isTouched(this.playerData)) 
                {
                    this.setArtefactIsCollected(tag,i);  
                }
            };  
            if(collected.length > 0)//if there are collected artefacts
            {   
                this.hideProgress(tag,false);//show the progress bar for that artefact
                //get the first artefact 
                let collectedArtefact = collected[0];//only deal with the very first collected artefact(like in a queue data structure)
                if(!collectedArtefact.getIsInUse())//if the collected artefact is not in use
                {
                    this.setArtefactIsInUse(tag);//set it to be in use   
                }
                let lifespan = collectedArtefact.getLifeSpan();  
                if(lifespan <= 0)//if the artefact is exhausted in its use
                {
                    this.popCollectedArtefact(tag); 
                }
                else 
                {  
                    this.displayProgress(lifespan,tag,collected.length);//display how much of the artefact has been used
                }
            } 
        }   
    }
    displayHospitalStatus()//Check if player is in hospital 
    {  
        for(let i = 0; i < this.hospitals.length; i++) 
        {   
            let hospital = this.hospitals[i]; 
            if(hospital.playerIsInHospital(this.playerData))//if the player is in a hospital
            {       
                this.hospitals[i].setIsInHospital(true);  
                document.getElementById('hospitalprogress').classList.remove("hide-it");  
                let lifespan = this.hospitals[i].getLifeSpan();
                if(lifespan <= 0)//if the hospital has finished healing the patient
                {
                    this.hospitals.splice(i,1);//get rid of it     
                    document.getElementById('hospitalprogress').classList.add("hide-it");  
                }
                else//if hospital is still healing the patient
                {
                    //increase player health by 15%
                    let playerLife = this.player.getLife(); 
                    if(playerLife < 100) 
                    { 
                       playerLife += 0.015;  
                       this.player.setVelocityMagnitude(this.getPlayerSpeedForThisLevel() * playerLife/100);//increase the speed 
                       this.player.setLife(playerLife);  
                    }
                    document.getElementById('hospitalprogress').innerHTML =`<div class="progress-bar progress-bar-success progress-bar-striped active" style="width: ${lifespan}%;">Hospital</div>`; 
                }
                break; 
            }
            else//if player is not in a hospital 
            { 
                this.hospitals[i].setIsInHospital(false);
                document.getElementById('hospitalprogress').classList.add("hide-it"); 
            } 
        };    
    }  
    checkBonusPointForDeletion()//get rid of bonus/penalty animation if rectangle disappears beyond the vertical edge of the canvas
    {
        for( let i = 0; i < this.bonusPointObjects.length; i++)
        {
            let bonus= this.bonusPointObjects[i];
            let coord = bonus.getData(); 
            if(coord.y+coord.size < 0 || coord.y > this.gameHeight )//if the object disappears above or below the canvas
            {
                this.bonusPointObjects.splice(i,1);//get rid of it 
            } 
        }
    } 
    updatePlayerHealth(playerLife)
    {
        this.player.setLife(playerLife);   
        document.getElementById('healthprogress').innerHTML =`<div class="progress-bar progress-bar-danger progress-bar-striped active" style="width: ${playerLife}%;">Life(${Math.ceil(playerLife)}%)</div>`; 
    } 
    update(deltaTime)
    {        
        if(!this.gameIsPaused() && !this.gameIsOver() && !this.newLevelIsIntroduced() )//if game is not paused or over or level introduction prompt is not showing
        {  
            if(Number(this.getGameScore()) < 0 )//if the score is below zero, it's a game over
            {
                this.setGameOver(true); 
                //update score 
                let 
                scoreAtThisLevel    = Number(this.getLevelScore()),
                scoreAtPreviousLevel= Number(this.getGameScore()),
                score = scoreAtPreviousLevel + scoreAtThisLevel;   
                $('#gamestatsscore').html(score % 100 === 0? `${score}.00`:`${score.toFixed(2)}`);//display the current score 
            }
            else //if the score is not below 0
            {
                this.closeInfectedNodes = []; 
                this.playerData = this.player.getData();//get the latest coordinates of the player on the canvas
                let playerData  = this.playerData;
                let playerLife  = this.player.getLife();  
                let gameIsOver  = false;  
                this.noCollisionsAtAll = true;//true if any of the nodes collide with the player in this animation frame
                for(let i = 0; i < this.infected.length; i++)//check if player has collided with any infected nodes
                {    
                    let infected = this.infected[i];
                    let collisionData = infected.collisionDetected(playerData,this.linkDistance);
                    if(collisionData.collisionCoordinates.length > 0)//if infected node is close to player(within 25 ft)
                    {   
                        this.closeInfectedNodes.push(collisionData.collisionCoordinates[0]);//get the coordinates of the infected node
                    }
                    if(collisionData.collided)//if player collides with any infected nodes 
                    { 
                        playerLife    -= this.getLifeReduction(); //diminish life
                        this.player.setVelocityMagnitude(this.getPlayerSpeedForThisLevel() * playerLife/100);//dminish the speed of the player 
                        this.player.setOuterCircleColor('rgba(128,0,0,0.3)');//colour outer circle of player node as a more transparent maroon
                        this.player.setInnerCircleColor('rgba(128,0,0,0.7)');//colour inner circle of player node as a less transparent maroon 
                        this.noCollisionsAtAll = false;
                        //set the amount to subtract from the score ( as a penalty for colliding with an infected node)
                        let penalty = this.getPenaltyForThisLevel();
                        this.tempPenaltyStore += penalty;   
                        if(playerLife <= 0)//if health is extinguished, game is over 
                        {
                            gameIsOver = true;  
                        }
                        break; 
                    } 
                    else 
                    { 
                        this.player.setOuterCircleColor('rgba(255,255,255,0.3)');
                        this.player.setInnerCircleColor('rgba(255,255,255,0.7)'); 
                    }
                }
                if(gameIsOver) 
                {
                    playerLife = 0;  
                    this.updatePlayerHealth(playerLife); 
                    this.setGameOver(true); 
                }   
                else if(this.levelIsCompleted(this.playerData))//if level is completed
                {
                    this.playerLifeOnStartOfNewLevel = playerLife;  
                    this.setLevel(this.getLevel()+1);//upgrade to the next level
                    
                    this.setGameScore((Number(this.getGameScore())+100).toFixed(2));//update the game score
                    this.playerScoreOnStartOfNewLevel = this.getGameScore(); 
                    this.activeInfo = this.covid19tidbits[~~(Math.random() * (this.covid19tidbits.length-1))];//choose a random tidbit to display at the new level prompt
                    this.createLevel();//create the next level
                }
                else//if level is not complete
                {  
                    if(this.noCollisionsAtAll && this.tempPenaltyStore > 0)//if player collided with some infected nodes
                    {  
                        let data = //set the penalty for the player 
                        {
                            gameWidth:this.gameWidth,
                            gameHeight:this.gameHeight,
                            score:this.tempPenaltyStore,
                            x:playerData.x,
                            y:playerData.y,
                            up:false//true if it is going up, false if it is going down
                        }; 
                        this.bonusPointObjects.push(new BonusPoint(data));
                        this.setGameScore((Number(this.getGameScore())-this.tempPenaltyStore).toFixed(2)); 
                        this.tempPenaltyStore = 0;//reset the temporary store 
                    } 
                    this.updatePlayerHealth(playerLife);   
                    this.displayHospitalStatus();//check if player has lodged into a hospital or not
                    this.checkBonusPointForDeletion();//if bonus animation is above the top of the canvas, then delete it
                    this.displayProgressOfArtefacts(this.getArtefactPairs());  
                    this.player.update(deltaTime);  
                    //update all game objects
                    this.getGameObjects().forEach(function(gameObject)
                    {
                        gameObject.update(deltaTime); 
                    }); 
                    //check if an infected node has collided with a hospital 
                    let hospitals = this.hospitals; 
                    this.infected.forEach(function(infected)
                    {
                        infected.checkHospitalCollision(hospitals); 
                    }); 
                } 
                //update score 
                let 
                scoreAtThisLevel    = Number(this.getLevelScore()),
                scoreAtPreviousLevel= Number(this.getGameScore()),
                score = scoreAtPreviousLevel + scoreAtThisLevel;   
                $('#gamestatsscore').html(score % 100 === 0? `${score}.00`:`${score.toFixed(2)}`);//display the current score 
            }      
        }  
    }          
    writeStart(ctx)//draw the START box at the left edge of the canvas
    {  
        ctx.save();//start by saving the current context (current orientation, origin)  
        ctx.translate(10, this.gameHeight/2);//when we rotate we will be pinching the top-left hand corner with our thumb and finger 
        ctx.rotate( Math.PI / 2 );//now rotate the canvas anti-clockwise by 90 degrees,holding onto the translate point 
        ctx.font = "18px serif";//specify the font and colour of the text
        ctx.fillStyle = "white";
        // set alignment of text at writing point (center)
        ctx.textAlign = "center"; 
        // write the text
        ctx.fillText( "START", 0, 0 ); 
        // now restore the canvas flipping it back to its original orientation
        ctx.restore();
    }
    writeFinish(ctx)//draw the FINISH box at the right edge of the canvas
    {  
        ctx.save();//start by saving the current context (current orientation, origin)  
        ctx.translate(this.gameWidth + 10 - this.startFinishOffset, this.gameHeight/2);//when we rotate we will be pinching the top-left hand corner with our thumb and finger 
        ctx.rotate( Math.PI / 2 );//now rotate the canvas anti-clockwise by 90 degrees,holding onto the translate point 
        ctx.font = "18px serif";//specify the font and colour of the text
        ctx.fillStyle = "white";
        // set alignment of text at writing point (left-align)
        ctx.textAlign = "center"; 
        // write the text
        ctx.fillText( "FINISH", 0, 0 ); 
        // now restore the canvas flipping it back to its original orientation
        ctx.restore();
    }
    draw(ctx)
    {  
        ctx.drawImage(this.img,0, 0,this.gameWidth,this.gameHeight);  //draw background image 
        //draw START box 
        ctx.beginPath();
        ctx.rect(0,0,this.startFinishOffset,this.gameHeight); 
        ctx.fillStyle   = "rgba(50,205,50,0.5)";//green
        ctx.fill(); 
        this.writeStart(ctx);
        //draw FINISH box 
        ctx.beginPath();
        ctx.rect(this.gameWidth - this.startFinishOffset,0,this.startFinishOffset,this.gameHeight); 
        ctx.fillStyle   = "rgba(178,34,34,0.5)";//red
        ctx.fill(); 
        this.writeFinish(ctx); 
        
        if(this.gameIsPaused())//if game is paused
        { 
            this.displayPausedStatus(ctx);//show the 'paused' popup menu 
        } 
        if(this.gameIsOver())//if game is over 
        { 
            this.displayGamoverStatus(ctx);//show the 'gameover' popup menu  
        }  
        if(this.newLevelIsIntroduced())//if player is waiting to play new level 
        {
            this.displayNewLevelIntro(ctx);//show the 'level introduction' popup menu  
        }
        
        this.player.draw(ctx);//draw the player 
        //draw all game objects
        this.getGameObjects().forEach(function(gameObject)
        {
            gameObject.draw(ctx);  
        });   
        
        //draw link to other nodes that are within 25 feet distance from player
        let playerData = this.playerData;  
        let gameWidth = this.gameWidth; 
        this.closeInfectedNodes.forEach(function(nodePosition)
        {    
            //draw link to other nodes that are within 25 feet distance from player
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1; 
            ctx.beginPath();  
            ctx.moveTo(playerData.x,playerData.y);  
            ctx.lineTo(nodePosition.x, nodePosition.y);   
            ctx.stroke();
            ctx.closePath();
            
            //draw rectangle around caption
            let text = `${(nodePosition.distance/4).toFixed(2)} ft`;//player distance from infected node in feet
            let textWidth = ctx.measureText(text).width;
            let rectX = nodePosition.x; 
            if(nodePosition.x + textWidth > gameWidth)//if the bonus animation is beyond the right edge of the canvas
            {
               rectX =  gameWidth - textWidth;//adjust it 
            }   
            ctx.beginPath(); 
            ctx.rect(rectX,nodePosition.y,textWidth,17); 
            ctx.fillStyle   = 'rgba(255,255,255,0.5)';//white
            ctx.fill();
            //draw caption
            ctx.font =  "14px arial";//set the font of the text
            ctx.fillStyle = "blue";//set color of text
            ctx.textAlign = "left";//set alignment of text at writing point(left-align)  
            ctx.fillText(text,rectX, nodePosition.y + 17);//write the text
            ctx.closePath();  
        }); 
    }
    displayPausedStatus(ctx) 
    {
        //darken the whole game screen
        ctx.rect(0,0,this.gameWidth,this.gameHeight); 
        ctx.fillStyle   = "rgba(0,0,0,0.5)";
        ctx.fill(); 
        //display the 'paused' popup menu
        document.getElementById('pausedpopup').classList.remove("hide-it"); 
    }
    displayGamoverStatus(ctx) 
    {
        //darken the whole game screen
        ctx.rect(0,0,this.gameWidth,this.gameHeight); 
        ctx.fillStyle   = "rgba(0,0,0,0.5)";
        ctx.fill(); 
        //display the 'gameover' popup menu
        document.getElementById('gameoverpopup').classList.remove("hide-it"); 
    } 
    displayNewLevelIntro(ctx)
    {
        //darken the whole game screen
        ctx.rect(0,0,this.gameWidth,this.gameHeight); 
        ctx.fillStyle   = "rgba(0,0,0,0.5)";
        ctx.fill();  
        //display the 'level introduction' popup menu 
        document.getElementById('numOfLevel').innerHTML = `${this.levelNum}`;
        let index = this.levelNum % this.gameLevels.length === 0? this.gameLevels.length: this.levelNum % this.gameLevels.length;  
        document.getElementById('nameOfLevel').innerHTML = `${this.gameLevels[index-1].name}`; 
        document.getElementById('covid19tidbit').innerHTML = `${this.activeInfo}`; 
        document.getElementById('levelintropopup').classList.remove("hide-it"); 
    }
    getSpeedOfInfectedNodesForThisLevel()
    { 
        let maxSpeed = 0.25 * 15; 
        let speed = 0.25 * this.levelNum; 
        if(speed >  maxSpeed)
        {
            speed = maxSpeed; 
        } 
        return speed; 
    }
    getPlayerSpeedForThisLevel()
    {   
        let maxSpeed = (0.5 * 15)+2; 
        let speed = (0.5 * this.levelNum)+2;//make player slightly faster than infected nodes(though infected nodes may pick up speed with time)
        if(speed >  maxSpeed)
        {
            speed = maxSpeed; 
        } 
        return speed;  
    } 
    getPenaltyForThisLevel() 
    {
        return 5 + this.levelNum * 2;
    }
}
