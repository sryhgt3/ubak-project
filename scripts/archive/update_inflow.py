with open('frontend/src/pages/InflowPage.tsx', 'r') as f:
    c = f.read()

import re

# Add dateFilter state
c = c.replace("const [searchTerm, setSearchTerm] = useState('');", "const [searchTerm, setSearchTerm] = useState('');\n  const [dateFilter, setDateFilter] = useState('');")

# Inject Date input next to Search input
search_div = r'<div className="relative group w-full md:w-96">'
date_filter_ui = """
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative group w-full md:w-48">
            <input 
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-white/80 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl py-3.5 md:py-4 px-4 focus:ring-1 focus:ring-cyan-500/30 outline-none transition-all text-[10px] md:text-xs font-black tracking-widest uppercase text-slate-800 dark:text-white shadow-sm dark:shadow-2xl backdrop-blur-md"
            />
          </div>
          <div className="relative group w-full md:w-96">
"""
c = c.replace(search_div, date_filter_ui)
c = c.replace('/>\n        </div>\n      </div>', '/>\n          </div>\n        </div>\n      </div>')

# Pass dateFilter to TransactionGroupedList
c = c.replace('searchTerm={searchTerm}', 'searchTerm={searchTerm}\n          dateFilter={dateFilter}')

with open('frontend/src/pages/InflowPage.tsx', 'w') as f:
    f.write(c)
