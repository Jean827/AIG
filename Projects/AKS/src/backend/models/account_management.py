# 账户业务管理模块模型定义
from datetime import datetime
from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from models.fee_management import FeeTypeEnum, PaymentStatusEnum, FeeStatusEnum

# 账户信息模型
class AccountInfo(BaseModel):
    id: str = Field(..., description="账户ID")
    user_id: str = Field(..., description="用户ID")
    user_type: str = Field(..., description="用户类型", enum=["承包户", "管理员", "其他"])
    account_balance: float = Field(..., description="账户余额")
    frozen_balance: float = Field(..., description="冻结余额")
    currency: str = Field(default="元", description="货币单位")
    account_status: int = Field(..., description="账户状态", enum=[0, 1, 2])  # 0: 禁用, 1: 正常, 2: 冻结
    create_time: Optional[datetime] = Field(None, description="创建时间")
    update_time: Optional[datetime] = Field(None, description="更新时间")

# 创建账户请求
class CreateAccountInfoRequest(BaseModel):
    user_id: str = Field(..., description="用户ID")
    user_type: str = Field(..., description="用户类型", enum=["承包户", "管理员", "其他"])
    account_balance: float = Field(0, description="初始账户余额")
    frozen_balance: float = Field(0, description="初始冻结余额")
    currency: str = Field(default="元", description="货币单位")
    account_status: int = Field(..., description="账户状态", enum=[0, 1])  # 0: 禁用, 1: 正常

# 更新账户请求
class UpdateAccountInfoRequest(BaseModel):
    user_id: Optional[str] = Field(None, description="用户ID")
    user_type: Optional[str] = Field(None, description="用户类型", enum=["承包户", "管理员", "其他"])
    account_status: Optional[int] = Field(None, description="账户状态", enum=[0, 1, 2])

# 充值明细模型
class RechargeDetail(BaseModel):
    id: str = Field(..., description="充值ID")
    account_id: str = Field(..., description="账户ID")
    user_id: str = Field(..., description="用户ID")
    recharge_amount: float = Field(..., description="充值金额")
    payment_method: str = Field(..., description="支付方式", enum=["在线支付", "线下支付", "其他"])
    transaction_id: Optional[str] = Field(None, description="交易流水号")
    status: str = Field(..., description="充值状态", enum=["待支付", "已支付", "支付失败", "已退款"])
    recharge_time: Optional[datetime] = Field(None, description="充值时间")
    remark: Optional[str] = Field(None, description="备注")

# 充值请求
class CreateRechargeDetailRequest(BaseModel):
    amount: float = Field(..., description="充值金额")
    payment_method: str = Field(..., description="支付方式", enum=["在线支付", "线下支付", "其他"])
    remark: Optional[str] = Field(None, description="备注")

# 更新充值请求
class UpdateRechargeDetailRequest(BaseModel):
    status: Optional[str] = Field(None, description="充值状态", enum=["待支付", "已支付", "支付失败", "已退款"])
    transaction_id: Optional[str] = Field(None, description="交易流水号")
    remark: Optional[str] = Field(None, description="备注")

# 支出明细模型
class ExpenseDetail(BaseModel):
    id: str = Field(..., description="支出ID")
    account_id: str = Field(..., description="账户ID")
    user_id: str = Field(..., description="用户ID")
    expense_amount: float = Field(..., description="支出金额")
    expense_type: str = Field(..., description="支出类型", enum=["土地承包费", "保证金", "其他费用"])
    related_business_id: Optional[str] = Field(None, description="关联业务ID")
    transaction_time: Optional[datetime] = Field(None, description="交易时间")
    remark: Optional[str] = Field(None, description="备注")

# 创建支出请求
class CreateExpenseDetailRequest(BaseModel):
    account_id: str = Field(..., description="账户ID")
    expense_amount: float = Field(..., description="支出金额")
    expense_type: str = Field(..., description="支出类型", enum=["土地承包费", "保证金", "其他费用"])
    related_business_id: Optional[str] = Field(None, description="关联业务ID")
    remark: Optional[str] = Field(None, description="备注")

# 更新支出请求
class UpdateExpenseDetailRequest(BaseModel):
    expense_amount: Optional[float] = Field(None, description="支出金额")
    expense_type: Optional[str] = Field(None, description="支出类型", enum=["土地承包费", "保证金", "其他费用"])
    related_business_id: Optional[str] = Field(None, description="关联业务ID")
    remark: Optional[str] = Field(None, description="备注")

# 交易记录查询请求
class TransactionQueryRequest(BaseModel):
    start_date: Optional[datetime] = Field(None, description="开始日期")
    end_date: Optional[datetime] = Field(None, description="结束日期")
    transaction_type: Optional[str] = Field(None, description="交易类型", enum=["充值", "支出", "全部"])
    status: Optional[str] = Field(None, description="状态")
    page: int = Field(..., description="页码", ge=1)
    page_size: int = Field(..., description="每页数量", ge=1, le=100)

# 账户查询请求
class AccountQueryRequest(BaseModel):
    account_name: Optional[str] = Field(None, description="账户名称")
    account_type: Optional[str] = Field(None, description="账户类型")
    status: Optional[str] = Field(None, description="状态")
    holder_id: Optional[str] = Field(None, description="持有者ID")
    page: int = Field(1, description="页码", ge=1)
    page_size: int = Field(10, description="每页数量", ge=1, le=100)

# 账户交易记录模型
class AccountTransaction(BaseModel):
    id: str = Field(..., description="交易ID")
    account_id: str = Field(..., description="账户ID")
    transaction_type: str = Field(..., description="交易类型", enum=["充值", "支出"])
    amount: float = Field(..., description="交易金额")
    balance_before: float = Field(..., description="交易前余额")
    balance_after: float = Field(..., description="交易后余额")
    transaction_time: datetime = Field(..., description="交易时间")
    business_type: str = Field(..., description="业务类型")
    business_id: Optional[str] = Field(None, description="业务ID")
    remark: Optional[str] = Field(None, description="备注")

# 创建交易记录请求
class CreateAccountTransactionRequest(BaseModel):
    account_id: str = Field(..., description="账户ID")
    transaction_type: str = Field(..., description="交易类型", enum=["充值", "支出"])
    amount: float = Field(..., description="交易金额")
    balance_before: float = Field(..., description="交易前余额")
    balance_after: float = Field(..., description="交易后余额")
    business_type: str = Field(..., description="业务类型")
    business_id: Optional[str] = Field(None, description="业务ID")
    remark: Optional[str] = Field(None, description="备注")

# 更新交易记录请求
class UpdateAccountTransactionRequest(BaseModel):
    business_type: Optional[str] = Field(None, description="业务类型")
    business_id: Optional[str] = Field(None, description="业务ID")
    remark: Optional[str] = Field(None, description="备注")

# 余额变动请求
class BalanceChangeRequest(BaseModel):
    account_id: str = Field(..., description="账户ID")
    amount: float = Field(..., description="变动金额")
    business_type: str = Field(..., description="业务类型")
    business_id: Optional[str] = Field(None, description="业务ID")
    remark: Optional[str] = Field(None, description="备注")

# 账户冻结/解冻请求
class AccountFreezeRequest(BaseModel):
    account_id: str = Field(..., description="账户ID")
    amount: float = Field(..., description="冻结/解冻金额")
    reason: str = Field(..., description="冻结/解冻原因")
    is_freeze: bool = Field(..., description="是否冻结")