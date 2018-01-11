// rename genericDelete to getNodeParent:
Tree: 
protected[ds] def getNodeParent[C >: A](k: C, initial: RBTree[C, B]): RBTree[C, B] = { 
  if (implicitly[Ordering[C]].lt(k, key)) 
    Tree(color, left.getNodeParent(k, this), key, value, right) 
  else if (implicitly[Ordering[C]].gt(k, key)) 
    Tree(color, left, key, value, right.getNodeParent(k, this)) 
  else 
    initial
} 
Leaf:
protected[ds] def getNodeParent[C >: A](k: C, initial: RBTree[C, B]): RBTree[C, B] = initial

private[this] def bstDeletion[C >: A](k: C): RBTree[C, B] = this match {
  case Tree(c, l: Tree, key, value, r: Tree) => {
    if (k < key) Tree(c, l.bstDeletion(k), key, value, r)
    if (k > key) Tree(c, l, key, value, r.bstDeletion(k))
    else {
      val (minK, minV) = getMinChildOf(l)
      Tree(c, l, minK, minV, r.bstDeletion(minK))
    }
  }
}

protected[this] def getMinChildOf[C >: A](node: RBTree[C, B]): (C, B) = node match {
  case Tree(_, Leaf(), k, v, Leaf()) => (k, v)
  case Tree(_, l, _, _, _) => getMinChildOf(l)
}

private[this] getNode[C >: A](k: C): Option[B] = { 
  if (implicitly[Ordering[C]].lt(k, key)) left.get(k) 
  else if (implicitly[Ordering[C]].gt(k, key)) right.get(k) 
  else this
} 

　
def delete[C >: A](k: C): RBTree[C, A] = {
  getNode(k, initial = this) match {
    case Tree(_, l: Tree, key, value, r: Tree) => bstDeletion(k)
    case Leaf() => this
    case _ => rbDeletion(k)
  }
}
