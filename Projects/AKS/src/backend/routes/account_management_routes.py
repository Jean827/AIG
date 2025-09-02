# 账户业务管理模块API路由
import sys
import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime

# 导入服务和模型
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.account_management import (
    AccountInfo, 
    RechargeDetail, 
    ExpenseDetail, 
    AccountTransaction,
    CreateAccountInfoRequest, 
    UpdateAccountInfoRequest,
    CreateRechargeDetailRequest, 
    UpdateRechargeDetailRequest,
    CreateExpenseDetailRequest, 
    UpdateExpenseDetailRequest,
    CreateAccountTransactionRequest, 
    UpdateAccountTransactionRequest,
    AccountQueryRequest
)
from services.account_management_service import account_management_service

# 创建路由实例
router = APIRouter(
    prefix="/api/account",
    tags=["Account Management"],
    responses={404: {"description": "Not found"}}
)


# 账户信息管理路由
@router.get("/accounts", response_model=List[AccountInfo])
def get_accounts(
    user_id: Optional[str] = None,
    account_status: Optional[int] = None
):
    """获取账户列表"""
    return account_management_service.get_accounts(user_id, account_status)


@router.get("/accounts/{account_id}", response_model=AccountInfo)
def get_account_by_id(account_id: str):
    """根据ID获取账户信息"""
    account = account_management_service.get_account_by_id(account_id)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Account with id {account_id} not found"
        )
    return account


@router.post("/accounts", response_model=AccountInfo, status_code=status.HTTP_201_CREATED)
def create_account(request: CreateAccountInfoRequest):
    """创建账户信息"""
    account = account_management_service.create_account(request)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create account"
        )
    return account


@router.put("/accounts/{account_id}", response_model=AccountInfo)
def update_account(account_id: str, request: UpdateAccountInfoRequest):
    """更新账户信息"""
    account = account_management_service.update_account(account_id, request)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Account with id {account_id} not found"
        )
    return account


@router.delete("/accounts/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(account_id: str):
    """删除账户信息"""
    success = account_management_service.delete_account(account_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete account with id {account_id} as it has balance or pending transactions"
        )


# 充值明细管理路由
@router.get("/recharges", response_model=List[RechargeDetail])
def get_recharges(
    account_id: Optional[str] = None,
    recharge_no: Optional[str] = None,
    status: Optional[str] = None,
    recharge_date_from: Optional[datetime] = None,
    recharge_date_to: Optional[datetime] = None
):
    """获取充值明细列表"""
    return account_management_service.get_recharges(account_id, recharge_no, status, recharge_date_from, recharge_date_to)


@router.get("/recharges/{recharge_id}", response_model=RechargeDetail)
def get_recharge_by_id(recharge_id: str):
    """根据ID获取充值明细"""
    recharge = account_management_service.get_recharge_by_id(recharge_id)
    if not recharge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recharge with id {recharge_id} not found"
        )
    return recharge


@router.post("/recharges", response_model=RechargeDetail, status_code=status.HTTP_201_CREATED)
def create_recharge(request: CreateRechargeDetailRequest):
    """创建充值明细"""
    recharge = account_management_service.create_recharge(request)
    if not recharge:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid account_id or failed to create recharge"
        )
    return recharge


@router.put("/recharges/{recharge_id}", response_model=RechargeDetail)
def update_recharge(recharge_id: str, request: UpdateRechargeDetailRequest):
    """更新充值明细"""
    recharge = account_management_service.update_recharge(recharge_id, request)
    if not recharge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recharge with id {recharge_id} not found"
        )
    return recharge


# 支出明细管理路由
@router.get("/expenses", response_model=List[ExpenseDetail])
def get_expenses(
    account_id: Optional[str] = None,
    expense_no: Optional[str] = None,
    status: Optional[str] = None,
    expense_date_from: Optional[datetime] = None,
    expense_date_to: Optional[datetime] = None
):
    """获取支出明细列表"""
    return account_management_service.get_expenses(account_id, expense_no, status, expense_date_from, expense_date_to)


@router.get("/expenses/{expense_id}", response_model=ExpenseDetail)
def get_expense_by_id(expense_id: str):
    """根据ID获取支出明细"""
    expense = account_management_service.get_expense_by_id(expense_id)
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with id {expense_id} not found"
        )
    return expense


@router.post("/expenses", response_model=ExpenseDetail, status_code=status.HTTP_201_CREATED)
def create_expense(request: CreateExpenseDetailRequest):
    """创建支出明细"""
    expense = account_management_service.create_expense(request)
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid account_id, insufficient balance, or failed to create expense"
        )
    return expense


