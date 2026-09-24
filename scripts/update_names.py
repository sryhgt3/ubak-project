import os

def replace_in_file(filepath, replacements):
    with open(filepath, 'r') as f:
        c = f.read()
    for old, new in replacements.items():
        c = c.replace(old, new)
    with open(filepath, 'w') as f:
        f.write(c)

# 1. App.tsx
replace_in_file('frontend/src/App.tsx', {
    'import InflowPage from \'./pages/InflowPage\';': 'import IncomePage from \'./pages/IncomePage\';',
    'import OutflowPage from \'./pages/OutflowPage\';': 'import ExpensePage from \'./pages/ExpensePage\';',
    '<Route path="/inflow" element={<InflowPage />} />': '<Route path="/income" element={<IncomePage />} />',
    '<Route path="/outflow" element={<OutflowPage />} />': '<Route path="/expense" element={<ExpensePage />} />'
})

# 2. Sidebar.tsx
replace_in_file('frontend/src/components/Sidebar.tsx', {
    'path: \'/inflow\'': 'path: \'/income\'',
    'path: \'/outflow\'': 'path: \'/expense\''
})

# 3. Navbar.tsx
replace_in_file('frontend/src/components/Navbar.tsx', {
    "path === '/inflow'": "path === '/income'",
    "return 'INFLOW'": "return 'INCOME'",
    "path === '/outflow'": "path === '/expense'",
    "return 'OUTFLOW'": "return 'EXPENSE'",
    "path: '/inflow'": "path: '/income'",
    "path: '/outflow'": "path: '/expense'"
})

# 4. DashboardPage.tsx
replace_in_file('frontend/src/pages/DashboardPage.tsx', {
    "const path = isIncome ? '/inflow' : '/outflow';": "const path = isIncome ? '/income' : '/expense';"
})

# 5. IncomePage.tsx
replace_in_file('frontend/src/pages/IncomePage.tsx', {
    'const InflowPage: React.FC = () => {': 'const IncomePage: React.FC = () => {',
    'export default InflowPage;': 'export default IncomePage;',
    'const inflowOnly = response.data.filter': 'const incomeOnly = response.data.filter',
    'setTransactions(inflowOnly);': 'setTransactions(incomeOnly);'
})

# 6. ExpensePage.tsx
replace_in_file('frontend/src/pages/ExpensePage.tsx', {
    'const OutflowPage: React.FC = () => {': 'const ExpensePage: React.FC = () => {',
    'export default OutflowPage;': 'export default ExpensePage;',
    'const outflowOnly = response.data.filter': 'const expenseOnly = response.data.filter',
    'setTransactions(outflowOnly);': 'setTransactions(expenseOnly);'
})

print("Replacements done!")
