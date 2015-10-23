function TileGame(id, x, y){
	this.container = document.getElementById(id);
	this.countX = x;
	this.countY = y;	
	
	this.counter_func = null;	
	this.win_func = null;
	
	this.restart();
}

TileGame.prototype.oncounter = function(func){
	this.counter_func = func;
}

TileGame.prototype.createField = function(){
	var nums = [];
	for (i = 0; i < this.countX * this.countY; i++)
		nums.push(i);
	
	nums.sort(function() {
		return .5 - Math.random();
	});
	
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
	
	for(i = 0; i < this.countY; i++){
		var row = this.createRow("row-node", this.container);
		for(j = 0; j < this.countX; j++){
			var str = (" " + nums.pop().toString()).slice(-2);
			var tile = new Tile([i, j], "tile-node", str);
			tile.create(row);
		}
	}
}

TileGame.prototype.createRow = function(row_class, root){
	var row = document.createElement("div");
	row.className = row_class;
	root.appendChild(row);
	return row;
}

TileGame.prototype.get_element = function(x, y){
	var elems = document.evaluate("./div[" + (y + 1).toString() + "]/div[" + (x + 1).toString() + "]", this.container, null, XPathResult.ANY_TYPE, null); 
	var elem = elems.iterateNext(); 
	return elem;
} 
	
TileGame.prototype.swap_elements = function(elem1, elem2){
	var parent1 = elem1.parentElement;
	var parent2 = elem2.parentElement;
	var next_elem = elem2.nextElementSibling;
	
	parent1.insertBefore(elem2, elem1);
	parent1.removeChild(elem1);
	parent2.insertBefore(elem1, next_elem);
}

TileGame.prototype.get_rotation_pos = function(e){
	var target = e.currentTarget;
	var width = target.clientWidth;
	var height = target.clientHeight;
	
	var point_x = e.clientX - target.offsetLeft;
	var point_y = e.clientY - target.offsetTop;
	
	var posX = Math.round((point_x / width) * this.countX) - 1;
	var posY = Math.round((point_y / height) * this.countY) - 1;
	
	if (posX >= this.countX - 1) posX = this.countX - 2;
	if (posX < 0) posX = 0;
	
	if (posY >= this.countY - 1) posY = this.countY - 2;
	if (posY < 0) posX = 0;
	
	return [posX, posY];
}

TileGame.prototype.click = function(e){
	var pos = this.get_rotation_pos(e);
			
	var first = this.get_element(pos[0], pos[1]);
	var second = this.get_element(pos[0] + 1, pos[1]);
	var third = this.get_element(pos[0] + 1, pos[1] + 1);
	var fourth = this.get_element(pos[0], pos[1] + 1);
	
	this.swap_elements(first, second);
	this.swap_elements(second, fourth);
	this.swap_elements(second, third);
	this.check();
	if (this.counter_func)
		this.counter_func(++this.counter);
}

TileGame.prototype.check = function(){
	var children = this.container.childNodes;
	res = false;
	for (i = 0; i < this.countY; i++){
		var row_elems = children[i].childNodes;
		for (j = 0; j < this.countX; j++){
			row_elems[j].classList.remove("placed");
			if (row_elems[j].children[0].innerHTML.trim() == (i * this.countY + j).toString()){
				row_elems[j].classList.add("placed");
				res = true;
			}
			else res = false;
		}
	}
	if (res == true){
		this.win_func();
		this.container.onclick = null;
	}
}

TileGame.prototype.onwin = function(func){
	this.win_func = func;
}

TileGame.prototype.restart = function(){
	this.counter = 0;
	if (this.counter_func)
		this.counter_func(this.counter);
	
	var that = this;
	this.container.onclick = function(e){
		that.click(e);
	};
	
	this.container.onselectstart = function(){
		return false;
	};
	
	this.createField();
	this.check();
}