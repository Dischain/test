trait ApiRequest {
  val methodName: String
}
trait ApiRequestQS extends ApiRequest
trait ApiRequestJson extends ApiRequest

final case class WallGet(/*params...*/) extends ApiRequestQS {
  val methodName: String = "wall.get"
}

final class RequestHandler(
  accessToken: String, 
  vkApiHost: String = "api.vk.com", 
  apiVersion: String = "5.73") 
{
  private[this] val apiBaseUrl = s"https://$vkApiHost/"

  private[this] val http = Http()

  private[this] def camelToUnderscore(name: String): String = 
    "[A-Z\\d]".r.replaceAllIn(name, { m => "_" + m.group(0).toLowerCase() })

  private[this] def unwrap(obj: Any): Any = obj match {
    case Some(inner) => unwrap(inner)
    case _ => obj
  }

  private[this] def fieldsToKVSeq(req: ApiRequest): Seq[(String, String)] = 
    req.getClass.getDeclaredFields.map { field =>
      val name = field.getName()
      val value = field.get(req)
      (camelToUnderscore(name), unwrap(value))
    }.filterNot(_._2 == None && _._1 == "method_name")

  def apply(req: ApiRequest): Future[WSResponse] = req match {
    val methodName = req.methodName
    val ws = ws.url(s"$vkApiHost/&methodName")
    
    case r @ ApiRequestQS => {
      ws.addQueryStringParameters(fieldsToKVSeq(req)).get()
    }
    case r @ ApiRequestJson => {
      ws.post(Json.obj(fieldsToKVSeq(req)))
    }
  }
}
