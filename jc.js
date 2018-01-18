node match {
  // case 1.1
  case Tree(c, Tree(Black, ll, lk, lv, Leaf()), k, v, r)
  if (implicitly[Ordering[B]].eq(lk, key)) => ll match {
    case Tree(Red, Leaf(), ck, cv, Leaf()) => 
      Tree(c, Tree(Black, Leaf(), ck, cv, Leaf()), k, v, r)
  }
  // case 1.2
  case Tree(c, Tree(Black, Leaf(), lk, lv, lr), k, v, r)
  if (implicitly[Ordering[B]].eq(lk, key)) => lr match {
    case Tree(Red, Leaf(), ck, cv, Leaf()) => 
      Tree(c, Tree(Black, Leaf(), ck, cv, Leaf()), k, v, r)
  }
  // case 1.3
  case Tree(Tree(c, l, k, v, Tree(Black, rl, rk, rv, Leaf()))
  if (implicitly[Ordering[B]].eq(rk, key)) => rl match {
    case Tree(Red, Leaf(), ck, cv, Leaf()) => 
      Tree(c, l, k, v, Tree(Black, Leaf(), ck, cv, Leaf()))
  }
  // case 1.4
  case Tree(c, l, k, v, Tree(Black, Leaf(), rk, rv, rr))
  if (implicitly[Ordering[B]].eq(rk, key)) => rr match {
    case Tree(Red, Leaf(), ck, cv, Leaf()) => 
      Tree(c, l, k, v, Tree(Black, Leaf(), ck, cv, Leaf()))
  }
  // case 1.5
  case Tree(c, Tree(Red, ll, lk, lv, Leaf()), k, v, r)
  if (implicitly[Ordering[B]].eq(lk, key)) => ll match {
    case Tree(Black, Leaf(), ck, cv, Leaf()) =>
      Tree(c, Tree(Black, Leaf(), ck, cv, Leaf()), k, v, r)
  }
  // case 1.6
  case Tree(c, Tree(Red, Leaf(), lk, lv, lr), k, v, r)
  if (implicitly[Ordering[B]].eq(lk, key)) => lr match {
    case Tree(Black, Leaf(), ck, cv, Leaf()) =>
      Tree(c, Tree(Black, Leaf(), ck, cv, Leaf()), k, v, r)
  }
  // case 1.7
  case Tree(c, l, k, v, Tree(Red, Leaf(), rk, rv, rr))
  if (implicitly[Ordering[B]].eq(rk, key)) => rr match {
    case Tree(Black, Leaf(), ck, cv, Leaf()) =>
      Tree(c, l, k, v, Tree(Black, Leaf(), ck, cv, Leaf()))
  }
  // case 1.8
  case Tree(c, l, k, v, Tree(Red, rl, rk, rv, Leaf()))
  if (implicitly[Ordering[B]].eq(rk, key)) => rl match {
    case Tree(Black, Leaf(), ck, cv, Leaf()) =>
      Tree(c, l, k, v, Tree(Black, Leaf(), ck, cv, Leaf()))
  }

  // case 2.a.1.1
  case Tree(_, Tree(Black, Leaf(), lk, lv, Leaf()), k, v, 
               Tree(Black, slc @ Tree(Red, Leaf(), slck, slcv, Leaf()), rk, rv, 
                           src @ Tree(Red, Leaf(), srck, srcv, Leaf())))
  if (implicitly[Ordering[B]].eq(lk, key)) => 
    Tree(Black, 
      Tree(Black, 
        Leaf(), 
        k, v, 
        Tree(Red, Leaf(), slck, slcv, Leaf())
      ), 
      rk, rv, 
      Tree(Black, Leaf(), srck, srcv, Leaf())
    )
  // case 2.a.1.2  
  case Tree(_, Tree(Black, Leaf(), lk, lv, Leaf()), k, v, 
               Tree(Black, slc @ Leaf(), rk, rv, 
                           src @ Tree(Red, Leaf(), srck, srcv, Leaf())))
  if (implicitly[Ordering[B]].eq(lk, key)) => 
    Tree(Black, Tree(Black, Leaf(), k, v, Leaf())), 
      rk, rv, 
      Tree(Black, Leaf(), srck, srcv, Leaf())
    )
  // case 2.a.2
  case Tree(_, Tree(Black, Leaf(), lk, lv, Leaf()), k, v, 
               Tree(Black, slc @ Tree(Red, Leaf(), slck, slcv, Leaf()), rk, rv, 
                           src @ Leaf()))
  if (implicitly[Ordering[B]].eq(lk, key)) =>
    Tree(Black, Tree(Black, Leaf(), k, v, Leaf()), slck, slcv, Tree(Black, Leaf(), rk, rv, Leaf())) 
  // case 2.a.3.1
  case Tree(Black, 
    Tree(Black, 
      slc @ Tree(Red, Leaf(), slck, slcv, Leaf())
      lk, lv,
      src @ Tree(Red, Leaf(), srck, srcv, Leaf())), 
    k, v, 
    Tree(Black, Leaf(), rk, rv, Leaf()))
  if (implicitly[Ordering[B]].eq(rk, key)) => 
    Tree(Black, 
      Tree(Black, Leaf(), slck, slcv, Leaf()), 
      lk, lv, 
      Tree(Black,
        Tree(Red, Leaf(), srck, srcv, Leaf())
        k, v,
        Leaf()
      )
    )
  // case 2.a.3.2
  case Tree(Black, 
    Tree(Black, 
      slc @ Tree(Red, Leaf(), slck, slcv, Leaf())
      lk, lv,
      src @ Leaf()), 
    k, v, 
    Tree(Black, Leaf(), rk, rv, Leaf()))
  if (implicitly[Ordering[B]].eq(rk, key)) => 
    Tree(Black, 
      Tree(Black, Leaf(), slck, slcv, Leaf()), 
      lk, lv, 
      Tree(Black,
        Leaf()
        k, v,
        Leaf()
      )
    )
  // case 2.a.4
  case Tree(Black,
    Tree(Black, slc @ Leaf(), lk, lv, src @ Tree(Red, Leaf(), srck, srcv, Leaf()))
    k, v,
    Tree(Black, Leaf(), rk, rv, Leaf()))
  if (implicitly[Ordering[B]].eq(rk, key)) => 
    Tree(Black, 
      Tree(Black, Leaf(), lk, lv, Leaf())
      srck, srcv,
      Tree(Black, Leaf(), k, v, Leaf())
    )
  // case 2.b.1
  case Tree(Black, Tree(Black, Leaf(), lk, lv, Leaf()), k, v, Tree(Black, Leaf(), rk, rv, Leaf()))
  if (implicitly[Ordering[B]].eq(lk, key)) =>
    Tree(Black, Leaf(), k, v, Tree(Red, Leaf(), rk, rv, Leaf()))
  // case 2.b.2
  case Tree(Black, Tree(Black, Leaf(), lk, lv, Leaf()), k, v, Tree(Black, Leaf(), rk, rv, Leaf()))
  if (implicitly[Ordering[B]].eq(rk, key)) =>
    Tree(Black, Tree(Red, Leaf(), lk, lv, Leaf()), k, v, Leaf())
  // case 2.b.3
  case Tree(Red, Tree(Black, Leaf(), lk, lv, Leaf()), k, v, Tree(Black, Leaf(), rk, rv, Leaf()))
  if (implicitly[Ordering[B]].eq(lk, key)) =>
    Tree(Black, Leaf(), k, v, Tree(Red, Leaf(), rk, rv, Leaf()))
  // case 2.b.4
  case Tree(Red, Tree(Black, Leaf(), lk, lv, Leaf()), k, v, Tree(Black, Leaf(), rk, rv, Leaf()))
  if (implicitly[Ordering[B]].eq(rk, key)) =>
    Tree(Black, Tree(Red, Leaf(), lk, lv, Leaf()), k, v, Leaf())
  // case 2.c.1
  case Tree(Black, 
    Tree(Black, Leaf(), lk, lv, Leaf()), 
    k, v, 
    Tree(Red, 
      slc @ Tree(Black, Leaf(), slck, slcv, Leaf())
      rk, rv,
      src @ Tree(Blacl, Leaf(), srck, srcv, Leaf())
    )
  )
  if (implicitly[Ordering[B]].eq(lk, key)) =>
    Tree(Black, 
      Tree(Black, Leaf(), k, v, Tree(Red, Leaf(), slck, slcv, Leaf())), 
      rk, rv, 
      Tree(Black, Leaf(), srck, srcv, Leaf())
    )
  // case 2.c.2
  case Tree(Black, 
    Tree(Black, Leaf(), lk, lv, Leaf())
    k, v,
    Tree(Red, 
      Tree(Black, Leaf(), slck, slcv, Leaf()),
      rk, rv,
      Leaf()
    )
  )
  if (implicitly[Ordering[B]].eq(lk, key)) =>
    Tree(Black, Tree(Black, Leaf(), k, v, Leaf()), slck, slcv, Tree(Black, Leaf(), rk, rv, Leaf()))
  // case 2.c.3
  case Tree(Black, 
    Tree(Black, Leaf(), lk, lv, Leaf()),
    k, v,
    Tree(Red,
      Tree(Black, Leaf(), srck, srcv, Leaf())
    )
  )
  if (implicitly[Ordering[B]].eq(lk, key)) =>
    Tree(Black, Tree(Black, Leaf(), k, v, Leaf()), rk, rv, Tree(Black, Leaf(), srck, srcv, Leaf()))
  // case 2.c.4
  case Tree(Black,
    Tree(Red,
      Tree(Black, Leaf(), slck, slcv, Leaf()),
      lk, lv,
      Tree(Black, Leaf(), srck, srcv, Leaf())
    ),
    k, v,
    Tree(Black, Leaf(), rk, rv, Leaf())
  )
  if (implicitly[Ordering[B]].eq(rk, key)) =>
    Tree(Black, 
      Tree(Black, Leaf(), slck, slcv, Leaf()),
      lk, lv,
      Tree(Black,
        Tree(Red, Leaf(), srck, srcv, Leaf()),
        k, v,
        Leaf()
      )
    )
  // case 2.c.5
  case Tree(Black,
    Tree(Red, 
      Tree(Black, Leaf(), slck, slcv, Leaf()),
      lk, lv,
      Leaf()
    ),
    k, v,
    Tree(Black, Leaf(), rk, rv, Leaf())
  )
  if (implicitly[Ordering[B]].eq(rk, key)) =>
    Tree(Black, Tree(Black, Leaf(), slck, slcv, Leaf()), lk, lv, Tree(Black, Leaf(), k, v, Leaf()))
  // case 2.c.6
  case Tree(Black,
    Tree(Red, 
      Leaf(),
      lk, lv,
      Tree(Black, Leaf(), srck, srcv, Leaf())
    ),
    k, v,
    Tree(Black, Leaf(), rk, rv, Leaf())
  )
  if (implicitly[Ordering[B]].eq(rk, key)) =>
    Tree(Black, Tree(Black, Leaf(), srck, srcv, Leaf()), lk, lv, Tree(Black, Leaf(), k, v, Leaf()))
}
