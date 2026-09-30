with open('frontend/src/pages/DashboardPage.tsx', 'r') as f:
    c = f.read()

import re

# Add useMemo to imports if not there
if "useMemo" not in c:
    c = c.replace("import React, { useEffect, useState }", "import React, { useEffect, useState, useMemo }")
else:
    # it's there
    pass

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

# Replace the BarChart block
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

with open('frontend/src/pages/DashboardPage.tsx', 'w') as f:
    f.write(c)
