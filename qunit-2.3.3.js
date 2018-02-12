package parser

import scala.util.parsing.combinator._
import scala.util.parsing.input.CharSequenceReader

sealed trait Expression {
  def eval (env: Map[String, Literal]): Literal
}

case class Variable (name: String) extends Expression {
  def eval (env: Map[String, Literal]): Literal = env(name)
  override def toString: String = name
}

sealed trait Literal extends Expression {
  def eval (env: Map[String, Literal]): Literal = this
  def doubleValue: Double
  def boolValue: Boolean
  def stringValue: String
}

case class NumberLiteral (literal: Double) extends Literal{
  def doubleValue: Double = literal
  def boolValue: Boolean   = literal != 0.0
  def stringValue: String = literal.toString
  override def toString: String  = literal.toString
}

case class BooleanLiteral(literal: Boolean) extends Literal{
  def doubleValue:  Double = if (literal) 1.0 else 0.0
  def boolValue: Boolean   = literal
  def stringValue: String = literal.toString
  override def toString: String  = literal.toString
}

case class StringLiteral (s: String) extends Literal{
  private val literal = s.substring(1,s.length-1)
  def doubleValue: Double = literal.toDouble
  def boolValue: Boolean = if (literal.toLowerCase == "false") false else true
  def stringValue: String = literal
  override def toString: String  = s
}

class MyParser extends JavaTokenParsers {
  def boolean: Parser[Expression] = ("true" | "false") ^^ (s => BooleanLiteral(s.toBoolean))
  def string: Parser[Expression] = super.stringLiteral ^^ {
    s => StringLiteral(s)
  }
  def double: Parser[Expression] = (decimalNumber | floatingPointNumber) ^^ {
    s => NumberLiteral(s.toDouble)
  }
  def int: Parser[Expression] = wholeNumber ^^ {
    s => NumberLiteral(s.toInt)
  }
  def literal: Parser[Expression] = boolean | string | double | int
  def variable: Parser[Expression] = ident ^^ {
    s => Variable(s)
  }
  def expression: Parser[Expression] = literal | variable
}

class JsonParser extends JavaTokenParsers {
  def obj: Parser[Map[String, Any]] =
    "{"~> repsep(member, ",") <~"}" ^^ (Map() ++ _)

  def arr: Parser[List[Any]] =
    "["~> repsep(value, ",") <~"]"

  def member: Parser[(String, Any)] =
    stringLiteral~":"~value ^^
      { case name~":"~value => (name, value) }

  def value: Parser[Any] = (
    obj
      | arr
      | stringLiteral
      | floatingPointNumber ^^ (_.toDouble)
      | "null"  ^^ (x => null)
      | "true"  ^^ (x => true)
      | "false" ^^ (x => false)
    )
}

object Test extends JsonParser with App {
  override def main(args: Array[String]) = {
    println(parseAll(value, """{"dsd": "dsds"}"""))
  }
}
