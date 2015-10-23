function Tile(pos, class_, value){
	this.x = pos[0];
	this.y = pos[1];
	this.value = value;
	this.class_ = class_;
	
	this.element = null;
}

Tile.prototype.create = function(root){
	var elem = document.createElement("div");
	elem.className = this.class_;
	var text_node = document.createElement("div");
	text_node.className = "text-node"
	var text = document.createTextNode(this.value);
	text_node.appendChild(text);
	elem.appendChild(text_node);
	root.appendChild(elem);
};