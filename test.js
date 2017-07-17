/** 
  * `_items` should contains `priority` field 
  */ 
// TODO: make arguments retrieving from `arguments` 
// TODO: create interface for `Task` item 
function PQ(items) { 
  this._items = [];

  items.forEach((item, index) => { 
    this._items.push(item);
    this._up(index); 
  }); 

  this._length = this._items.length;
} 
 
PQ.prototype._up = function(index) { 
  while (index > 0 && this._less(Math.ceil(index / 2) - 1, index)) { 
    this._swap(Math.ceil(index / 2) - 1, index); 
    index = Math.ceil(index / 2) - 1; 
  } 
} 

PQ.prototype._down = function(curIdx) { 
  while (curIdx * 2 + 1 < this._length) {
    let curChildIdx = curIdx * 2 + 1;

    if (curChildIdx < this._length - 1 && this._less(curChildIdx, curChildIdx + 1)) {
      curChildIdx++; 
    }

    if (! this._less(curIdx, curChildIdx)) {
      break;
    }

    this._swap(curIdx, curChildIdx);
    curIdx = curChildIdx;
  }
}

/*                       Public section 
***********************************************************/ 
 
/** 
 * Returns `null` if container is empty 
 */ 
PQ.prototype.pop = function() { 
  if (this._length === 0) 
    return null; 
 
  let top = this._items[0]; 
  this._swap(0, --this._length);
 
  this._items.pop(); 

  this._down(0); 
 
  return top; 
} 
 
/*            Utils [TODO: move to outer package] 
***********************************************************/ 
 
PQ.prototype._less = function(first, second) { 
  return  (this._items[first].priority < this._items[second].priority); 
} 
 
PQ.prototype._swap = function(first, second) { 
  let temp = this._items[first]; 
  this._items[first] = this._items[second]; 
  this._items[second] = temp; 
} 
 
//PQ.prototype = Object.create(Iterable.prototype); 
//PQ.prototype.constructor = PQ; 

 
let pq = new PQ([{data: 'sdasd', priority: 1}, 
  {data: 'jhfsd', priority: 2}, 
  {data: 'sdassasd', priority: 4}, 
 // {data: 'iiii', priority: 0}, 
  {data: 'iiii', priority: 0}, {data: 'iiii', priority: 12}, 
  {data: 'iiii', priority: 0}, {data: 'iiii', priority: 12}, {data: 'iiii', priority: 3}]); 
 
console.log(pq.pop()) 
console.log(pq.pop()) 
console.log(pq.pop()) 
console.log(pq.pop()) 
console.log(pq.pop()) 
console.log(pq.pop()) 
console.log(pq._items);
