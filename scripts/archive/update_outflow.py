with open('frontend/src/pages/OutflowPage.tsx', 'r') as f:
    c = f.read()

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
              className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 md:py-4 px-4 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all text-[10px] md:text-xs font-black tracking-widest uppercase text-slate-900 dark:text-white shadow-lg dark:shadow-2xl backdrop-blur-md"
            />
          </div>
          <div className="relative group w-full md:w-96">
"""
c = c.replace(search_div, date_filter_ui)
c = c.replace('/>\n        </div>\n      </div>', '/>\n          </div>\n        </div>\n      </div>')

# Pass dateFilter to TransactionGroupedList
c = c.replace('searchTerm={searchTerm}', 'searchTerm={searchTerm}\n          dateFilter={dateFilter}')

with open('frontend/src/pages/OutflowPage.tsx', 'w') as f:
    f.write(c)
