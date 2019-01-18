module TS where

data Row a = Row [a] deriving Show

joinC :: [(Row a)] -> Row a
joinC cols@((Row _):cs) = 
  foldl (\(Row acc) (Row [a]) -> Row (a:acc)) (Row []) (reverse cols)

concatC :: Row a -> Row a -> Row a
concatC (Row a) (Row b) = Row (a ++ b)

instance Functor Row where
  fmap f (Row []) = Row []
  fmap f (Row (a:as)) = Row $ (f a) : (fmap f as)

instance Applicative Row where
  pure a = Row [a]

  (Row []) <*> _ = Row []
  (Row (f : fs)) <*> (Row [c]) = Row [f c]
  (Row (f : fs)) <*> (Row (c : cs)) = 
    Row [f c] `concatC` (Row fs <*> Row cs)

instance Monad Row where
  (>>=) (Row []) f = Row []
  (>>=) (Row c) f = joinC $ fmap f c

  return a = Row [a]

---------------
data Table a = Empty | ConsT (Row a) (Table a) deriving Show

concatT :: Table a -> Table a -> Table a
concatT Empty Empty = Empty
concatT t1 Empty = t1
concatT Empty t2 = t2
concatT (ConsT a as) bs = ConsT a (concatT as bs)

joinT :: [Table a] -> Table a
joinT tbls@((ConsT c cs) : ds) =
    foldl (\acc t-> concatT t acc) Empty (reverse tbls)

mkTable :: [[a]] -> Table a
mkTable t@(r@(c : cs) : rs) = 
  (foldl (\acc r -> ConsT r acc) Empty) (reverse $ map (\r -> Row r) t)
mkTable [[]] = Empty

headTbl :: Table a -> Table a
headTbl (ConsT r _) = ConsT r Empty
headTbl Empty = Empty

tailTbl :: Table a -> Table a
tailTbl (ConsT h t@(ConsT _ _)) = t
tailTbl Empty = Empty

ithRow :: Int -> Table a -> Maybe (Table a)
ithRow i (ConsT r t)
  | i < 0  = Nothing
  | i == 0 = Just $ ConsT r Empty
  | i > 0 = case t of (ConsT nr _) -> ithRow (i - 1) t
                      Empty -> Nothing

ithRow i Empty = Nothing

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
    Row tbls@(t:ts) -> joinT tbls
    Row [] -> Empty
  (>>=) (ConsT col cols) f  = concatT ((ConsT col Empty) >>= f) (cols >>= f)

  return a = ConsT (Row [a]) Empty
--return _ = Empty

