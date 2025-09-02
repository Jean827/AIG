# 融资与确权管理模块模型定义
from datetime import datetime
from typing import List, Optional, Dict
from pydantic import BaseModel, Field

# 枚举定义
class DigitizationStatusEnum(str):
    NOT_DIGITIZED = "未数字化"
    DIGITIZING = "数字化中"
    DIGITIZED = "已数字化"

class ProjectStatusEnum(str):
    PENDING_APPROVAL = "待审批"
    UNDER_REVIEW = "审批中"
    APPROVED = "已批准"
    DISBURSED = "已放款"
    REPAID = "已还款"
    OVERDUE = "已逾期"
    DEFAULTED = "已违约"

class CollateralTypeEnum(str):
    LAND_USE_RIGHT = "土地使用权"
    OTHER = "其他"

class NodeStatusEnum(str):
    PENDING = "待处理"
    IN_PROGRESS = "处理中"
    COMPLETED = "已完成"
    OVERDUE = "已逾期"

class RecordTypeEnum(str):
    DISBURSEMENT = "放款"
    REPAYMENT = "还款"
    INTEREST_SETTLEMENT = "利息结算"
    EXPENSE = "费用支出"
    OTHER = "其他"

class TaskTypeEnum(str):
    LAND_RIGHT_CONFIRMATION = "土地确权"
    CERTIFICATE_HANDLING = "权证办理"
    OTHER = "其他"

class TaskStatusEnum(str):
    PENDING_START = "待开始"
    IN_PROGRESS = "进行中"
    COMPLETED = "已完成"
    OVERDUE = "已逾期"

class CertificateTypeEnum(str):
    LAND_USE_RIGHT_CERT = "土地使用权证"
    HOUSE_PROPERTY_CERT = "房产证"
    OTHER = "其他"

class CertificateStatusEnum(str):
    VALID = "有效"
    EXPIRED = "已过期"
    CANCELLED = "已注销"

class AlertTypeEnum(str):
    DUE_REMINDER = "到期提醒"
    OVERDUE_REMINDER = "逾期提醒"
    RISK_ALERT = "风险预警"

class AlertLevelEnum(str):
    LOW = "低"
    MEDIUM = "中"
    HIGH = "高"

class AlertStatusEnum(str):
    PENDING = "待处理"
    PROCESSED = "已处理"

# 划拨土地信息模型 - 保持向后兼容
class AllocatedLand(BaseModel):
    id: str = Field(..., description="划拨土地ID")
    land_code: str = Field(..., description="土地编号")
    land_name: str = Field(..., description="土地名称")
    location: str = Field(..., description="地理位置")
    area: float = Field(..., description="面积")
    unit: str = Field(default="亩", description="面积单位")
    land_type: str = Field(..., description="土地类型")
    ownership_type: str = Field(..., description="权属类型")
    digitization_status: str = Field(..., description="数字化状态", enum=["未数字化", "数字化中", "已数字化"])
    gis_data: Optional[Dict] = Field(None, description="GIS数据")
    create_time: Optional[datetime] = Field(None, description="创建时间")
    update_time: Optional[datetime] = Field(None, description="更新时间")

# 划拨土地信息模型 - 路由和服务使用的名称
class AllocatedLandInfo(BaseModel):
    id: str = Field(..., description="划拨土地ID")
    land_code: str = Field(..., description="土地编号")
    land_name: str = Field(..., description="土地名称")
    location: str = Field(..., description="地理位置")
    area: float = Field(..., description="面积")
    unit: str = Field(default="亩", description="面积单位")
    land_type: str = Field(..., description="土地类型")
    ownership_type: str = Field(..., description="权属类型")
    digitization_status: str = Field(..., description="数字化状态", enum=["未数字化", "数字化中", "已数字化"])
    gis_data: Optional[Dict] = Field(None, description="GIS数据")
    create_time: Optional[datetime] = Field(None, description="创建时间")
    update_time: Optional[datetime] = Field(None, description="更新时间")

