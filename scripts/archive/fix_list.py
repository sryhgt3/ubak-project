import re
with open('frontend/src/components/TransactionGroupedList.tsx', 'r') as f:
    c = f.read()

# Remove the Date Filter div inside the component
date_filter_regex = r'\{\/\* Date Filter \*\/\}\s*<div className="flex items-center gap-3">.*?<\/div>\s*\{Object\.keys'
c = re.sub(r'\{\/\* Date Filter \*\/.*?(?=\{Object\.keys)', '', c, flags=re.DOTALL)

with open('frontend/src/components/TransactionGroupedList.tsx', 'w') as f:
    f.write(c)
