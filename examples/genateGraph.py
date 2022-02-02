
# seed the pseudorandom number generator
from calendar import c
from random import seed
from random import randint

letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

seed(1)

x = int(input("insira q quantidade de vertices >>> "))


if(x > 26):
    x = 26
    
    
a = []
n = 26

for j in range(0, x):
    a.append(letters[j])
    
    
    a.append({
        name: 'oi'
    })
    
print(a)