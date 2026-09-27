import re,sys
p=sys.argv[1]
s=open(p,'rb').read().decode('latin1','ignore')
for n in sorted(set(re.findall(r"PRODUCT\('([^']*)'",s))): print(n)
