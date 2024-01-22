# python program to find large number in the given array
import operator
# Initializing the list
arr = [2, 1, 7, 3, 0]
max=0

# printing the original list
print('The given array is:', arr)

#checking for large element
for i in arr:
if operator.gt(i,max):
	max=i

# printing the large number in the array
print('The biggest number in the given array is:', max)
