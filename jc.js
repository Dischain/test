class SkipList[A: Ordering, B] {
  abstract class SLNode[A, B] { def isEmpty: Boolean }

  class NonEmptySLNode[A: Ordering, B] extends SLNode[A, B] (key: A, value: B, level: Int) {    
    var forward: Array[SLNode] = Array.fill[SLNode](maxLevel)(EmptyNode)
    def isEmpty: Boolean = false
    def apply(key: A, value: B, level: Int): NonEmptySLNode = new NonEmptySLNode(key, value, level)
  }
  
  object EmptyNode extends SLNode[Nothing, Nothing] { def isEmpty: Boolean = true }
  
  var head: SLNode[A, B] = EmptyNode
  val maxLevel: Int = 30
  val numLevels: Int = 0

  def insert(k: A, v: B): Unit = {
    def insertR(node: NonEmptySLNode[A, B], newNode: NonEmptySLNode[A, B], level: Int): Unit {
      val key = newNode.key
      val next = node.forward(level)

      if (next.isEmpty || key < next.key) {
        if (level < newNode.level) {
          newNode.forward(level) = next
          node.forward(level) = newNode
        }
        if (level != 0) insertR(node, newNode, level - 1)
      } else insertR(next, newNode, level)
    }

    val nn = NonEmptySLNode[A, B](k, v, randomLevel())

    if (head.isEmpty) head = nn
    else insertR(head, nn, numLevels)
  }

  def remove(k: A): Unit {
    def removeR(node: NonEmptySLNode[A, B], k: A, level: Int): Unit = {
      val next = node.forward(level)

      if (next.key >= k) {
        if (k == x.key) node.forward(level) = next.forward(level)
        else removeR(node, k, level - 1)        
      } else removeR(node.forward(level), k, level)
    }

    if (head.isEmpty) throw 
    else removeR(head, k, numLevels)
  }

  def find(k: A): B = {
    def findR(node: NonEmptySLNode[A, B], k: A, level: Int): B = {
      if (k == node.key) node.value
      else {
        val next = node.forward(level)

        if (next.isEmpty || k < next.key) {
          if (level != 0) findR(node, k, level - 1)
        }
        else findR(next, k, level)
      }
    }
    
    if (head.isEmpty) throw
    else findR(head, k, numLevels)
  }
}
