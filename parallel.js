final class Dict [A, B] {
  
}

final class DictHT [A, B] {
  import DictHT._

  private var table: Array[DictEntry[A, B]] = new Array(initialCapacity)

  private var _loadFactor = defaultLoadFactor
  // след. два значения нужны для resize: if (tableSize > threshold) -> resize(2 * table.length)
  private var tableSize: Int = 0 // кол. элементов в таблице
  private var threshold: Int = initialThreshold(_loadFactor) // след. значение, после кот. вып. resize

  // нужен только для вычисления первичного размера табл., больше не используется.
  private def initialSize: Int = 4
  private def initialThreshold(_loadFactor: Int): Int = newThreshold(_loadFactor, initialCapacity)
  private def initialCapacity: Int = capacity(initialSize)

  private def index(hcode: Int): Int = hcode & sizeMask
  private def sizeMask: Int = tableSize == 0 ? 0 : tableSize - 1 // изм. при resize
}

private object DictHT {
  private final def defaultLoadFactor: Int = 750
  private final def loadFactorDenum = 1000

  private final def newThreshold(_loadFactor: Int, size: Int) = 
    ((size.toLong * _loadFactor) / loadFactorDenum).toInt

  private final def sizeForThreshold(_loadFactor: Int, thr: Int) = 
    ((thr.toLong * loadFactorDenum) / _loadFactor).toInt

  private final def capacity(expectedSize: Int) = expectedSize << 1  
}

final class DictEntry [A, B] (val key: A, var value: B) {
  var next: DictEntry[A, B]
}

object MurmurHash2 {
  def hashString(key: String): Int = {
    val m = 0x5bd1e995
    val seed = 0
    val r = 24

    var len = key.length
    var h = seed ^ len
  
    var data = key
    var k
  
    while (len >= 4) {
      k  = data.charCodeAt(0)
      k |= data.charCodeAt(1) << 8
      k |= data.charCodeAt(2) << 16
      k |= data.charCodeAt(3) << 24

      k *= m
      k ^= k >> r
      k *= m

      h *= m
      h ^= k

      data += 4
      len -= 4
    }

    len match {
      case 3 => h ^= data.charCodeAt(2) << 16
      case 2 => h ^= data.charCodeAt(1) << 8
      case 1 => h ^= data.charCodeAt(0) h *= m
    }

    h ^= h >> 13
    h *= m
    h ^= h >> 15

    h
  }
}
