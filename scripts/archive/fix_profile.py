with open('frontend/src/pages/ProfilePage.tsx', 'r') as f:
    c = f.read()

import re

format_fn = """
  const formatToDot = (val: string | number) => {
    if (val == null) return '';
    const numericStr = String(val).replace(/\\D/g, '');
    if (!numericStr) return '';
    return new Intl.NumberFormat('id-ID').format(Number(numericStr));
  };
"""

c = c.replace("const [formData, setFormData] = useState({", format_fn + "\n  const [formData, setFormData] = useState({")

# We need to format the initial values when user data is loaded
c = c.replace("""setFormData({
          username: user.username,
          password: '',
          monthly_income: user.monthly_income?.toString() || '',
          savings_goal: user.savings_goal || '',
          dream_item: user.dream_item || '',
          max_spending: user.max_spending?.toString() || ''
        });""", """setFormData({
          username: user.username,
          password: '',
          monthly_income: formatToDot(user.monthly_income || ''),
          savings_goal: user.savings_goal || '',
          dream_item: user.dream_item || '',
          max_spending: formatToDot(user.max_spending || '')
        });""")

# When user types, we apply formatToDot
c = c.replace("onChange={e => setFormData({...formData, monthly_income: e.target.value.replace(/[^0-9]/g, '')})}", "onChange={e => setFormData({...formData, monthly_income: formatToDot(e.target.value)})}")
c = c.replace("onChange={e => setFormData({...formData, max_spending: e.target.value.replace(/[^0-9]/g, '')})}", "onChange={e => setFormData({...formData, max_spending: formatToDot(e.target.value)})}")

# In handleSubmit, we parse the numbers back
c = c.replace("monthly_income: parseInt(formData.monthly_income) || 0,", "monthly_income: Number(formData.monthly_income.replace(/\\D/g, '')) || 0,")
c = c.replace("max_spending: parseInt(formData.max_spending) || 0", "max_spending: Number(formData.max_spending.replace(/\\D/g, '')) || 0")


with open('frontend/src/pages/ProfilePage.tsx', 'w') as f:
    f.write(c)
