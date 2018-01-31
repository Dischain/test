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

sealed trait Path[T] 
case object LTerminal() extends Path[T] 
case object RTerminal() extends Path[T] 
case class Node[T] (val lnode: List[T], 
                    val path: Path[T], 
                    val rnode: List[T]) extends Path[T] 
 
 
 /** Location of a ref in a [[List]]. */ 
sealed trait Location[T] 
class Loc[T] (val current: List[T], 
              val path: Path[T]) extends Location[T] 
{ 

  def this(t: List[T]) = this(t, LTerminal()) 

　
  def goLeft: Loc[T] = path match { 
    case LTerminal() => sys.error("leftmost node") 
    case Node(y :: lnode, up, rnode) => 
      Loc(y, Node(lnode, up, current :: rnode)) 
    case Node(Nil, up, rnode) => sys.error("left of first") 
  } 
 
 
  def goRight: Loc[T] = path match { 
    case RTerminal() => sys.error("rightmost node") 
    case LTerminal() => match current {
      case a @ List(lv, b @ List(nv, c @ List[T])) => Loc(b, Node(a, ....))
    }          
    case Node(lnode, up, e :: rnode) => 
      Loc(e, Node(current :: lnode, up, rnode)) 
    case Node(lnode, up, Nil) => sys.error("right of last") 
  } 
 
 
  def goUp: Loc[T] = path match { 
    case Terminal() => sys.error("up of top") 
    case Node(lnode, up, rnode) => 
      Loc(Section(lnode.reverse ++ (current :: rnode)), up) 
  } 
 
 
  def goDown: Loc[T] = current match { 
    case Item(_) => sys.error("down of item") 
    case Section(t :: ts) => Loc(t, Node(Nil, path, ts)) 
    case _ => sys.error("down of empty") 
  } 
 
 
   def goNth(nth: Int): Loc[T] = nth match { 
     case 1 => goDown 
     case _ => if (nth > 0) { goRight.goNth(nth - 1) } 
               else { sys.error("goNth expects a positive Int") } 
  } 
 
  def delete: Loc[T] = path match { 
    case Terminal() => sys.error("delete of top") 
    case Node(lnode, up, e :: rnode) => 
      Loc(e, Node(lnode, up, rnode)) 
    case Node(y :: lnode, up, rnode) => 
      Loc(y, Node(lnode, up, rnode)) 
    case Node(Nil, up, Nil) => Loc(Section(Nil), up) 
  } 
} 
 
 
object Loc { 
  def apply[T](current: Tree[T], path: Path[T]) = new Loc[T](current, path) 
  def apply[T](current: Tree[T]) = new Loc[T](current) 
} 
