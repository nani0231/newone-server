# Python program to split array and move first
# part to end.

arr = [12, 10, 5, 6, 52, 36]
n = len(arr)
position = 2
x = arr[:position]
y = arr[position:]
y.extend(x)
for i in y:
	print(i, end=" ")
