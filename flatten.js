class textline {
	constructor(content, xpos) {
		this.content = content;
		this.xpos = xpos;
	}
}

let textlines = [];
let fontheight;
let hammerPos;
let level = 1;
let maxlevel = 8;
let updating = true;
let outbreak = true;
let inTransition = false;
let transitionTicker = 0;
let tTick = 3;
let backgroundColor = 0;
let textColor = 255;

let goodWords = ['Clorox®', 'stay home', 'zoombomb', 'social distance', '😷', '3M™', 'quarantine', 'lockdown', 'HEPA filter', 'PCR test', 'PURELL®', 'stimulus bill', 'remote work', '6 ft.', 'mask mandate', 'mRNA 🧬', '🧼', '💊', '👩‍⚕️👨‍⚕️', '💉'];
let badWords = ['superspread', 'indoor dine', 'rally', 'club', '🤒', 'r number', 'rose garden', 'buffet', 'all you can eat', 'manicure', 'haircut', 'herd immunity', '🦠', 'hydroxychloroquine '];

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(backgroundColor);
	//textSize(20);
	fontheight = 21;
	
	hammerPos = windowWidth/2;	
	generateLine(1, badWords);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	hammerPos = windowWidth/2;
	
	// Center lines in new window size
	oldCenter = textlines[ textlines.length - 1 ].xpos;
	for (let l of textlines) {
		l.xpos += hammerPos - oldCenter;
	}
	background(0);
}

function draw() {
	background(backgroundColor);
	
	fill(textColor);
	noStroke();
	textFont("monospace");
	
	drawlogo();
	
	rotate(-PI/2);
	textSize(21);
	
	if (updating) {
		updatelines(textlines);
	}
	for (let l of textlines) {
		drawline(l);
	}
	
	if (inTransition) {
		transitionTicker += tTick;
		if (transitionTicker >= 255) {
			inTransition = false;
			transitionTicker = 0;
		} else {
			if (!outbreak) {
				backgroundColor += tTick;
				textColor -= tTick;
			} else {
				backgroundColor -= tTick;
				textColor += tTick;
			}
		}
	}
}

function drawlogo() {
	textSize(40);
	textAlign(RIGHT);
	text("Flatten the Curve", windowWidth*0.95, 0.93*windowHeight);
	textSize(20);
	text("(👉💥🖱️)", windowWidth*0.95, 25+0.93*windowHeight);
	textAlign(LEFT);
}

function drawline(textline) {
	text(textline.content, -windowHeight, textline.xpos);
}

function updatelines(textlines) {
	for (let l of textlines) {
		l.xpos -= 0.75;
	}
	if (textlines[0].xpos < 0) {
		textlines.shift();
	}
	if (textlines[ textlines.length - 1 ].xpos < (hammerPos - fontheight)) {
		generateLine(Math.floor(level), ( (outbreak) ? badWords : goodWords ));
		if (outbreak) {
			level = Math.min(level + Math.random()/5, maxlevel);
		} else {
			level = Math.max(level - Math.random()/3, 1);
		}
	}
}

function pickRandomElement(list) {
	return list[Math.floor(Math.random() * list.length)];
}

function generateLine(nwords, list) {
	string = '';
	for (i = 0; i < nwords; i++) {
		string += pickRandomElement(list) + ' ';
	}
	textlines.push( new textline(string, hammerPos) );
}

function mousePressed() {
	updating = false;
}

function mouseReleased() {
	updating = true;
}

function mouseClicked() {
	if (!inTransition) {
		inTransition = true;
		if (outbreak) {
			outbreak = false;
		} else {
			outbreak = true;
		}
	}
}