# 划拨土地创建请求 - 保持向后兼容
class CreateAllocatedLandRequest(BaseModel):
    land_code: str = Field(..., description="土地编号")
    land_name: str = Field(..., description="土地名称")
    location: str = Field(..., description="地理位置")
    area: float = Field(..., description="面积")
    unit: str = Field(default="亩", description="面积单位")
    land_type: str = Field(..., description="土地类型")
    ownership_type: str = Field(..., description="权属类型")
    gis_data: Optional[Dict] = Field(None, description="GIS数据")

# 划拨土地创建请求 - 路由和服务使用的名称
class CreateAllocatedLandInfoRequest(BaseModel):
    land_code: str = Field(..., description="土地编号")
    land_name: str = Field(..., description="土地名称")
    location: str = Field(..., description="地理位置")
    area: float = Field(..., description="面积")
    unit: str = Field(default="亩", description="面积单位")
    land_type: str = Field(..., description="土地类型")
    ownership_type: str = Field(..., description="权属类型")
    gis_data: Optional[Dict] = Field(None, description="GIS数据")

# 划拨土地更新请求 - 保持向后兼容
class UpdateAllocatedLandRequest(BaseModel):
    land_code: Optional[str] = Field(None, description="土地编号")
    land_name: Optional[str] = Field(None, description="土地名称")
    location: Optional[str] = Field(None, description="地理位置")
    area: Optional[float] = Field(None, description="面积")
    unit: Optional[str] = Field(None, description="面积单位")
    land_type: Optional[str] = Field(None, description="土地类型")
    ownership_type: Optional[str] = Field(None, description="权属类型")
    digitization_status: Optional[str] = Field(None, description="数字化状态", enum=["未数字化", "数字化中", "已数字化"])
    gis_data: Optional[Dict] = Field(None, description="GIS数据")

# 划拨土地更新请求 - 路由和服务使用的名称
class UpdateAllocatedLandInfoRequest(BaseModel):
    land_code: Optional[str] = Field(None, description="土地编号")
    land_name: Optional[str] = Field(None, description="土地名称")
    location: Optional[str] = Field(None, description="地理位置")
    area: Optional[float] = Field(None, description="面积")
    unit: Optional[str] = Field(None, description="面积单位")
    land_type: Optional[str] = Field(None, description="土地类型")
    ownership_type: Optional[str] = Field(None, description="权属类型")
    digitization_status: Optional[str] = Field(None, description="数字化状态", enum=["未数字化", "数字化中", "已数字化"])
    gis_data: Optional[Dict] = Field(None, description="GIS数据")

# 抵押融资项目模型
class MortgageFinancingProject(BaseModel):
    id: str = Field(..., description="项目ID")
    project_name: str = Field(..., description="项目名称")
    project_code: str = Field(..., description="项目编号")
    borrower_id: str = Field(..., description="借款人ID")
    borrower_name: str = Field(..., description="借款人名称")
    loan_amount: float = Field(..., description="贷款金额")
    loan_term: int = Field(..., description="贷款期限")  # 单位：月
    interest_rate: float = Field(..., description="贷款利率")
    collateral_type: str = Field(..., description="抵押物类型", enum=["土地使用权", "其他"])
    collateral_value: float = Field(..., description="抵押物价值")
    project_status: str = Field(..., description="项目状态", enum=["待审批", "审批中", "已批准", "已放款", "已还款", "已逾期", "已违约"])
    apply_time: datetime = Field(..., description="申请时间")
    approval_time: Optional[datetime] = Field(None, description="批准时间")
    loan_time: Optional[datetime] = Field(None, description="放款时间")
    repayment_time: Optional[datetime] = Field(None, description="还款时间")
    create_time: Optional[datetime] = Field(None, description="创建时间")
    update_time: Optional[datetime] = Field(None, description="更新时间")

# 抵押融资项目创建请求
class CreateMortgageFinancingProjectRequest(BaseModel):
    project_name: str = Field(..., description="项目名称")
    project_code: str = Field(..., description="项目编号")
    borrower_id: str = Field(..., description="借款人ID")
    borrower_name: str = Field(..., description="借款人名称")
    loan_amount: float = Field(..., description="贷款金额")
    loan_term: int = Field(..., description="贷款期限")
    interest_rate: float = Field(..., description="贷款利率")
    collateral_type: str = Field(..., description="抵押物类型", enum=["土地使用权", "其他"])
    collateral_value: float = Field(..., description="抵押物价值")

