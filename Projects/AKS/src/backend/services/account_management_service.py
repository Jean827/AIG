# 账户业务管理模块服务层实现
import sys
import os
from typing import List, Optional, Dict, Tuple
from datetime import datetime
import uuid

# 导入模型
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.account_management import (
    AccountInfo,
    RechargeDetail,
    ExpenseDetail,
    AccountTransaction,
    CreateAccountInfoRequest,
    UpdateAccountInfoRequest,
    CreateRechargeDetailRequest,
    CreateExpenseDetailRequest
)


class AccountManagementService:
    def __init__(self):
        # 模拟数据库存储
        self.accounts_db: Dict[str, AccountInfo] = {}
        self.recharge_details_db: Dict[str, RechargeDetail] = {}
        self.expense_details_db: Dict[str, ExpenseDetail] = {}
        self.transactions_db: Dict[str, AccountTransaction] = {}
        # 初始化一些测试数据
        self._init_test_data()
    
    def _init_test_data(self):
        # 初始化账户数据
        account1 = AccountInfo(
            id=str(uuid.uuid4()),
            user_id="user001",
            user_type="承包户",
            account_balance=10000.0,
            frozen_balance=0.0,
            currency="元",
            account_status=1,
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.accounts_db[account1.id] = account1
        
        account2 = AccountInfo(
            id=str(uuid.uuid4()),
            user_id="user002",
            user_type="承包户",
            account_balance=5000.0,
            frozen_balance=0.0,
            currency="元",
            account_status=1,
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.accounts_db[account2.id] = account2
    
    # 账户信息管理
    def get_accounts(self, 
                    user_id: Optional[str] = None, 
                    account_status: Optional[int] = None) -> List[AccountInfo]:
        """获取所有账户信息"""
        accounts = list(self.accounts_db.values())
        
        if user_id:
            accounts = [a for a in accounts if a.user_id == user_id]
        if account_status is not None:
            accounts = [a for a in accounts if a.account_status == account_status]
            
        return accounts
    
    def get_account_by_id(self, account_id: str) -> Optional[AccountInfo]:
        """根据ID获取账户信息"""
        return self.accounts_db.get(account_id)
    
    def get_account_by_user_id(self, user_id: str) -> Optional[AccountInfo]:
        """根据用户ID获取账户信息"""
        for account in self.accounts_db.values():
            if account.user_id == user_id:
                return account
        return None
    
    def create_account(self, request: CreateAccountInfoRequest) -> AccountInfo:
        """创建账户信息"""
        # 检查用户是否已经有账户
        existing_account = self.get_account_by_user_id(request.user_id)
        if existing_account:
            return existing_account
        
        account = AccountInfo(
            id=str(uuid.uuid4()),
            user_id=request.user_id,
            user_type=request.user_type,
            account_balance=request.account_balance or 0.0,
            frozen_balance=request.frozen_balance or 0.0,
            currency="元",
            account_status=request.account_status,
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.accounts_db[account.id] = account
        
        # 记录交易
        if request.account_balance and request.account_balance > 0:
            self._record_transaction(
                account_id=account.id,
                transaction_type="recharge",
                amount=request.account_balance,
                description="账户初始化充值"
            )
        
        return account
    
    def update_account(self, account_id: str, request: UpdateAccountInfoRequest) -> Optional[AccountInfo]:
        """更新账户信息"""
        if account_id not in self.accounts_db:
            return None
        
        account = self.accounts_db[account_id]
        if request.user_id is not None:
            account.user_id = request.user_id
        if request.user_type is not None:
            account.user_type = request.user_type
        if request.account_status is not None:
            account.account_status = request.account_status
        account.update_time = datetime.now()
        
        self.accounts_db[account_id] = account
        return account
    
    def delete_account(self, account_id: str) -> bool:
        """删除账户信息"""
        if account_id not in self.accounts_db:
            return False
        
        # 检查账户余额是否为0
        account = self.accounts_db[account_id]
        if account.account_balance != 0 or account.frozen_balance != 0:
            return False
        
        del self.accounts_db[account_id]
        return True
    
    # 充值管理
    def get_recharge_details(self, 
                            account_id: Optional[str] = None, 
                            status: Optional[str] = None, 
                            start_date: Optional[datetime] = None, 
                            end_date: Optional[datetime] = None) -> List[RechargeDetail]:
        """获取所有充值明细"""
        details = list(self.recharge_details_db.values())
        
        if account_id is not None:
            details = [d for d in details if d.account_id == account_id]
        if status is not None:
            details = [d for d in details if d.status == status]
        if start_date is not None:
            details = [d for d in details if d.recharge_time >= start_date]
        if end_date is not None:
            details = [d for d in details if d.recharge_time <= end_date]
            
        # 按时间倒序排序
        details.sort(key=lambda x: x.recharge_time, reverse=True)
        return details
    
    def get_recharge_detail_by_id(self, recharge_id: str) -> Optional[RechargeDetail]:
        """根据ID获取充值明细"""
        return self.recharge_details_db.get(recharge_id)
    
    def create_recharge(self, request: CreateRechargeDetailRequest) -> Optional[Tuple[RechargeDetail, AccountInfo]]:
        """创建充值记录"""
        # 检查账户是否存在
        account = self.get_account_by_id(request.account_id)
        if not account or account.account_status != 1:
            return None
        
        # 创建充值记录
        recharge = RechargeDetail(
            id=str(uuid.uuid4()),
            account_id=request.account_id,
            user_id=account.user_id,
            recharge_amount=request.amount,
            payment_method=request.payment_method,
            transaction_id=request.remark,
            status="已支付",  # 模拟充值成功
            recharge_time=datetime.now(),
            remark=request.remark
        )
        self.recharge_details_db[recharge.id] = recharge
        
        # 更新账户余额
        account.account_balance += request.amount
        account.update_time = datetime.now()
        self.accounts_db[account.id] = account
        
        # 记录交易
        self._record_transaction(
            account_id=account.id,
            transaction_type="recharge",
            amount=request.amount,
            description=f"充值 {request.amount}元"
        )
        
        return recharge, account
    
    # 支出管理
    def get_expense_details(self, 
                           account_id: Optional[str] = None, 
                           expense_type: Optional[str] = None, 
                           start_date: Optional[datetime] = None, 
                           end_date: Optional[datetime] = None) -> List[ExpenseDetail]:
        """获取所有支出明细"""
        details = list(self.expense_details_db.values())
        
        if account_id is not None:
            details = [d for d in details if d.account_id == account_id]
        if expense_type is not None:
            details = [d for d in details if d.expense_type == expense_type]
        if start_date is not None:
            details = [d for d in details if d.transaction_time >= start_date]
        if end_date is not None:
            details = [d for d in details if d.transaction_time <= end_date]
            
        # 按时间倒序排序
        details.sort(key=lambda x: x.transaction_time, reverse=True)
        return details
    
    def get_expense_detail_by_id(self, expense_id: str) -> Optional[ExpenseDetail]:
        """根据ID获取支出明细"""
        return self.expense_details_db.get(expense_id)
    
    def create_expense(self, request: CreateExpenseDetailRequest) -> Optional[Tuple[ExpenseDetail, AccountInfo]]:
        """创建支出记录"""
        # 检查账户是否存在
        account = self.get_account_by_id(request.account_id)
        if not account or account.account_status != 1:
            return None
        
        # 检查余额是否足够
        if account.account_balance < request.expense_amount:
            return None
        
        # 创建支出记录
        expense = ExpenseDetail(
            id=str(uuid.uuid4()),
            account_id=request.account_id,
            user_id=account.user_id,
            expense_amount=request.expense_amount,
            expense_type=request.expense_type,
            related_business_id=request.related_business_id,
            transaction_time=datetime.now(),
            remark=request.remark
        )
        self.expense_details_db[expense.id] = expense
        
        # 更新账户余额
        account.account_balance -= request.expense_amount
        account.update_time = datetime.now()
        self.accounts_db[account.id] = account
        
        # 记录交易
        self._record_transaction(
            account_id=account.id,
            transaction_type="expense",
            amount=request.expense_amount,
            description=f"{request.expense_type}支出 {request.expense_amount}元"
        )
        
        return expense, account
    
    # 账户交易管理
    def get_transactions(self, 
                        account_id: Optional[str] = None, 
                        transaction_type: Optional[str] = None, 
                        start_date: Optional[datetime] = None, 
                        end_date: Optional[datetime] = None) -> List[AccountTransaction]:
        """获取所有账户交易记录"""
        transactions = list(self.transactions_db.values())
        
        if account_id is not None:
            transactions = [t for t in transactions if t.account_id == account_id]
        if transaction_type is not None:
            transactions = [t for t in transactions if t.transaction_type == transaction_type]
        if start_date is not None:
            transactions = [t for t in transactions if t.transaction_time >= start_date]
        if end_date is not None:
            transactions = [t for t in transactions if t.transaction_time <= end_date]
            
        # 按时间倒序排序
        transactions.sort(key=lambda x: x.transaction_time, reverse=True)
        return transactions
    
    def get_transaction_by_id(self, transaction_id: str) -> Optional[AccountTransaction]:
        """根据ID获取账户交易记录"""
        return self.transactions_db.get(transaction_id)
    
    def _record_transaction(self, 
                           account_id: str, 
                           transaction_type: str, 
                           amount: float, 
                           description: str) -> AccountTransaction:
        """记录账户交易"""
        # 获取交易前后余额
        account = self.get_account_by_id(account_id)
        balance_before = account.account_balance - (amount if transaction_type == "recharge" else -amount)
        balance_after = account.account_balance
        
        transaction = AccountTransaction(
            id=str(uuid.uuid4()),
            account_id=account_id,
            transaction_type=transaction_type,
            amount=amount,
            balance_before=balance_before,
            balance_after=balance_after,
            transaction_time=datetime.now(),
            business_type=description,
            business_id=None,
            remark=description
        )
        self.transactions_db[transaction.id] = transaction
        return transaction
    
    # 冻结和解冻余额
    def freeze_balance(self, account_id: str, amount: float, reason: str) -> Optional[AccountInfo]:
        """冻结账户余额"""
        # 检查账户是否存在
        account = self.get_account_by_id(account_id)
        if not account or account.account_status != 1:
            return None
        
        # 检查余额是否足够
        if account.account_balance < amount:
            return None
        
        # 冻结余额
        account.account_balance -= amount
        account.frozen_balance += amount
        account.update_time = datetime.now()
        self.accounts_db[account.id] = account
        
        # 记录交易
        self._record_transaction(
            account_id=account.id,
            transaction_type="freeze",
            amount=amount,
            description=f"冻结余额 {amount}元: {reason}"
        )
        
        return account
    
    def unfreeze_balance(self, account_id: str, amount: float, reason: str) -> Optional[AccountInfo]:
        """解冻账户余额"""
        # 检查账户是否存在
        account = self.get_account_by_id(account_id)
        if not account:
            return None
        
        # 检查冻结余额是否足够
        if account.frozen_balance < amount:
            return None
        
        # 解冻余额
        account.frozen_balance -= amount
        account.account_balance += amount
        account.update_time = datetime.now()
        self.accounts_db[account.id] = account
        
        # 记录交易
        self._record_transaction(
            account_id=account.id,
            transaction_type="unfreeze",
            amount=amount,
            description=f"解冻余额 {amount}元: {reason}"
        )
        
        return account
    
    # 账户统计
    def get_account_statistics(self, account_id: str) -> Optional[Dict]:
        """获取账户统计信息"""
        # 检查账户是否存在
        account = self.get_account_by_id(account_id)
        if not account:
            return None
        
        # 计算统计信息
        now = datetime.now()
        month_start = datetime(now.year, now.month, 1)
        
        # 本月充值总额
        monthly_recharge = sum(
            r.recharge_amount for r in self.recharge_details_db.values()
            if r.account_id == account_id and 
               r.status == "已支付" and 
               r.recharge_time >= month_start
        )
        
        # 本月支出总额
        monthly_expense = sum(
            e.expense_amount for e in self.expense_details_db.values()
            if e.account_id == account_id and 
               e.transaction_time >= month_start
        )
        
        # 累计充值总额
        total_recharge = sum(
            r.recharge_amount for r in self.recharge_details_db.values()
            if r.account_id == account_id and r.status == "已支付"
        )
        
        # 累计支出总额
        total_expense = sum(
            e.expense_amount for e in self.expense_details_db.values()
            if e.account_id == account_id
        )
        
        return {
            "account_id": account_id,
            "current_balance": account.account_balance,
            "frozen_balance": account.frozen_balance,
            "monthly_recharge": monthly_recharge,
            "monthly_expense": monthly_expense,
            "total_recharge": total_recharge,
            "total_expense": total_expense
        }


# 创建服务实例供导入使用
account_management_service = AccountManagementService()