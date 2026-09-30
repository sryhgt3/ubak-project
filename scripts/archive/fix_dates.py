with open('frontend/src/components/TransactionGroupedList.tsx', 'r') as f:
    c = f.read()

# Fix grouping
new_grouping = """
    filtered.forEach(t => {
      // Extract YYYY-MM-DD reliably ignoring timezone shifts
      const datePart = t.date.split('T')[0]; // "2026-09-23"
      const [year, month, day] = datePart.split('-');
      const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
      const dateStr = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase();
"""
import re
c = re.sub(r'filtered\.forEach\(t => \{\n\s*const dateObj = new Date\(t\.date\);\n\s*const dateStr = dateObj\.toLocaleDateString\([^\)]+\)\.toUpperCase\(\);', new_grouping, c)

# Fix edit form date
c = c.replace("date: new Date(t.date).toISOString().split('T')[0],", "date: t.date.split('T')[0],")

with open('frontend/src/components/TransactionGroupedList.tsx', 'w') as f:
    f.write(c)
