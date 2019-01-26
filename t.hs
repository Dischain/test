import Math.Combinatorics.Exact.Binomial --exact-combinatorics-0.2.0.8

foldR :: (b -> a -> b) -> b -> Row a -> b
foldR f acc (Row r@(a : _)) = foldl f acc r
foldR _ acc r@(Row []) = acc

zipWithR :: (a -> b -> c) -> Row a -> Row b -> Row c
zipWithR f (Row r1) (Row r2) = Row (zipWith f r1 r2)

average :: (Fractional a) => Row a -> a
average r = (foldR (\acc x -> acc + x) 0 r) / 2

probabilityMassFunction :: Integral a => a -> a -> Double -> Double
probabilityMassFunction k n p = 
  (fromIntegral (n `choose` k)) * (p ^ k) * ((1 - p) ^ (n - k))

standardDeviation :: (Floating a) => Row a -> a
standardDeviation row@(Row values) = 
  (sqrt . sum $ map (\x -> (x - mu) * (x - mu)) values) /sqrt_nm1
  where
    mu = average row
    sqrt_nm1 = sqrt $ (genericLength values - 1)

covariance :: (Fractional a) => Row a -> Row a -> a
covariance r1 r2 = 
  average $ zipWithR (\xi yi -> (xi-xAvg) * (yi-yAvg)) r1 r2
  where
    xAvg = average r1
    yAvg = average r2

pearsonR :: (Fractional a, Floating a) => Row a -> Row a -> a
pearsonR r1 r2 = r
  where
    r1Stdev = standardDeviation r1
    r2Stdev = standardDeviation r2
    r = covariance r1 r2 / (r1Stdev * r2Stdev)
