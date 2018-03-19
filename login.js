// закинуть переменные доменов в env
// domain - "kometa_tuning_simferopol"
class VkActor (token: String, domain: String) extends Actor {
  def recieve = {
    case LookupNewPost =>
      vk.wall
        .get(domain, Some(2), Some(1))
        .map {
          case r: WallGetResponse => r.items map { 
            item => sender ! VkPostRecieved(item) 
          }
          
          case VkApiFailure => sender ! VkFailure
        }
  }
}

// domain - @vttbottest
class TelegramActor (token: String, domain: String) extends Actor {
  def recieve = {
    case TelegramSendMessage(post: VkWallPost) =>
      tb.sendMessage(domain, formPost(post, domain), Some(ParseMode.HTML))
        .map {
          case SuccessfullyDelivered => sender ! UpdateLastPostId(post.id)
          case Failed => sender ! Tick
        }
  }
}

class VtTScheduler (
                    vkActor: ActorRef, 
                    telegramActor: ActorRef
                   ) extends Actor {
  val delay = 5
  var lastVkPostId: Int = _
  
  context.system.scheduler.scheduleOnce(delay minutes, self, Tick)

  def recieve = {
    case Tick =>
      vkActor ! LookupNewPost
    case VkPostRecieved(post: VkWallPost) =>
      if (lastVkPostId != post.id) {
        telegramActor ! TelegramSendMessage(post)
      } else {
        context.system.scheduler.scheduleOnce(delay minutes, self, Tick)
      }
    case VkFailure => context.system.scheduler.scheduleOnce(delay minutes, self, Tick)
    case UpdateLastPostId(id: Int) => {
      lastVkPostId = id
      context.system.scheduler.scheduleOnce(delay minutes, self, Tick)
    }
  }
}