# 抵押融资项目更新请求
class UpdateMortgageFinancingProjectRequest(BaseModel):
    project_name: Optional[str] = Field(None, description="项目名称")
    project_code: Optional[str] = Field(None, description="项目编号")
    borrower_id: Optional[str] = Field(None, description="借款人ID")
    borrower_name: Optional[str] = Field(None, description="借款人名称")
    loan_amount: Optional[float] = Field(None, description="贷款金额")
    loan_term: Optional[int] = Field(None, description="贷款期限")
    interest_rate: Optional[float] = Field(None, description="贷款利率")
    collateral_type: Optional[str] = Field(None, description="抵押物类型", enum=["土地使用权", "其他"])
    collateral_value: Optional[float] = Field(None, description="抵押物价值")
    project_status: Optional[str] = Field(None, description="项目状态", enum=["待审批", "审批中", "已批准", "已放款", "已还款", "已逾期", "已违约"])
    approval_time: Optional[datetime] = Field(None, description="批准时间")
    loan_time: Optional[datetime] = Field(None, description="放款时间")
    repayment_time: Optional[datetime] = Field(None, description="还款时间")

# 融资项目节点追踪模型
class FinancingProjectNode(BaseModel):
    id: str = Field(..., description="节点ID")
    project_id: str = Field(..., description="项目ID")
    node_name: str = Field(..., description="节点名称")
    node_type: str = Field(..., description="节点类型")
    expected_time: datetime = Field(..., description="预计时间")
    actual_time: Optional[datetime] = Field(None, description="实际时间")
    status: str = Field(..., description="节点状态", enum=["待处理", "处理中", "已完成", "已逾期"])
    handler_id: Optional[str] = Field(None, description="处理人ID")
    remark: Optional[str] = Field(None, description="备注")

# 融资项目节点创建请求
class CreateFinancingProjectNodeRequest(BaseModel):
    project_id: str = Field(..., description="项目ID")
    node_name: str = Field(..., description="节点名称")
    node_type: str = Field(..., description="节点类型")
    expected_time: datetime = Field(..., description="预计时间")
    handler_id: Optional[str] = Field(None, description="处理人ID")
    remark: Optional[str] = Field(None, description="备注")

# 融资项目节点更新请求
class UpdateFinancingProjectNodeRequest(BaseModel):
    node_name: Optional[str] = Field(None, description="节点名称")
    node_type: Optional[str] = Field(None, description="节点类型")
    expected_time: Optional[datetime] = Field(None, description="预计时间")
    actual_time: Optional[datetime] = Field(None, description="实际时间")
    status: Optional[str] = Field(None, description="节点状态", enum=["待处理", "处理中", "已完成", "已逾期"])
    handler_id: Optional[str] = Field(None, description="处理人ID")
    remark: Optional[str] = Field(None, description="备注")

# 融资项目台账模型
class FinancingProjectLedger(BaseModel):
    id: str = Field(..., description="台账ID")
    project_id: str = Field(..., description="项目ID")
    record_type: str = Field(..., description="记录类型", enum=["放款", "还款", "利息结算", "费用支出", "其他"])
    amount: float = Field(..., description="金额")
    record_time: datetime = Field(..., description="记录时间")
    description: str = Field(..., description="描述")
    creator_id: str = Field(..., description="创建人ID")
    create_time: Optional[datetime] = Field(None, description="创建时间")

# 融资项目台账创建请求
class CreateFinancingProjectLedgerRequest(BaseModel):
    project_id: str = Field(..., description="项目ID")
    record_type: str = Field(..., description="记录类型", enum=["放款", "还款", "利息结算", "费用支出", "其他"])
    amount: float = Field(..., description="金额")
    record_time: datetime = Field(..., description="记录时间")
    description: str = Field(..., description="描述")
    creator_id: str = Field(..., description="创建人ID")

# 融资项目台账更新请求
class UpdateFinancingProjectLedgerRequest(BaseModel):
    record_type: Optional[str] = Field(None, description="记录类型", enum=["放款", "还款", "利息结算", "费用支出", "其他"])
    amount: Optional[float] = Field(None, description="金额")
    record_time: Optional[datetime] = Field(None, description="记录时间")
    description: Optional[str] = Field(None, description="描述")