@router.put("/expenses/{expense_id}", response_model=ExpenseDetail)
def update_expense(expense_id: str, request: UpdateExpenseDetailRequest):
    """更新支出明细"""
    expense = account_management_service.update_expense(expense_id, request)
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with id {expense_id} not found"
        )
    return expense


# 账户交易管理路由
@router.get("/transactions", response_model=List[AccountTransaction])
def get_transactions(
    account_id: Optional[str] = None,
    transaction_type: Optional[str] = None,
    status: Optional[str] = None,
    transaction_date_from: Optional[datetime] = None,
    transaction_date_to: Optional[datetime] = None
):
    """获取账户交易列表"""
    return account_management_service.get_transactions(account_id, transaction_type, status, transaction_date_from, transaction_date_to)


@router.get("/transactions/{transaction_id}", response_model=AccountTransaction)
def get_transaction_by_id(transaction_id: str):
    """根据ID获取账户交易"""
    transaction = account_management_service.get_transaction_by_id(transaction_id)
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transaction with id {transaction_id} not found"
        )
    return transaction


@router.post("/transactions", response_model=AccountTransaction, status_code=status.HTTP_201_CREATED)
def create_transaction(request: CreateAccountTransactionRequest):
    """创建账户交易"""
    transaction = account_management_service.create_transaction(request)
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid account_id or failed to create transaction"
        )
    return transaction


@router.put("/transactions/{transaction_id}", response_model=AccountTransaction)
def update_transaction(transaction_id: str, request: UpdateAccountTransactionRequest):
    """更新账户交易"""
    transaction = account_management_service.update_transaction(transaction_id, request)
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transaction with id {transaction_id} not found"
        )
    return transaction


# 高级查询路由
@router.post("/accounts/query", response_model=List[AccountInfo])
def query_accounts(request: AccountQueryRequest):
    """高级查询账户信息"""
    return account_management_service.query_accounts(request)


# 批量操作路由
@router.post("/accounts/batch", status_code=status.HTTP_201_CREATED)
def batch_create_accounts(requests: List[CreateAccountInfoRequest]):
    """批量创建账户信息"""
    created_accounts = []
    for req in requests:
        account = account_management_service.create_account(req)
        if account:
            created_accounts.append(account)
    return {
        "created_count": len(created_accounts),
        "created_ids": [a.id for a in created_accounts]
    }


# 账户余额操作路由
@router.post("/accounts/{account_id}/freeze")
def freeze_account_balance(account_id: str, amount: float):
    """冻结账户余额"""
    success = account_management_service.freeze_account_balance(account_id, amount)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to freeze balance for account {account_id}. Insufficient balance or invalid account."
        )
    return {"message": "Balance frozen successfully"}


@router.post("/accounts/{account_id}/unfreeze")
def unfreeze_account_balance(account_id: str, amount: float):
    """解冻账户余额"""
    success = account_management_service.unfreeze_account_balance(account_id, amount)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to unfreeze balance for account {account_id}. Insufficient frozen balance or invalid account."
        )
    return {"message": "Balance unfrozen successfully"}


# 数据统计路由
@router.get("/statistics/accounts")
def get_account_statistics():
    """获取账户统计信息"""
    return account_management_service.get_account_statistics()


@router.get("/statistics/transactions")
def get_transaction_statistics():
    """获取交易统计信息"""
    return account_management_service.get_transaction_statistics()


@router.get("/statistics/recharges")
def get_recharge_statistics():
    """获取充值统计信息"""
    return account_management_service.get_recharge_statistics()


@router.get("/statistics/expenses")
def get_expense_statistics():
    """获取支出统计信息"""
    return account_management_service.get_expense_statistics()


# 账户流水路由
@router.get("/accounts/{account_id}/statement")
def get_account_statement(
    account_id: str,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    page: int = 1,
    page_size: int = 20
):
    """获取账户流水"""
    if account_id not in account_management_service.accounts_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Account with id {account_id} not found"
        )
    
    statement = account_management_service.get_account_statement(account_id, start_date, end_date, page, page_size)
    return statement


# 导出数据路由
@router.get("/export/accounts")
def export_accounts():
    """导出账户数据"""
    file_path = account_management_service.export_accounts()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }


@router.get("/export/recharges")
def export_recharges():
    """导出充值数据"""
    file_path = account_management_service.export_recharges()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }


@router.get("/export/expenses")
def export_expenses():
    """导出支出数据"""
    file_path = account_management_service.export_expenses()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }


@router.get("/export/transactions")
def export_transactions():
    """导出交易数据"""
    file_path = account_management_service.export_transactions()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }