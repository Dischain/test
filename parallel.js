private def dictKeyIndex(key: A): Option[Int] = {
  val hash = hashString(key)

  if (dictIsRehashing) dict(1).filterIndex(hash, key)
  else dict(0).filterIndex(hash, key)
}

def dictFind(key: A): Option[DictEntry[A, B]] = {
  if (dictUsed() == 0) None
  else {
    if (dictIsRehashing) dictRehash()

    val h = hashString(key)
    
    // 1.
    // for {
    //   e0 <- dict(0).findIndex(hash, key)
    //   e1 <- dict(1).findIndex(hash, key)    
    // } yield List(e0, e1) flatten 

    // 2.        
    // for {
    //   table <- dict
    // } yield table.findIndex(hash, key)

　
  }
}

def dictAdd(key: A, value: B): Option[DictEntry[A, B]] = {
  if (dictIsRehashing) dictRehash()

  dictKeyIndex(key) map {
    case None => None // заменить из filterIndex case _ => -1 на case _ => None
    case Some(index) => {
      val ht = if (dictIsRehashing) dict(1) eles dict(0)
      val entry = new DictEntry[A, B](key, value)

      entry.next = ht.get(index)
      ht.set(index, entry)
      he = Some(entry)

      he
    }
  } // <--- возвр. Option[DictEntry[A, B]]
}

// dictResize тоже ничего не возвращает
def dictExpand(size: Int): Unit = {
  val realSize: Int = _nextPower(size)

  if (!(dictIsRehashing || dict(0).used > size) && !(realSize == dict(0).size)) {
    val nht: DictHT[A, B] = new DictHT[A, B](realSize)

    if (dict(0).used == 0) {
      dict(0) = nht
    } else {
      deict(1) = nht
      rehashIdx = 0     
    }    
  }
}

def dictRehash(n: Int = 1): Unit = {
  var emptyVisits = n * 10
  var nsteps = n

  if (dictIsRehashing) {
    while (nsteps > 0 && dict(0).used != 0) {
      while (dict(0).get(rehashIdx) == null || emptyVisits != 0) {
        rehashIdx += 1
        emptyVisits -= 1
      }

      dict(0).get(rehashIdx).forEach(de => {
        val newIndex = hashString(de.key) & dict(1).sizeMask
        dict(1).set(newIndex, de) 
        dict(0).used -= 1 
        dict(1).used += 1 
      })

      dict(0).set(rehashIdx, null) 
      rehashIdx += 1 
      nsteps -= 1 
    }

    if (dict(0).used == 0) {
      dict(0) = dict(1) 
      dict(1).clear 
    }
  } 
}

// включая реализацию dictGenericDelete
def dictDelete(key: A): Option[DictEntry[A, B]] = {
  if (dict(0).used != 0 && dict(0).used != 0) {
    if (dictIsRehashing) dictRehash()

    val h = hashString(key)
    
    if (dictIsRehashing) dict(1).removeIndex(hash, key)
    else dict(0).removeIndex(hash, key) 
  }
}

// DictHT
def removeIndex(hash: Int, key: A): Option[DictEntry[A, B]] = {
  val idx = hash & sizeMask
  val he = get(idx)
  
  if (he == null) None
  else {
    // в buildere при построении списка связывать эт-ты коллекции вместе:
    // 1  storage match { case head :: tail => e.next = head.getOrElse(null) }
    // 2  storage += e

    val filtered = he.filter((e: DictEntry[A, B]) => e.key == key)
    filtered.map {      
      case entry :: Nil => {        
        table(idx) = he
          .filter((e: DictEntry[A, B]) => e.key != key)
          .map { case h :: t => h }

        used -= 1
        entry
      }
      case _ => None
    }
  }  
}

def +=(e: DictEntry[A, B]): DictEntryBuilder[A, B] = { 
  storage match {
    case h :: t => e.next = h.getOrElse(null)
    case _ => storage = e :: storage 
  }
   
  this 
} 

　
def findIndex(hash: Int, key: A): Option[DictEntry[A, B]] = {
  val idx = hash & sizeMask
  val he = get(idx)

  if (he == null) None
  else {
    he.filter((e: DictEntry[A, B]) => e.key == key)
      .map {      
        case entry :: Nil => entry
        case _ => None
      }
  }
}

// DictEntry
def forEach(f: DictEntry[A, B] => Unit) = {
  @tailrec
  def loop(e: DictEntry[A, B], f: : DictEntry[A, B] => Unit) = {
    f(e)
    loop(e.next)
  }

  loop(this, f)
}