# 投后确权任务模型
class PostInvestmentRightTask(BaseModel):
    id: str = Field(..., description="任务ID")
    project_id: str = Field(..., description="项目ID")
    task_name: str = Field(..., description="任务名称")
    task_type: str = Field(..., description="任务类型", enum=["土地确权", "权证办理", "其他"])
    start_time: datetime = Field(..., description="开始时间")
    end_time: datetime = Field(..., description="结束时间")
    assignee_id: str = Field(..., description="任务执行人ID")
    progress: int = Field(..., description="进度", ge=0, le=100)
    status: str = Field(..., description="任务状态", enum=["待开始", "进行中", "已完成", "已逾期"])
    remark: Optional[str] = Field(None, description="备注")
    create_time: Optional[datetime] = Field(None, description="创建时间")
    update_time: Optional[datetime] = Field(None, description="更新时间")

# 投后确权任务创建请求
class CreatePostInvestmentRightTaskRequest(BaseModel):
    project_id: str = Field(..., description="项目ID")
    task_name: str = Field(..., description="任务名称")
    task_type: str = Field(..., description="任务类型", enum=["土地确权", "权证办理", "其他"])
    start_time: datetime = Field(..., description="开始时间")
    end_time: datetime = Field(..., description="结束时间")
    assignee_id: str = Field(..., description="任务执行人ID")
    remark: Optional[str] = Field(None, description="备注")

# 投后确权任务更新请求
class UpdatePostInvestmentRightTaskRequest(BaseModel):
    task_name: Optional[str] = Field(None, description="任务名称")
    task_type: Optional[str] = Field(None, description="任务类型", enum=["土地确权", "权证办理", "其他"])
    start_time: Optional[datetime] = Field(None, description="开始时间")
    end_time: Optional[datetime] = Field(None, description="结束时间")
    assignee_id: Optional[str] = Field(None, description="任务执行人ID")
    progress: Optional[int] = Field(None, description="进度", ge=0, le=100)
    status: Optional[str] = Field(None, description="任务状态", enum=["待开始", "进行中", "已完成", "已逾期"])
    remark: Optional[str] = Field(None, description="备注")

# 权证数字化模型
class DigitalCertificate(BaseModel):
    id: str = Field(..., description="权证ID")
    certificate_code: str = Field(..., description="权证编号")
    certificate_type: str = Field(..., description="权证类型", enum=["土地使用权证", "房产证", "其他"])
    owner_id: str = Field(..., description="所有权人ID")
    owner_name: str = Field(..., description="所有权人名称")
    issue_date: datetime = Field(..., description="发证日期")
    expiry_date: datetime = Field(..., description="到期日期")
    digital_file_path: str = Field(..., description="数字化文件路径")
    status: str = Field(..., description="状态", enum=["有效", "已过期", "已注销"])
    create_time: Optional[datetime] = Field(None, description="创建时间")
    update_time: Optional[datetime] = Field(None, description="更新时间")

# 权证数字化创建请求
class CreateDigitalCertificateRequest(BaseModel):
    certificate_code: str = Field(..., description="权证编号")
    certificate_type: str = Field(..., description="权证类型", enum=["土地使用权证", "房产证", "其他"])
    owner_id: str = Field(..., description="所有权人ID")
    owner_name: str = Field(..., description="所有权人名称")
    issue_date: datetime = Field(..., description="发证日期")
    expiry_date: datetime = Field(..., description="到期日期")
    digital_file_path: str = Field(..., description="数字化文件路径")

# 权证数字化更新请求
class UpdateDigitalCertificateRequest(BaseModel):
    certificate_code: Optional[str] = Field(None, description="权证编号")
    certificate_type: Optional[str] = Field(None, description="权证类型", enum=["土地使用权证", "房产证", "其他"])
    owner_id: Optional[str] = Field(None, description="所有权人ID")
    owner_name: Optional[str] = Field(None, description="所有权人名称")
    issue_date: Optional[datetime] = Field(None, description="发证日期")
    expiry_date: Optional[datetime] = Field(None, description="到期日期")
    digital_file_path: Optional[str] = Field(None, description="数字化文件路径")
    status: Optional[str] = Field(None, description="状态", enum=["有效", "已过期", "已注销"])

