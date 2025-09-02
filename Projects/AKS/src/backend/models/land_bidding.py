# 土地竞拍管理模块模型定义
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

# 竞拍用户注册信息模型
class BidderRegistration(BaseModel):
    id: str = Field(..., description="注册ID")
    user_id: str = Field(..., description="用户ID")
    user_type: str = Field(..., description="用户类型", enum=["承包户", "管理员"])
    real_name: str = Field(..., description="真实姓名")
    id_card_number: str = Field(..., description="身份证号码")
    phone_number: str = Field(..., description="手机号码")
    address: str = Field(..., description="地址")
    business_license: Optional[str] = Field(None, description="营业执照")
    status: str = Field(..., description="审核状态", enum=["待审核", "已通过", "已拒绝"])
    review_time: Optional[datetime] = Field(None, description="审核时间")
    review_remark: Optional[str] = Field(None, description="审核备注")
    create_time: Optional[datetime] = Field(None, description="创建时间")

# 竞拍用户注册创建请求
class CreateBidderRegistrationRequest(BaseModel):
    user_type: str = Field(..., description="用户类型", enum=["承包户", "管理员"])
    real_name: str = Field(..., description="真实姓名")
    id_card_number: str = Field(..., description="身份证号码")
    phone_number: str = Field(..., description="手机号码")
    address: str = Field(..., description="地址")
    business_license: Optional[str] = Field(None, description="营业执照")

# 竞拍用户注册更新请求
class UpdateBidderRegistrationRequest(BaseModel):
    user_type: Optional[str] = Field(None, description="用户类型", enum=["承包户", "管理员"])
    real_name: Optional[str] = Field(None, description="真实姓名")
    id_card_number: Optional[str] = Field(None, description="身份证号码")
    phone_number: Optional[str] = Field(None, description="手机号码")
    address: Optional[str] = Field(None, description="地址")
    business_license: Optional[str] = Field(None, description="营业执照")

# 竞拍信息模型
class BiddingInfo(BaseModel):
    id: str = Field(..., description="竞拍ID")
    land_id: str = Field(..., description="土地ID")
    title: str = Field(..., description="竞拍标题")
    description: str = Field(..., description="竞拍描述")
    starting_price: float = Field(..., description="起拍价")
    increment: float = Field(..., description="加价幅度")
    deposit_amount: float = Field(..., description="保证金金额")
    start_time: datetime = Field(..., description="开始时间")
    end_time: datetime = Field(..., description="结束时间")
    status: str = Field(..., description="竞拍状态", enum=["待开始", "进行中", "已结束", "已取消"])
    winner_id: Optional[str] = Field(None, description="中标用户ID")
    final_price: Optional[float] = Field(None, description="最终成交价格")
    create_time: Optional[datetime] = Field(None, description="创建时间")
    update_time: Optional[datetime] = Field(None, description="更新时间")

# 竞拍信息创建请求
class BiddingInfoCreateRequest(BaseModel):
    land_id: str = Field(..., description="土地ID")
    title: str = Field(..., description="竞拍标题")
    description: str = Field(..., description="竞拍描述")
    starting_price: float = Field(..., description="起拍价")
    increment: float = Field(..., description="加价幅度")
    deposit_amount: float = Field(..., description="保证金金额")
    start_time: datetime = Field(..., description="开始时间")
    end_time: datetime = Field(..., description="结束时间")

# 竞拍信息更新请求
class BiddingInfoUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, description="竞拍标题")
    description: Optional[str] = Field(None, description="竞拍描述")
    starting_price: Optional[float] = Field(None, description="起拍价")
    increment: Optional[float] = Field(None, description="加价幅度")
    deposit_amount: Optional[float] = Field(None, description="保证金金额")
    start_time: Optional[datetime] = Field(None, description="开始时间")
    end_time: Optional[datetime] = Field(None, description="结束时间")
    status: Optional[str] = Field(None, description="竞拍状态", enum=["待开始", "进行中", "已结束", "已取消"])

# 保证金业务模型
class DepositTransaction(BaseModel):
    id: str = Field(..., description="保证金交易ID")
    user_id: str = Field(..., description="用户ID")
    bidding_id: str = Field(..., description="竞拍ID")
    amount: float = Field(..., description="保证金金额")
    transaction_type: str = Field(..., description="交易类型", enum=["支付", "退还", "扣除"])
    status: str = Field(..., description="交易状态", enum=["待支付", "已支付", "已退还", "已扣除"])
    transaction_time: Optional[datetime] = Field(None, description="交易时间")
    remark: Optional[str] = Field(None, description="备注")

# 竞拍出价模型
class BidRecord(BaseModel):
    id: str = Field(..., description="出价记录ID")
    bidding_id: str = Field(..., description="竞拍ID")
    user_id: str = Field(..., description="出价用户ID")
    bid_price: float = Field(..., description="出价金额")
    bid_time: datetime = Field(..., description="出价时间")
    status: str = Field(..., description="出价状态", enum=["有效", "无效", "中标"])

# 竞拍出价请求（保留旧名称以保持向后兼容）
class BidRequest(BaseModel):
    bidding_id: str = Field(..., description="竞拍ID")
    bid_price: float = Field(..., description="出价金额")

# 竞拍出价创建请求（符合命名规范）
class CreateBidRequest(BaseModel):
    bidding_id: str = Field(..., description="竞拍ID")
    bid_price: float = Field(..., description="出价金额")

# 中标缴费业务模型
class WinningPayment(BaseModel):
    id: str = Field(..., description="缴费ID")
    bidding_id: str = Field(..., description="竞拍ID")
    user_id: str = Field(..., description="中标用户ID")
    total_amount: float = Field(..., description="总金额")
    paid_amount: float = Field(..., description="已支付金额")
    payment_status: str = Field(..., description="支付状态", enum=["待支付", "部分支付", "已支付", "已逾期"])
    due_date: datetime = Field(..., description="到期日期")
    penalty_amount: float = Field(..., description="滞纳金金额")
    create_time: Optional[datetime] = Field(None, description="创建时间")
    update_time: Optional[datetime] = Field(None, description="更新时间")

# 中标缴费请求（保留旧名称以保持向后兼容）
class WinningPaymentRequest(BaseModel):
    bidding_id: str = Field(..., description="竞拍ID")
    amount: float = Field(..., description="支付金额")
    payment_method: str = Field(..., description="支付方式")

# 中标缴费创建请求（符合命名规范）
class CreateWinningPaymentRequest(BaseModel):
    bidding_id: str = Field(..., description="竞拍ID")
    amount: float = Field(..., description="支付金额")
    payment_method: str = Field(..., description="支付方式")

# 竞拍审核请求（保留旧名称以保持向后兼容）
class BiddingReviewRequest(BaseModel):
    registration_id: str = Field(..., description="注册ID")
    status: str = Field(..., description="审核状态", enum=["已通过", "已拒绝"])
    remark: Optional[str] = Field(None, description="审核备注")

# 竞拍审核创建请求（符合命名规范）
class CreateBiddingReviewRequest(BaseModel):
    registration_id: str = Field(..., description="注册ID")
    status: str = Field(..., description="审核状态", enum=["已通过", "已拒绝"])
    remark: Optional[str] = Field(None, description="审核备注")