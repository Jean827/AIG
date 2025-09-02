# 费用信息管理模块模型定义
from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field

# 枚举定义
class FeeTypeEnum(str, Enum):
    LAND_CONTRACT_FEE = "土地承包费"
    MANAGEMENT_FEE = "管理费"
    WATER_FEE = "水费"
    ELECTRICITY_FEE = "电费"
    OTHER_FEE = "其他费用"

class FeeStatusEnum(str, Enum):
    PENDING = "待支付"
    PARTIAL_PAID = "部分支付"
    PAID = "已支付"
    OVERDUE = "已逾期"
    REDUCED = "已核减"

class ReductionStatusEnum(str, Enum):
    APPROVED = "已通过"
    REJECTED = "已拒绝"
    PENDING = "待审核"

class PaymentStatusEnum(str, Enum):
    SUCCESS = "成功"
    FAILED = "失败"
    PROCESSING = "处理中"

# 费用信息模型
class FeeInfo(BaseModel):
    id: str = Field(..., description="费用ID")
    contract_id: str = Field(..., description="合同ID")
    land_id: str = Field(..., description="土地ID")
    user_id: str = Field(..., description="用户ID")
    fee_type: FeeTypeEnum = Field(..., description="费用类型")
    amount: float = Field(..., description="费用金额")
    original_amount: float = Field(..., description="原始金额")
    reduction_amount: float = Field(..., description="核减金额")
    due_date: datetime = Field(..., description="到期日期")
    status: FeeStatusEnum = Field(..., description="费用状态")
    payment_time: Optional[datetime] = Field(None, description="支付时间")
    create_time: Optional[datetime] = Field(None, description="创建时间")
    update_time: Optional[datetime] = Field(None, description="更新时间")

# 费用信息创建请求
class CreateFeeInfoRequest(BaseModel):
    contract_id: str = Field(..., description="合同ID")
    land_id: str = Field(..., description="土地ID")
    user_id: str = Field(..., description="用户ID")
    fee_type: FeeTypeEnum = Field(..., description="费用类型")
    amount: float = Field(..., description="费用金额")
    due_date: datetime = Field(..., description="到期日期")

# 费用信息更新请求
class UpdateFeeInfoRequest(BaseModel):
    fee_type: Optional[FeeTypeEnum] = Field(None, description="费用类型")
    amount: Optional[float] = Field(None, description="费用金额")
    due_date: Optional[datetime] = Field(None, description="到期日期")
    status: Optional[FeeStatusEnum] = Field(None, description="费用状态")

# 核减信息模型
class ReductionInfo(BaseModel):
    id: str = Field(..., description="核减ID")
    fee_id: str = Field(..., description="费用ID")
    user_id: str = Field(..., description="用户ID")
    reduction_amount: float = Field(..., description="核减金额")
    reduction_reason: str = Field(..., description="核减原因")
    application_time: datetime = Field(..., description="申请时间")
    status: ReductionStatusEnum = Field(..., description="审核状态")
    review_time: Optional[datetime] = Field(None, description="审核时间")
    review_remark: Optional[str] = Field(None, description="审核备注")

# 核减信息创建请求
class CreateReductionInfoRequest(BaseModel):
    fee_id: str = Field(..., description="费用ID")
    reduction_amount: float = Field(..., description="核减金额")
    reduction_reason: str = Field(..., description="核减原因")

# 核减信息更新请求
class UpdateReductionInfoRequest(BaseModel):
    reduction_amount: Optional[float] = Field(None, description="核减金额")
    reduction_reason: Optional[str] = Field(None, description="核减原因")
    status: Optional[ReductionStatusEnum] = Field(None, description="审核状态")

# 核减信息审核请求
class ReductionReviewRequest(BaseModel):
    reduction_id: str = Field(..., description="核减ID")
    status: ReductionStatusEnum = Field(..., description="审核状态")
    remark: Optional[str] = Field(None, description="审核备注")

