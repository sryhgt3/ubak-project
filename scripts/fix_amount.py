with open('frontend/src/pages/AddTransactionPage.tsx', 'r') as f:
    c = f.read()

# We need to change formData.amount from number/string to formatted string.
# Actually, the user can just type and we format on the fly.
# Add the formatToDot function
format_fn = """
  const formatToDot = (val: string) => {
    const numericStr = val.replace(/\D/g, '');
    if (!numericStr) return '';
    return new Intl.NumberFormat('id-ID').format(Number(numericStr));
  };
"""

c = c.replace("const [formData, setFormData] = useState({", format_fn + "\n  const [formData, setFormData] = useState({")

# Replace type="number" with type="text"
c = c.replace('type="number"\n                  required\n                  value={formData.amount}', 'type="text"\n                  required\n                  value={formData.amount}')

# Replace onChange for amount
c = c.replace("onChange={(e) => setFormData({...formData, amount: e.target.value})}", "onChange={(e) => setFormData({...formData, amount: formatToDot(e.target.value)})}")

# In handleSubmit, parse the amount back to a raw number
c = c.replace("amount: parseFloat(formData.amount as string) || 0", "amount: Number((formData.amount as string).replace(/\\D/g, '')) || 0")

with open('frontend/src/pages/AddTransactionPage.tsx', 'w') as f:
    f.write(c)
