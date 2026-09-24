import re

# Update transaction_repository.py
with open("backend/repositories/transaction_repository.py", "r") as f:
    repo_content = f.read()

repo_content += """
    def delete(self, transaction: Transaction):
        self.db.delete(transaction)
        self.db.commit()
"""
with open("backend/repositories/transaction_repository.py", "w") as f:
    f.write(repo_content)

# Update transaction_service.py
with open("backend/services/transaction_service.py", "r") as f:
    svc_content = f.read()

svc_content += """
    def delete_transaction(self, transaction_id: int, user: User):
        db_transaction = self.transaction_repo.get_by_id_and_user_id(transaction_id, user.id)
        if not db_transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        self.transaction_repo.delete(db_transaction)
        return {"message": "Transaction deleted successfully"}
"""
with open("backend/services/transaction_service.py", "w") as f:
    f.write(svc_content)

# Update transactions.py
with open("backend/routers/transactions.py", "r") as f:
    router_content = f.read()

router_content += """
@router.delete("/transactions/{transaction_id}")
async def delete_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    service: TransactionService = Depends(get_transaction_service)
):
    return service.delete_transaction(transaction_id, current_user)
"""
with open("backend/routers/transactions.py", "w") as f:
    f.write(router_content)

print("Backend DELETE updated.")
