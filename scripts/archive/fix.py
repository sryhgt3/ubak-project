with open('frontend/src/pages/AddTransactionPage.tsx', 'r') as f:
    c = f.read()
import re

# Remove the broken button part and replace with clean one
c = re.sub(r'            <button.*?<\/button>', r'''            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-lg dark:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-xl dark:hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 mt-2 md:mt-4 text-[11px] md:text-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-[18px] h-[18px] md:w-[20px] md:h-[20px]" />
                  Saving...
                </>
              ) : (
                <>
                  <Target className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" /> Save Transaction
                </>
              )}
            </button>''', c, flags=re.DOTALL)

with open('frontend/src/pages/AddTransactionPage.tsx', 'w') as f:
    f.write(c)