# 资金监管模型
class FundSupervision(BaseModel):
    id: str = Field(..., description="监管ID")
    project_id: str = Field(..., description="项目ID")
    transaction_type: str = Field(..., description="交易类型")
    transaction_amount: float = Field(..., description="交易金额")
    transaction_time: datetime = Field(..., description="交易时间")
    transaction_account: str = Field(..., description="交易账户")
    description: str = Field(..., description="交易描述")
    is_abnormal: bool = Field(..., description="是否异常")
    abnormal_reason: Optional[str] = Field(None, description="异常原因")
    create_time: Optional[datetime] = Field(None, description="创建时间")

# 资金监管创建请求
class CreateFundSupervisionRequest(BaseModel):
    project_id: str = Field(..., description="项目ID")
    transaction_type: str = Field(..., description="交易类型")
    transaction_amount: float = Field(..., description="交易金额")
    transaction_time: datetime = Field(..., description="交易时间")
    transaction_account: str = Field(..., description="交易账户")
    description: str = Field(..., description="交易描述")
    is_abnormal: bool = Field(..., description="是否异常")
    abnormal_reason: Optional[str] = Field(None, description="异常原因")

# 资金监管更新请求
class UpdateFundSupervisionRequest(BaseModel):
    project_id: Optional[str] = Field(None, description="项目ID")
    transaction_type: Optional[str] = Field(None, description="交易类型")
    transaction_amount: Optional[float] = Field(None, description="交易金额")
    transaction_time: Optional[datetime] = Field(None, description="交易时间")
    transaction_account: Optional[str] = Field(None, description="交易账户")
    description: Optional[str] = Field(None, description="交易描述")
    is_abnormal: Optional[bool] = Field(None, description="是否异常")
    abnormal_reason: Optional[str] = Field(None, description="异常原因")

# 还款预警模型
class RepaymentAlert(BaseModel):
    id: str = Field(..., description="预警ID")
    project_id: str = Field(..., description="项目ID")
    alert_type: str = Field(..., description="预警类型", enum=["到期提醒", "逾期提醒", "风险预警"])
    alert_level: str = Field(..., description="预警级别", enum=["低", "中", "高"])
    content: str = Field(..., description="预警内容")
    alert_time: datetime = Field(..., description="预警时间")
    status: str = Field(..., description="处理状态", enum=["待处理", "已处理"])
    handler_id: Optional[str] = Field(None, description="处理人ID")
    handle_time: Optional[datetime] = Field(None, description="处理时间")

# 还款预警创建请求
class CreateRepaymentAlertRequest(BaseModel):
    project_id: str = Field(..., description="项目ID")
    alert_type: str = Field(..., description="预警类型", enum=["到期提醒", "逾期提醒", "风险预警"])
    alert_level: str = Field(..., description="预警级别", enum=["低", "中", "高"])
    content: str = Field(..., description="预警内容")

# 还款预警更新请求
class UpdateRepaymentAlertRequest(BaseModel):
    alert_type: Optional[str] = Field(None, description="预警类型", enum=["到期提醒", "逾期提醒", "风险预警"])
    alert_level: Optional[str] = Field(None, description="预警级别", enum=["低", "中", "高"])
    content: Optional[str] = Field(None, description="预警内容")
    status: Optional[str] = Field(None, description="处理状态", enum=["待处理", "已处理"])
    handler_id: Optional[str] = Field(None, description="处理人ID")
    handle_time: Optional[datetime] = Field(None, description="处理时间")

# 融资项目查询请求
class FinancingProjectQueryRequest(BaseModel):
    project_name: Optional[str] = Field(None, description="项目名称")
    project_code: Optional[str] = Field(None, description="项目编号")
    borrower_id: Optional[str] = Field(None, description="借款人ID")
    project_status: Optional[str] = Field(None, description="项目状态")
    start_date: Optional[datetime] = Field(None, description="开始日期")
    end_date: Optional[datetime] = Field(None, description="结束日期")
    page: int = Field(1, description="页码")
    page_size: int = Field(10, description="每页大小")