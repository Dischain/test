module TS where

data Column a = Column [a] deriving Show

joinC:: [(Column a)] -> Column a
joinC cols@((Column _):cs) = 
  foldl (\(Column acc) (Column [a]) -> Column (a:acc)) (Column []) (reverse cols)

instance Functor Column where
  fmap f (Column []) = Column []
  fmap f (Column (a:as)) = Column $ (f a) : (fmap f as)

instance Applicative Column where
  pure a = Column [a]

  (Column []) <*> _ = Column []
  (Column [f]) <*> col = fmap f col
  
instance Monad Column where
  (>>=) (Column []) f = Column []
  (>>=) (Column c) f = joinC $ fmap f c

  return a = Column [a]


---------------
data Table a = Empty | ConsT (Column a) (Table a) deriving Show

concatT :: Table a -> Table a -> Table a
concatT Empty Empty = Empty
concatT t1 Empty = t1
concatT Empty t2 = t2
concatT (ConsT a as) bs = ConsT a (concatT as bs)

instance Functor Table where
  fmap f Empty = Empty
  fmap f (ConsT c cs) = ConsT (fmap f c) (fmap f cs)

instance Monad Table where
  (>>=) Empty f = Empty
  (>>=) (ConsT col cols) f = concatT (Table ((>>=) col f)) ((>>=) cols f)
    
  return a = ConsT (Column [a]) Empty
  return _ = Empty
