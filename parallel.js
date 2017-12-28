def apply = new PartialFunction[Int, Option[A]] {
  def isDefindeAt(i: Int) = !isEmpty && i >= 0 && i < length
  def apply(i: Int) = {
    case 0 => Some(head)
    case _ => tail(i - 1)
  }
}

@tailrec
def foldLeft[B](z: B)(f: (B, A) => B): B = {
  this match {
    case Nil => z
    case Cons(h, t) => foldLeft(f(z, h))(f)
  }
}

def length: Int = foldLeft(0)(_ + _)

1. Any path from the root node to leaf node contains the same number of black
nodes.
2. Red nodes always have black children.
3. Leafes are always black.

This constraints implements a critical feature of red-black trees: path from
root to the most distant leaf is no greater than double times from root to the
nearest leaf. This results the balanced tree.
