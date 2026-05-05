from models import User, TransactionType
from repositories.transaction_repository import TransactionRepository
from datetime import datetime, timedelta
from collections import defaultdict

class AnalyticsService:
    def __init__(self, transaction_repo: TransactionRepository):
        self.transaction_repo = transaction_repo

    def get_spending_trends(self, user_id: int, days: int = 30):
        transactions = self.transaction_repo.get_by_user_id(user_id)
        cutoff = datetime.utcnow() - timedelta(days=days)
        
        # Filter and sort
        filtered = [t for t in transactions if t.date >= cutoff]
        
        # Aggregate by date
        daily_data = defaultdict(lambda: {"income": 0, "expense": 0})
        for t in filtered:
            date_str = t.date.strftime("%Y-%m-%d")
            if t.type == TransactionType.Income:
                daily_data[date_str]["income"] += t.amount
            else:
                daily_data[date_str]["expense"] += t.amount
        
        # Format for charts
        sorted_dates = sorted(daily_data.keys())
        chart_data = [
            {
                "date": d,
                "income": daily_data[d]["income"],
                "expense": daily_data[d]["expense"]
            }
            for d in sorted_dates
        ]
        
        return chart_data

    def get_category_breakdown(self, user_id: int):
        transactions = self.transaction_repo.get_by_user_id(user_id)
        expenses = [t for t in transactions if t.type == TransactionType.Expense]
        
        breakdown = defaultdict(float)
        for e in expenses:
            breakdown[e.category] += e.amount
            
        total_expense = sum(breakdown.values())
        
        return [
            {
                "category": cat,
                "amount": amt,
                "percentage": (amt / total_expense * 100) if total_expense > 0 else 0
            }
            for cat, amt in breakdown.items()
        ]

    def get_savings_insights(self, user: User, total_income: float, total_expense: float):
        net_savings = total_income - total_expense
        savings_rate = (net_savings / total_income * 100) if total_income > 0 else 0
        
        advice = ""
        if savings_rate < 10:
            advice = "Tingkat tabungan Anda cukup rendah. Coba tinjau kategori pengeluaran terbesar Anda."
        elif savings_rate < 30:
            advice = "Bagus! Anda menabung secara konsisten. Coba alokasikan lebih banyak ke investasi."
        else:
            advice = "Luar biasa! Tingkat tabungan Anda sangat tinggi. Anda di jalur yang tepat menuju kebebasan finansial."
            
        return {
            "net_savings": net_savings,
            "savings_rate": savings_rate,
            "advice": advice
        }
