with open('frontend/src/components/TransactionGroupedList.tsx', 'r') as f:
    c = f.read()
c = c.replace("const themeColor = type === 'Income' ? 'cyan' : 'violet';", "")
with open('frontend/src/components/TransactionGroupedList.tsx', 'w') as f:
    f.write(c)
