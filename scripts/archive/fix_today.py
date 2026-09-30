with open('frontend/src/pages/AddTransactionPage.tsx', 'r') as f:
    c = f.read()

local_date_logic = """
  const getLocalDateStr = () => {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };

  const [formData, setFormData] = useState({
    amount: '',
    type: 'Expense',
    category: '',
    description: '',
    date: getLocalDateStr()
  });
"""

c = c.replace("""  const [formData, setFormData] = useState({
    amount: '',
    type: 'Expense',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });""", local_date_logic)

with open('frontend/src/pages/AddTransactionPage.tsx', 'w') as f:
    f.write(c)
