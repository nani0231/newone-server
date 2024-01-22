from collections import deque

def splitArr(a, n, k):
q = deque(a)
q.rotate(-k)
return list(q)

# main
arr = [12, 10, 5, 6, 52, 36]
n = len(arr)
position = 2
arr = splitArr(arr, n, position)
for i in range(0, n):
print(arr[i], end=' ')
#This code is contributed by Jyothi pinjala.
