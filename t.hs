module TABLE where

data Table a = Tbl [[a]] deriving Show

--instance Applicative Table where
--  pure [] = Table [[]]
--  pure [[]] = Table [[]]
--  pure a@((x:_):_) = Table a

--  (<*>) :: Applicative f => f (a -> b) -> f a -> f b
--  (<*>) f (Table x) = Table $ f x

instance Monad (Table a) where
  (>>=)  :: m a -> (a -> m b) -> m b
  (>>=) (Tbl c@[[x]]) f = f c
  
  return :: a -> m a
  return x = Tbl [[x]]

fields :: Table a -> Table a
fields (Tbl records) = Tbl [head records]

--------------------------------------------------------
iterateM :: Monad m => Int -> (a -> m a) -> a -> m a
iterateM 0 _ a = return a
iterateM n f a = f a >>= iterateM (n - 1) f

-- iterateM_ 2 (\x -> Just $  x - 1) (Just 10)
iterateM_ :: Monad m => Int -> (a -> m a) -> m a -> m a
iterateM_ 0 _ a = a
iterateM_ n f a = (a >>= f) >>= (\x -> iterateM_ (n - 1) f (return x))

--innerJoin :: Table -> Table -> Key
--innerJoin t1 t2 k = t1 <$> t2 $ \fk -> filter k `eq` fk
