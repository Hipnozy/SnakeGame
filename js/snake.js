function getBaseSize() {
    return Math.round((window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth) / 30);
}

function getRandomColor() {
	var colors = ["purple", "red", "green", "yellow", "blue", "gray", "brown", "cyan", "orange", "pink"];
	return colors[Math.floor(Math.random() * colors.length)];
}

Array.prototype.findById = function(id, deleteRecord) {
	for (var i = 0; i < this.length; i++) {
		if (this[i].id === id) {
			if (deleteRecord) {
				this.splice(i, 1);
            }
            
			return true;
		}
	}
	return false;
};

window.onresize = function () {
    buildArena(false);
};

function buildArena(firstTime) {
    var divID = 0, objDiv;
    var base = getBaseSize();
    var arena = document.getElementById("Arena");

    var baseSize = base + "px";
    arena.style.width = (base * 20) + "px";
    arena.style.height = (base * 20) + "px";

    for (var y = 1; y <= 20 ; y++) {
        for (var x = 1; x <= 20 ; x++) {
            if (firstTime) {
                objDiv = document.createElement("div");
                objDiv.id = ++divID;
            } else {
                objDiv = document.getElementById(++divID);
            }

            objDiv.style.height = baseSize;
            objDiv.style.width = baseSize;
            objDiv.className = "ArenaBlock";

            document.getElementById("Arena").appendChild(objDiv);
        }
    }
}

function Section(properties) {
	this.id			= properties.id;
	this.color		= properties.color;
	this.hasFruit	= properties.hasFruit;
	this.div		= document.getElementById(this.id);

	this.draw = function() {
		this.changeColor(this.color);
	};

	this.erase = function() {
		this.changeColor("");
	};
	
	this.changeColor = function(color) {
		this.div.style.backgroundColor = color;
	};
}

function Fruit(properties) {
    Section.apply(this, arguments);
}

function Snake(properties) {
    this.sections = [];
    this.fruitsEaten = [];
    this.speed = 170;
    this.fruitEaten = false;
    this.lastFruit = 0;
	this.done = false;
	this.score = 0;
}

Snake.prototype = {

	//Sets and prepare all the needed process to start the game
	init : function() {
	    buildArena(true);
		KeyInput.startListening();

		for (var i = 1; i < 3 ; i++) {
			this.addSection(this.buildSection(i));
		}

		this.spawnFruit();
	}

	//Add the section object in the list and draws it
	,addSection : function(objSection) {
		this.sections.push(objSection);
		objSection.draw();
	}

	//Remove the object section from the list and erases it
	,removeSection : function(objSection) {
		this.sections.findById(objSection.id, true);
		objSection.erase();
	}

	//Returns a object section
	,buildSection : function(id, color, hasFruit) {
		return new Section({
			id        : id
			,color    : color ? color : "black" 
			,hasFruit : (hasFruit || false)
		});
	}

	//Intro method to start the game
	,startGaming : function() {
		this.init();
		this.cycle();
	}

	//Game cycle called every gaming loop	
	,cycle : function() {
		this.move();
		this.setGamingLoop();
	}

	//Sets the infinite gaming loop, with the dynamic speed
	,setGamingLoop : function() {
		if (this.done) return;
		
		with (this) {
			this.t = setTimeout(function(){ cycle(); }, speed);
		}
	}

	//Do all the movement logic
	,move : function() {
	    var nextMove = KeyInput.getLastCursor(this.getHeadSection().id);

		//Remove the last section of the snake IF there isn't a fruit on the same place
		if (this.getTailSection().id != this.fruitsEaten[0] || !this.fruitsEaten[0]) {
			this.removeSection(this.getTailSection());
        } else {
			this.fruitsEaten.splice(0, 1);
        }
		
		//If there is any part of the snake body in the way, the player is defeated and the game is reloaded
		if (this.sections.findById(nextMove, false)) {
			this.showDefeatedMessage();
        }

		//Add a new section after the head of the snake, in the informed direction
		this.addSection(this.buildSection(nextMove));

        //Spawn new fruit only if the last one was eaten
		if (this.lastFruit == this.getHeadSection().id) {
		    this.spawnFruit();
		    this.addSectionToFruitsEaten();
		    this.addPoints();
		    this.accelerate();
		}
	}

	//Return the head section of the snake
	,getHeadSection : function() {
		return this.sections[this.sections.length - 1];
	}

	//Return the tail section of the snake
	,getTailSection : function() {
		return this.sections[0];
	}

	//Spawn the fruit on the arena when the last one is eaten
	,spawnFruit : function() {	
		var fruit = new Fruit({
		    id: this.getRandomFruitID(),
            color: getRandomColor()
		});

		fruit.draw();
		this.lastFruit = fruit.id;
	}
	
	,getRandomFruitID: function() {
		while (true) {
		    var fruitID = Math.ceil(Math.random() * 400);

		    if (!this.sections.findById(fruitID, false)) {
		        return fruitID;
            }
		}
	}

    //Accelerate the speed of the snake, according to the current speed
    ,accelerate: function () {
        this.speed -= this.speed > 120 ? 2 : 1;
    }

    //Add the current head section of the snake to the fruitsEaten array, so later it can be a whole new section of the snake
    ,addSectionToFruitsEaten: function () {
        this.fruitsEaten.push(this.getHeadSection().id);
    }

    //Add points to the score system
    ,addPoints: function () {
        this.score += 10;
        document.getElementById("Score").innerHTML = "Score: " + this.score;
    }

    //Shows a message and restart the game
	,showDefeatedMessage: function() {
		this.done = true;
		alert("You lose bro.\nScore: " + this.score);
		location.reload();
	}
};