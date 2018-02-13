/** 
 * Example:
 * {{{
 * implicit val personReadable: = new Readable[Person] {
 *   def read(pVal: JsonVal): Option[Person] = {
 *     for{
 *       name <- pVal </> "name"
 *       age  <- pVal </> "age"
 *     } Option(Person(name, age))
 *   }  
 * }
 *
 * val personStr = """{"name": "John", "age": "22"}""" 
 * val personJsVal: JsonVal = Json.parse(personStr)
 * val person: Person = personJsVal.as[Person]
 * }}}
 
trait Readable[A] {
  def read(jsonVal: JsonVal): Option[A]
}
trait JsonTransformable {
  def as[T](implicit readable: Readable[T]): Option[T] = readable.read()
}

sealed trait JsonVal extends JsonTransformable {

}

case object JsonNull extends JsonValue

sealed trait JsonBoolean (val value: Boolean) extends JsonVal
case object JsonTrue extends JsonBoolean(true)
case object JsonFalse extends JsonBoolean(false)

case class JsonNumber(value: Long) extends JsonVal

case class JsonString(value: String) extends JsonVal

case class JsonArray(value: IndexedSeq[JsonVal] = Array[JsonValue]()) extends JsonVal {
  def ++(other: JsonArray): JsonArray = JsonArray(value ++ other.value)
  def :+(el: JsonValue): JsonArray = JsonArray(value :+ el)
  def +:(el: JsonValue): JsonArray = JsonArray(el +: value)
}

case class JsonObject(val fields: Map[String, JsonValue]) extends JsonValue {
  lazy val fields: Seq[(String, JsonValue)] = underlying.toSeq
  lazy val value: Map[String, JsonValue] = underlying match {
    case m: immutable.Map[String, JsonValue] => m
    case m => m.toMap
  }

  def fieldSet: Set[(String, JsonValue)] = fields.toSet
  def keys: Set[String] = underlying.keySet
  def values: Iterable[JsonValue] = underlying.values

  def ++(other: JsonObject): JsonObject = JsonObject(underlying ++ other.underlying)
  def -(otherField: String): JsonObject = JsonObject(underlying - otherField)
  def +(otherField: (String, JsonValue)): JsonObject =
    JsonObject(underlying + otherField)
}
