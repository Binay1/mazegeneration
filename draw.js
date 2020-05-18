//Recursive back-tracker
// Algo: https://en.wikipedia.org/wiki/Maze_generation_algorithm

let cols, rows; //number of rows and columns
const width = 40; // This will also be the height, since each cell is a square
let grid = []; // Array of all cells
let current; // Current cell
let stack = []; //keeps track of the path followed to create the maze

// P5.js function: runs only once initially
function setup() {
    let canvas = createCanvas(800,800);
    cols = canvas.width/width;
    rows = canvas.height/width; // Cols and rows can also be just one variable since, again,
                                // we're just talking about squares
    //frameRate(6);
    for(let i=0;i<rows;i++) {
        for(let j=0;j<cols;j++) {
            grid.push(new Cell(j,i));
        }
    }
    current = grid[floor(random(0, grid.length))]; //select random start location for the maze
}

// P5.js function: loops eternally
function draw() {
    for(let i=0;i<grid.length;i++) {
        grid[i].show();
    }
    current.visited=true;
    current.highlight();
    let next = current.checkNeighbours();
    if(next) {
        stack.push(current);
        removeWall(current, next);
        current = next;   
    }
    else if(!stack.length<=0) {
        current = stack.pop();
    }
}

// 2D index to 1D index conversion
function index(i, j) {
    if(i>cols-1||j>rows-1||i<0||j<0) {
        return -1;
    }
    return i+j*cols;
}

// removes wall between two cells
function removeWall(a, b) {
    if(a.xcoord-b.xcoord==1) { // a is to the right of b 
        a.walls[3] = false;
        b.walls[1]=false;
    }
    else if(a.xcoord-b.xcoord==-1) { // a is to the left of b
        a.walls[1] = false;
        b.walls[3]=false;
    }
    else if(a.ycoord-b.ycoord==1) { // a is below b
        a.walls[0] = false;
        b.walls[2]=false;
    }
    else if(a.ycoord-b.ycoord==-1) { // a is above b
        a.walls[2] = false;
        b.walls[0]=false;
    }
}

// Cell constructor/definition/everything 
function Cell(xcoord,ycoord) {

    this.xcoord = xcoord;
    this.ycoord = ycoord;
    this.walls = [true, true, true, true]; // top, right, bottom, left
    this.visited=false;

    // helps to keep track of current cell
    this.highlight = function () {
        //console.log("reach");
        let x = this.xcoord*width;
        let y = this.ycoord*width;
        noStroke();
        fill(161,250,0,100);
        rect(x,y,width,width); // using fill after rect causes wonky stuff to happen in some cases
    }

    //draws the cell using lines
    this.show = function () {
        let x = this.xcoord*width;
        let y = this.ycoord*width;
        stroke(10);
        if(this.walls[0]) {
            line(x,y,x+width,y); //top wall
        }
        if(this.walls[1]) {
            line(x+width,y,x+width,y+width); //right wall
        }
        if(this.walls[2]) {
            line(x,y+width,x+width,y+width); //bottom wall
        }
        if(this.walls[3]) {
            line(x,y,x,y+width); //left wall
        }

        if(this.visited) {
            //color visited cells
            noStroke();
            fill(89,107,244,100);
            rect(x,y,width,width); 
        }   
    }

    // returns random neighbour
    this.checkNeighbours = function() {
        let neighbours = [];
        let above = grid[index(current.xcoord, current.ycoord-1)]; // cell above
        let right = grid[index(current.xcoord+1, current.ycoord)]; // cell to right
        let below = grid[index(current.xcoord, current.ycoord+1)]; // cell below
        let left = grid[index(current.xcoord-1, current.ycoord)]; //cell to left

        // If the neighbour exists (not outside the range of the grid) and has not been visited,
        // add to the array

        if(above && !above.visited) {
            neighbours.push(above);
        }
        if(right && !right.visited) {
            neighbours.push(right);
        }
        if(below && !below.visited) {
            neighbours.push(below);
        }
        if(left && !left.visited) {
            neighbours.push(left);
        }

        if(neighbours.length>0) {
            return neighbours[floor(random(0,neighbours.length))];
        }
        else {
            return undefined;
        }
    }

}
