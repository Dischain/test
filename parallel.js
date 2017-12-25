// в dictRehash рагумент n: Int = 1 назначить равным единице по умолчанию,
// rehahsStep заменить на dictRehash

// DictHT.clear переделать на:
def clear: Unit = {
  for (i <- 0 to size - 1 by -1) table(i) = null
  used = 0
}
// так же set переименовать на put!

class DictEntryBuilder[A, B]  {
  private var storage: DictEntry[A, B] = _

  def +=(e: DictEntry[A, B]) = {
    if (storage == null)
      storage = e
    else 
      storage.next = e

    this 
  }

  def reset() = {
    storage = initial
    this
  }

  def result(): Option[DictEntry[A, B]] = Some(storage)
}

// DictEntry
def filter(f: DictEntry[A, B] => Boolean): Option[DictEntry[A, B]] = {
  val builder = new DictEntryBuilder[A, B]

  def loop(acc: DictEntryBuilder[A, B], left: DictEntry[A, B], f: DictEntry[A, B] => Boolean) = {
    if (f(left)) acc += left
    loop(acc, left.next, f)
  }

  loop(builder, this, f).result
}

// DictHT
def filterIndex(hash, key): Option[Int] ={
  val idx = hash & table.sizeMask
  var he = table.get(idx)

  he.filter(e => e.key == key)      
}

private def dictKeyIndex(key: A): Option[Int] = {
  val hash = hashString(key)

  val res = for { table <- dict } yield table.filterIndex(hash, key)
  res filter {
    case Some(index) => Some(index)
    case None =>
  }
}
