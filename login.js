def insert(k: A, v: B): Option[B] = {
  def insertR(node: SLNode[A, B], newNode: SLNode[A, B], level: Int): Option[B] = {
    val key = newNode.key
    val next = node.forward(level)

    if (next.isEmpty || implicitly[Ordering[A]].lt(key, next.key)) {
      if (level < newNode.level) { 
        newNode.forward (level) = next 
        node.forward (level) = newNode 
      } 
      if (level != 0) insertR(node, newNode, level - 1) 
      else Some(v) 
    }
    else insertR(next, newNode, level)
  }
  
  find(k) match {
    case Some(item) => None
    case _ => insertR(head, SLNode[A, B](k, v, randomLevel()), numLevels)
  }  
}

private var head: SLNode[A, B] = new SLNode[A, B](maxLevel)

class SLNode[A: Ordering, B] (val key: A, val value: B, val level: Int, val isEmpty: Boolean = false) { 
  def this(level: Int) { 
    this(null.asInstanceOf[A], null.asInstanceOf[B], level, true) 
  } 
  
  def this() { 
    this(null.asInstanceOf[A], null.asInstanceOf[B], -1, true) 
  } 
 
  val forward: Array[SLNode[A, B]] = 
    Array.fill[SLNode[A, B]](level)(new SLNode[A, B]()) 
 
  def apply(key: A, value: B, level: Int): SLNode[A, B] = 
    new SLNode[A, B](key, value, level) 
} 
