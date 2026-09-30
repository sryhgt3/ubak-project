with open('frontend/src/pages/AddTransactionPage.tsx', 'r') as f:
    c = f.read()

# Add format function and modify state
state_replace = """
  const formatToDot = (val: string) => {
    const numericStr = val.replace(/\\D/g, '');
    if (!numericStr) return '';
    return new Intl.NumberFormat('id-ID').format(Number(numericStr));
  };

  const [formData, setFormData] = useState({
    amount: '',
    type: 'Expense',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
"""
c = c.replace("""  const [formData, setFormData] = useState({
    amount: '',
    type: 'Expense',
    category: '',
    description: ''
  });""", state_replace)

# Modify Amount Input for X.XXX format
c = c.replace('type="number"\n                  required\n                  value={formData.amount}', 'type="text"\n                  required\n                  value={formData.amount}')
c = c.replace("amount: e.target.value", "amount: formatToDot(e.target.value)")

# Parse amount to Number in handleSubmit
c = c.replace("amount: parseFloat(formData.amount as string) || 0", "amount: Number((formData.amount as string).replace(/\\D/g, '')) || 0")

# Add Date input in the UI
# we will replace `</div>\n            </div>\n\n            <button` 
date_html = """
                <div className="space-y-2 md:space-y-3 md:col-span-2 mt-4 md:mt-0">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Date</label>
                  <div className="relative group/input">
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 px-4 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all font-bold text-[10px] md:text-xs text-slate-900 dark:text-white shadow-sm"
                    />
                  </div>
                </div>
            </div>

            <button"""
c = c.replace("</div>\n            </div>\n\n            <button", date_html)

with open('frontend/src/pages/AddTransactionPage.tsx', 'w') as f:
    f.write(c)
