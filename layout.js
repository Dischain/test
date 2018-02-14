/** 
 * case class Person(name: String, adress: Address)
 * case class Address(street: String, city: String)
 * 
 * implicit val addressRead: = new Readable[Address]{
 *   def read(addr: JsonVal): Option[Address] = {
 *     for {
 *       street <- (addr </> "street") as[String], 
 *       city <- (addr </> "city") as[String]
 *     } Option(Address(street, city))
 *   }
 * }
 */
trait Readable[A] {
  def read(jsonVal: JsonVal): Option[A]
}

object ImplicitConversions {
  implicit val intRead = new Readable[Int] {
    def read(jn: JsonNumber): Option[Int] = Some(jn.value.toInt)
  }

  implicit val floatRead = new Readable[Float] {
    def read(jn: JsonNumber): Option[Float] = Some(jn.value.toFloat)
  }

  // ...
}

trait Writable[A] {
  def write(object: A): JsonVal
}

trait JsonTransformable {
  def as[T](implicit readable: Readable[T]): T = readable.read() match {
    case Some(result) => result
    case None => throw new Exception ...
  }
}

final class Parser extends JavaTokenParsers {
  def object: Parser[JsonObject] = 
    "{"~> repsep(member, ",") <~"}" ^^ 
      (JsonObject(Map[String, JsonVal]()) + _)

  def arr: Parser[JsonArray] = 
    "["~> repsep(value, ",") <~"]" 

  def member: Parser[(Sting, JsonVal)] = 
    stringLiteral~":"~value ^^ { 
      case name~":"~value => (name, value) 
    }

  def value: Parser[JsonVal] = ( 
    obj 
      | arr
      | stringLiteral ^^ (JsonString(_))
      | longNumber ^^ (JsonNumber(_.toLong))
      | "null"  ^^ (JsonNull) 
      | "true"  ^^ (JsonTrue) 
      | "false" ^^ (JsonFalse) 
    )
}

object Parser extends Parser {
  def parse(string: String): JsonVal = parseAll(string) match // ...
}

implicit class Path(jo: JsonObject) {
  def </> [T](field: String): Option[JsonVal] = jo.value(field)
}

object Json {
  def stringify(value: JsonVal): String = value.toString()

  def parse(string: String): JsonVal = Parser.parse(string)

  def toJson[T](obj: T)(implicit jw: Writable[T]): JsonVal = 
    jw.write(obj)

  def fromJson[T](value: JsonVal)(implicit jr: Readable[T]): Option[T] = 
    jr.read(value)

  def obj()
}

sealed trait JsonVal extends JsonTransformable

case object JsonNull extends JsonVal {
  override def toString: String = "\"null\""
}

sealed trait class JsonBoolean extends JsonVal

case object JsonTrue extends JsonBoolean {
  override def toString: String = "true"
}
case object JsonFalse extends JsonBoolean {
  override def toString: String = "false"
}

case class JsonNumber(private[ds] value: Long) extends JsonVal {
  override def toString: String = value.toString
}

case class JsonString(private[ds] value: String) extends JsonVal {
  override def toString: String = "\"" + value + "\""
}

case class JsonArray(private[ds] value: IndexedSeq[JsonVal] = Array[JsonVal]()) 
extends JsonVal 
{
  // ...

  override def toString: String = value.mkString(",")
}

case class JsonObject(private[ds] val fields: Map[String, JsonVal]) extends JsonVal {
  // ...  
  override def toString: String = fields.toSeq.mkString(", ")  
}

object JsonObject {
  def apply(members: (String, JsonVal)*): JsonObject = 
    member foldLeft
      (JsonObject(Map[JsonString, JsonObject]()))
      ((init: JsonObject, current: [JsonString -> JsonObject]) =>
      {
        init + current
      }
    )
}
