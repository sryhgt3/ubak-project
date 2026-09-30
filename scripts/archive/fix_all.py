import re

# 1. Fix AddTransactionPage.tsx
with open('frontend/src/pages/AddTransactionPage.tsx', 'r') as f:
    c = f.read()

# Restore format logic for amount
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

c = c.replace('type="number"\n                  required\n                  value={formData.amount}', 'type="text"\n                  required\n                  value={formData.amount}')
c = c.replace("amount: e.target.value", "amount: formatToDot(e.target.value)")
c = c.replace("amount: parseFloat(formData.amount as string) || 0", "amount: Number((formData.amount as string).replace(/\\D/g, '')) || 0")

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
"""
# Find the end of description div and insert date_html before the closing div of the grid
c = re.sub(r'(placeholder="DESCRIPTION\.\.\."\n                    \/>\n                  <\/div>\n                <\/div>)', r'\1\n' + date_html, c)

with open('frontend/src/pages/AddTransactionPage.tsx', 'w') as f:
    f.write(c)

# 2. Fix DashboardPage.tsx
with open('frontend/src/pages/DashboardPage.tsx', 'r') as f:
    c = f.read()

# Add useMemo safely
if "useMemo" not in c:
    c = c.replace("import React, { useEffect, useState }", "import React, { useEffect, useState, useMemo }")

aggregation_code = """
  const timeSeriesComparisonData = React.useMemo(() => {
    if (!dashboardData?.recent_transactions) return [];
    const aggregated: Record<string, { date: string, income: number, expense: number }> = {};
    [...dashboardData.recent_transactions].reverse().forEach((t: any) => {
      const dateKey = new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      if (!aggregated[dateKey]) aggregated[dateKey] = { date: dateKey, income: 0, expense: 0 };
      if (t.type === 'Income') aggregated[dateKey].income += t.amount;
      if (t.type === 'Expense') aggregated[dateKey].expense += t.amount;
    });
    return Object.values(aggregated);
  }, [dashboardData]);
"""
c = c.replace("const timeSeriesData = dashboardData?.recent_transactions ?", aggregation_code + "\n  const timeSeriesData = dashboardData?.recent_transactions ?")

bar_chart_block = r"""<ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
                  <Bar dataKey="amount" radius={[16, 16, 0, 0]} maxBarSize={120}>
                    {comparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>"""

area_chart_comparison = """<ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeSeriesComparisonData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="income" stroke="#22d3ee" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expense" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>"""
c = c.replace(bar_chart_block, area_chart_comparison)

# Remove unused vars safely
c = c.replace("import { \n  PieChart, Pie, ResponsiveContainer, BarChart, Bar, AreaChart, Area, XAxis, Tooltip, Cell\n} from 'recharts';", "import { \n  PieChart, Pie, ResponsiveContainer, AreaChart, Area, XAxis, Tooltip\n} from 'recharts';")

# Remove comparisonData declaration safely
c = re.sub(r'  const comparisonData = \[\n    \{ name: \'Income\', amount: dashboardData\?\.total_income \|\| 0, fill: \'#22d3ee\' \},\n    \{ name: \'Expenses\', amount: dashboardData\?\.total_expenses \|\| 0, fill: \'#8b5cf6\' \}\n  \];\n', '', c)

with open('frontend/src/pages/DashboardPage.tsx', 'w') as f:
    f.write(c)

