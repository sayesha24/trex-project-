var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var bg_img, bg; 

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");


  bg_img= loadImage("tbackground_image.png")
}

function setup() {
  createCanvas(600, 200);
  
  

  //bg= createSprite(0, 0, 600, 200);
  //bg.addImage(bg_img);
  //bg.scale= 2;


  
  trex = createSprite(50,50,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  
  ground = createSprite(50,180,1000,5);
  //ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  //ground.velocityX = -(6 + 3*score/100);
  ground.visible= true;

  gameOver = createSprite(300, 30);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300, 70);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(50,150,400,10);
  invisibleGround.visible = false;
  invisibleGround.x = invisibleGround.width /2;
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

  camera.width= 200;
}

function draw() {
  //trex.debug = true;
  background("white");
 
  trex.x= camera.position.x;
  
console.log(camera.position.x);

  if (gameState===PLAY){
    
   ground.velocityX = 3;
   score = score + Math.round(getFrameRate()/60);

   if(camera.position.x > ground.width/2 + 300){

    camera.position.x= 200;
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    
    }

    if(frameCount% 2=== 0){

      score ++;
      
    }
    camera.position.x += 7;

    if(keyDown("space") && trex.y >= 80) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
if (ground.x < 0){
     ground.x = ground.width/2;
      
  }

  if (invisibleGround.x < 0){
    invisibleGround.x = invisibleGround.width/2;
     
 }
  
    trex.collide(ground);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    gameOver.x= camera.position.x;

    restart.visible = true;
    restart.x= camera.position.x;
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
  text("Score: "+ score, camera.position.x + 200,50);
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount% 60=== 0) {
    var cloud = createSprite(camera.position.x,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount%100 === 0) {
    var obstacle = createSprite(camera.position.x,130,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  camera.position.x= 200;
  trex.x= 50;
  

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running",trex_running);

  //if(localStorage["HighestScore"]<score){
    //localStorage["HighestScore"] = score;
  //}
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}