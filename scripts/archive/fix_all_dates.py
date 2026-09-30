import re
import os

def fix_file(path):
    if not os.path.exists(path):
        return
    with open(path, 'r') as f:
        c = f.read()

    # We will replace `new Date(t.date)` with a safe parsing if it is used for toLocaleDateString
    # Example: new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    # We can inject a helper at the top or replace inline. Inline is harder.
    # Instead, let's just do:
    # new Date(Number(t.date.split('T')[0].split('-')[0]), Number(t.date.split('T')[0].split('-')[1])-1, Number(t.date.split('T')[0].split('-')[2]))
    
    safe_date_code = "new Date(Number(t.date.split('T')[0].split('-')[0]), Number(t.date.split('T')[0].split('-')[1])-1, Number(t.date.split('T')[0].split('-')[2]))"
    
    c = c.replace("new Date(t.date)", safe_date_code)
    
    with open(path, 'w') as f:
        f.write(c)

fix_file('frontend/src/pages/DashboardPage.tsx')
fix_file('frontend/src/pages/IncomePage.tsx')
fix_file('frontend/src/pages/ExpensePage.tsx')

