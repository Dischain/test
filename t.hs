module TS where

data Column a = Column [a] deriving Show

joinC :: [(Column a)] -> Column a
joinC cols@((Column _):cs) = 
  foldl (\(Column acc) (Column [a]) -> Column (a:acc)) (Column []) (reverse cols)

concatC :: Column a -> Column a -> Column a
concatC (Column a) (Column b) = Column (a ++ b)

instance Functor Column where
  fmap f (Column []) = Column []
  fmap f (Column (a:as)) = Column $ (f a) : (fmap f as)

instance Applicative Column where
  pure a = Column [a]

  (Column []) <*> _ = Column []
  (Column (f : fs)) <*> (Column [c]) = Column [f c]
  (Column (f : fs)) <*> (Column (c : cs)) = 
    Column [f c] `concatC` (Column fs <*> Column cs)

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

joinT :: [Table a] -> Table a
joinT tbls@((ConsT c cs) : ds) =
    foldl (\acc t-> concatT t acc) Empty (reverse tbls)

instance Functor Table where
  fmap f Empty = Empty
  fmap f (ConsT c cs) = ConsT (fmap f c) (fmap f cs)

instance Applicative Table where
  pure a = ConsT (pure a) Empty

  Empty <*> _ = Empty
  (ConsT fs fss) <*> t@(ConsT c Empty) = ConsT (fs <*> c) Empty
  (ConsT fs fss) <*> (ConsT bs bss) =
    (ConsT (fs <*> bs) Empty) `concatT` (fss <*> bss)

instance Monad Table where
  (>>=) Empty f = Empty
  (>>=) (ConsT col Empty) f = case (fmap f col) of 
    Column tbls@(t:ts) -> joinT tbls
    Column [] -> Empty
  (>>=) (ConsT col cols) f  = concatT ((ConsT col Empty) >>= f) (cols >>= f)

  return a = ConsT (Column [a]) Empty
  --return _ = Empty
