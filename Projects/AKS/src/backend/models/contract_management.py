# 承包合同管理模块模型定义
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from models.fee_management import FeeTypeEnum, PaymentStatusEnum, FeeStatusEnum

# 承包合同模型
class Contract(BaseModel):
    id: str = Field(..., description="合同ID")
    contract_code: str = Field(..., description="合同编号")
    land_id: str = Field(..., description="土地ID")
    bidder_id: str = Field(..., description="承包户ID")
    contractor_name: str = Field(..., description="承包方名称")
    start_date: datetime = Field(..., description="合同开始日期")
    end_date: datetime = Field(..., description="合同结束日期")
    total_amount: float = Field(..., description="合同总金额")
    payment_term: str = Field(..., description="付款期限")
    contract_status: str = Field(..., description="合同状态", enum=["待审核", "已生效", "已作废", "已过期", "已解除"])
    review_time: Optional[datetime] = Field(None, description="审核时间")
    review_remark: Optional[str] = Field(None, description="审核备注")
    create_time: Optional[datetime] = Field(None, description="创建时间")
    update_time: Optional[datetime] = Field(None, description="更新时间")

# 枚举定义
class ContractStatusEnum(str):
    PENDING = "待审核"
    EFFECTIVE = "已生效"
    VOID = "已作废"
    EXPIRED = "已过期"
    TERMINATED = "已解除"

class ReviewStatusEnum(str):
    APPROVED = "已生效"
    REJECTED = "已拒绝"

# 承包合同创建请求
class CreateContractRequest(BaseModel):
    contract_code: str = Field(..., description="合同编号")
    land_id: str = Field(..., description="土地ID")
    bidder_id: str = Field(..., description="承包户ID")
    contractor_name: str = Field(..., description="承包方名称")
    start_date: datetime = Field(..., description="合同开始日期")
    end_date: datetime = Field(..., description="合同结束日期")
    total_amount: float = Field(..., description="合同总金额")
    payment_term: str = Field(..., description="付款期限")

# 承包合同更新请求
class UpdateContractRequest(BaseModel):
    contract_code: Optional[str] = Field(None, description="合同编号")
    land_id: Optional[str] = Field(None, description="土地ID")
    bidder_id: Optional[str] = Field(None, description="承包户ID")
    contractor_name: Optional[str] = Field(None, description="承包方名称")
    start_date: Optional[datetime] = Field(None, description="合同开始日期")
    end_date: Optional[datetime] = Field(None, description="合同结束日期")
    total_amount: Optional[float] = Field(None, description="合同总金额")
    payment_term: Optional[str] = Field(None, description="付款期限")
    contract_status: Optional[str] = Field(None, description="合同状态", enum=["待审核", "已生效", "已作废", "已过期", "已解除"])

# 承包合同审核请求
class ContractReviewRequest(BaseModel):
    contract_id: str = Field(..., description="合同ID")
    status: str = Field(..., description="审核状态", enum=["已生效", "已拒绝"])
    remark: Optional[str] = Field(None, description="审核备注")

# 承包合同作废请求
class ContractCancelRequest(BaseModel):
    contract_id: str = Field(..., description="合同ID")
    reason: str = Field(..., description="作废原因")

# 承包费用生成模型
class ContractFee(BaseModel):
    id: str = Field(..., description="费用ID")
    contract_id: str = Field(..., description="合同ID")
    fee_type: FeeTypeEnum = Field(..., description="费用类型")
    amount: float = Field(..., description="费用金额")
    due_date: datetime = Field(..., description="到期日期")
    status: FeeStatusEnum = Field(..., description="费用状态")
    payment_time: Optional[datetime] = Field(None, description="支付时间")
    create_time: Optional[datetime] = Field(None, description="创建时间")
    update_time: Optional[datetime] = Field(None, description="更新时间")

# 承包费用生成请求
class CreateContractFeeRequest(BaseModel):
    contract_id: str = Field(..., description="合同ID")
    fee_type: FeeTypeEnum = Field(..., description="费用类型")
    amount: float = Field(..., description="费用金额")
    due_date: datetime = Field(..., description="到期日期")

# 承包费用更新请求
class UpdateContractFeeRequest(BaseModel):
    fee_type: Optional[FeeTypeEnum] = Field(None, description="费用类型")
    amount: Optional[float] = Field(None, description="费用金额")
    due_date: Optional[datetime] = Field(None, description="到期日期")
    status: Optional[FeeStatusEnum] = Field(None, description="费用状态")

# 承包明细查询请求
class ContractQueryRequest(BaseModel):
    contract_id: Optional[str] = Field(None, description="合同ID")
    land_id: Optional[str] = Field(None, description="土地ID")
    bidder_id: Optional[str] = Field(None, description="承包户ID")
    start_date: Optional[datetime] = Field(None, description="开始日期")
    end_date: Optional[datetime] = Field(None, description="结束日期")
    status: Optional[str] = Field(None, description="合同状态")
    page: int = Field(..., description="页码", ge=1)
    page_size: int = Field(..., description="每页数量", ge=1, le=100)

# 合同附件模型
class ContractAttachment(BaseModel):
    id: str = Field(..., description="附件ID")
    contract_id: str = Field(..., description="合同ID")
    file_name: str = Field(..., description="文件名称")
    file_path: str = Field(..., description="文件路径")
    file_size: int = Field(..., description="文件大小")
    file_type: str = Field(..., description="文件类型")
    upload_time: Optional[datetime] = Field(None, description="上传时间")

# 合同附件上传请求
class ContractAttachmentUploadRequest(BaseModel):
    contract_id: str = Field(..., description="合同ID")
    file_name: str = Field(..., description="文件名称")

# 合同附件创建请求
class CreateContractAttachmentRequest(BaseModel):
    contract_id: str = Field(..., description="合同ID")
    file_name: str = Field(..., description="文件名称")
    file_path: str = Field(..., description="文件路径")
    file_size: int = Field(..., description="文件大小")
    file_type: str = Field(..., description="文件类型")

# 合同附件更新请求
class UpdateContractAttachmentRequest(BaseModel):
    file_name: Optional[str] = Field(None, description="文件名称")
    file_path: Optional[str] = Field(None, description="文件路径")
    file_size: Optional[int] = Field(None, description="文件大小")
    file_type: Optional[str] = Field(None, description="文件类型")
    file_path: str = Field(..., description="文件路径")
    file_size: int = Field(..., description="文件大小")
    file_type: str = Field(..., description="文件类型")