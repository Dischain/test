module TS where

data Row a = Row [a] deriving Show

joinR :: [(Row a)] -> Row a
joinR cols@((Row _):cs) = 
  foldl (\(Row acc) (Row [a]) -> Row (a:acc)) (Row []) (reverse cols)

concatR :: Row a -> Row a -> Row a
concatR (Row a) (Row b) = Row (a ++ b)

traverseR :: (a -> b) -> Row a -> Row b
traverseR f (Row r) = Row $ map f r

filterR :: (a -> Bool) -> Row a -> Row a
filterR f (Row r) = Row $ filter f r

ith :: Row a -> Int -> a
ith (Row r) i = r !! i

instance Functor Row where
  fmap f (Row []) = Row []
  fmap f (Row (a:as)) = Row $ (f a) : (fmap f as)

instance Applicative Row where
  pure a = Row [a]

  (Row []) <*> _ = Row []
  (Row (f : fs)) <*> (Row [c]) = Row [f c]
  (Row (f : fs)) <*> (Row (c : cs)) = 
    Row [f c] `concatR` (Row fs <*> Row cs)

instance Monad Row where
  (>>=) (Row []) f = Row []
  (>>=) (Row c) f = joinR $ fmap f c

  return a = Row [a]

---------------
data Table a = Empty | ConsT (Row a) (Table a) deriving Show

appendT :: Table a -> Table a -> Table a
appendT Empty Empty = Empty
appendT t1 Empty = t1
appendT Empty t2 = t2
appendT (ConsT a as) bs = ConsT a (appendT as bs)

concatT :: Table a -> Table a -> Table a
concatT Empty Empty = Empty
concatT t1 Empty = t1
concatT Empty t2 = t2
concatT (ConsT a as) (ConsT b bs) = ConsT (concatR a b) (concatT as bs)

joinT :: [Table a] -> Table a
joinT tbls@((ConsT c cs) : ds) =
    foldl (\acc t-> appendT t acc) Empty (reverse tbls)

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
ithRow _ Empty = Nothing

numRows :: Table a -> Int
numRows Empty = 0
numRows t@(ConsT r rs) = numRows' t 0
  where
    numRows' (ConsT r rs) acc = numRows' rs (acc + 1)
    numRows' Empty acc = acc

numCols :: Table a -> Int
numCols Empty = 0
numCols t = case headTbl t of ConsT (Row r) _ -> length r
                              otherwise -> 0

-- Traverse through each row
modifyRows :: (Row a -> Row b) -> Table a -> Table b
modifyRows f (ConsT r rs) = ConsT (f r) (modifyRows f rs)
modifyRows _ Empty = Empty

filterRows :: (Row a -> Bool) -> Table a -> Table a
filterRows f (ConsT r rs)
  | f r = ConsT r (filterRows f rs)
  | otherwise = filterRows f rs
filterRows _ Empty = Empty

ithCol :: Int -> Table a -> Maybe (Table a)
ithCol i t@(ConsT r rs)
  | i < 0 = Nothing
  | otherwise = Just $ modifyRows (\r -> Row [(r `ith` i)]) t
ithCol i Empty = Nothing

select :: Int -> (a -> Bool) -> Table a -> Maybe (Table a)
select colNum f t = 
  let res = filterRows (\r -> f (r `ith` colNum)) t
  in case res of
    Empty -> Nothing
    _ -> Just res

instance Functor Table where
  fmap f Empty = Empty
  fmap f (ConsT c cs) = ConsT (fmap f c) (fmap f cs)

instance Applicative Table where
  pure a = ConsT (pure a) Empty

  Empty <*> _ = Empty
  (ConsT fs fss) <*> t@(ConsT c Empty) = ConsT (fs <*> c) Empty
  (ConsT fs fss) <*> (ConsT bs bss) =
    (ConsT (fs <*> bs) Empty) `appendT` (fss <*> bss)

instance Monad Table where
  (>>=) Empty f = Empty
  (>>=) (ConsT col Empty) f = case (fmap f col) of 
    Row tbls@(t:ts) -> joinT tbls
    Row [] -> Empty
  (>>=) (ConsT col cols) f  = appendT ((ConsT col Empty) >>= f) (cols >>= f)

  return a = ConsT (Row [a]) Empty
--return _ = Empty