# 费用信息查询请求
class FeeQueryRequest(BaseModel):
    user_id: Optional[str] = Field(None, description="用户ID")
    land_id: Optional[str] = Field(None, description="土地ID")
    contract_id: Optional[str] = Field(None, description="合同ID")
    fee_type: Optional[FeeTypeEnum] = Field(None, description="费用类型")
    status: Optional[FeeStatusEnum] = Field(None, description="费用状态")
    start_date: Optional[datetime] = Field(None, description="开始日期")
    end_date: Optional[datetime] = Field(None, description="结束日期")
    page: int = Field(..., description="页码", ge=1)
    page_size: int = Field(..., description="每页数量", ge=1, le=100)

# 费用明细查询请求
class FeeDetailQueryRequest(BaseModel):
    fee_id: Optional[str] = Field(None, description="费用ID")
    user_id: Optional[str] = Field(None, description="用户ID")
    start_date: Optional[datetime] = Field(None, description="开始日期")
    end_date: Optional[datetime] = Field(None, description="结束日期")
    transaction_type: Optional[str] = Field(None, description="交易类型", enum=["支付", "核减", "其他"])
    page: int = Field(..., description="页码", ge=1)
    page_size: int = Field(..., description="每页数量", ge=1, le=100)

# 费用支付请求
class FeePaymentRequest(BaseModel):
    fee_id: str = Field(..., description="费用ID")
    amount: float = Field(..., description="支付金额")
    payment_method: str = Field(..., description="支付方式")
    transaction_id: Optional[str] = Field(None, description="交易流水号")

# 费用支付记录模型
class PaymentRecord(BaseModel):
    id: str = Field(..., description="支付记录ID")
    fee_id: str = Field(..., description="费用ID")
    amount: float = Field(..., description="支付金额")
    payment_method: str = Field(..., description="支付方式")
    transaction_id: Optional[str] = Field(None, description="交易流水号")
    payment_time: datetime = Field(..., description="支付时间")
    status: PaymentStatusEnum = Field(..., description="支付状态")

# 支付记录创建请求
class CreatePaymentRecordRequest(BaseModel):
    fee_id: str = Field(..., description="费用ID")
    amount: float = Field(..., description="支付金额")
    payment_method: str = Field(..., description="支付方式")
    transaction_id: Optional[str] = Field(None, description="交易流水号")

# 支付记录更新请求
class UpdatePaymentRecordRequest(BaseModel):
    amount: Optional[float] = Field(None, description="支付金额")
    payment_method: Optional[str] = Field(None, description="支付方式")
    transaction_id: Optional[str] = Field(None, description="交易流水号")
    status: Optional[PaymentStatusEnum] = Field(None, description="支付状态")

# 费用逾期通知模型
class FeeOverdueNotice(BaseModel):
    id: str = Field(..., description="通知ID")
    fee_id: str = Field(..., description="费用ID")
    user_id: str = Field(..., description="用户ID")
    notice_type: str = Field(..., description="通知类型", enum=["短信", "邮件", "站内信"])
    content: str = Field(..., description="通知内容")
    send_time: Optional[datetime] = Field(None, description="发送时间")
    status: str = Field(..., description="通知状态", enum=["已发送", "发送失败", "待发送"])

# 支付记录查询请求
class PaymentRecordQueryRequest(BaseModel):
    fee_ids: Optional[List[str]] = Field(None, description="费用ID列表")
    payment_methods: Optional[List[str]] = Field(None, description="支付方式列表")
    payment_statuses: Optional[List[PaymentStatusEnum]] = Field(None, description="支付状态列表")
    transaction_ids: Optional[List[str]] = Field(None, description="交易流水号列表")
    payment_date_from: Optional[datetime] = Field(None, description="支付开始日期")
    payment_date_to: Optional[datetime] = Field(None, description="支付结束日期")
    amount_from: Optional[float] = Field(None, description="金额下限")
    amount_to: Optional[float] = Field(None, description="金额上限")
    sort_by: Optional[str] = Field(None, description="排序字段")
    sort_descending: bool = Field(False, description="是否降序排序")
    page: Optional[int] = Field(None, description="页码")
    page_size: Optional[int] = Field(None, description="每页数量")