# 土地竞价管理模块API路由
import sys
import os
from typing import List, Optional, Union
from enum import Enum
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime, timedelta
from pydantic import BaseModel, Field

# 导入服务和模型
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.land_bidding import (
    BidderRegistration, 
    BiddingInfo, 
    DepositTransaction, 
    BidRecord,
    WinningPayment,
    CreateBidderRegistrationRequest,
    UpdateBidderRegistrationRequest,
    BiddingInfoCreateRequest,
    BiddingInfoUpdateRequest,
    BidRequest,
    CreateBidRequest,
    WinningPaymentRequest,
    CreateWinningPaymentRequest,
    BiddingReviewRequest,
    CreateBiddingReviewRequest
)
from services.land_bidding_service import land_bidding_service, CreateDepositTransactionRequest

# 保证金交易更新请求（本地定义，因为models中没有）
class UpdateDepositTransactionRequest(BaseModel):
    user_id: Optional[str] = Field(None, description="用户ID")
    bidding_id: Optional[str] = Field(None, description="竞拍ID")
    amount: Optional[float] = Field(None, description="保证金金额")
    transaction_type: Optional[str] = Field(None, description="交易类型", enum=["支付", "退还", "扣除"])
    status: Optional[str] = Field(None, description="交易状态", enum=["待支付", "已支付", "已退还", "已扣除"])
    transaction_time: Optional[datetime] = Field(None, description="交易时间")
    remark: Optional[str] = Field(None, description="备注")

# 竞价记录创建请求（本地定义，因为models中没有）
class CreateBidRecordRequest(BaseModel):
    bidding_id: str = Field(..., description="竞拍ID")
    bidder_id: str = Field(..., description="出价用户ID")
    bid_price: float = Field(..., description="出价金额")

# 竞价记录更新请求（本地定义，因为models中没有）
class UpdateBidRecordRequest(BaseModel):
    bidding_id: Optional[str] = Field(None, description="竞拍ID")
    bid_price: Optional[float] = Field(None, description="出价金额")
    status: Optional[str] = Field(None, description="出价状态", enum=["有效", "无效", "中标"])

# 成交支付更新请求（本地定义，因为models中没有）
class UpdateWinningPaymentRequest(BaseModel):
    user_id: Optional[str] = Field(None, description="中标用户ID")
    total_amount: Optional[float] = Field(None, description="总金额")
    paid_amount: Optional[float] = Field(None, description="已支付金额")
    payment_status: Optional[str] = Field(None, description="支付状态", enum=["待支付", "部分支付", "已支付", "已逾期"])
    due_date: Optional[datetime] = Field(None, description="到期日期")
    penalty_amount: Optional[float] = Field(None, description="滞纳金金额")

# 竞价评价更新请求（本地定义，因为models中没有）
class UpdateBiddingReviewRequest(BaseModel):
    registration_id: Optional[str] = Field(None, description="注册ID")
    status: Optional[str] = Field(None, description="审核状态", enum=["已通过", "已拒绝"])
    remark: Optional[str] = Field(None, description="审核备注")

# 竞价查询请求（本地定义，因为models中没有）
class BiddingQueryRequest(BaseModel):
    land_id: Optional[str] = Field(None, description="土地ID")
    title: Optional[str] = Field(None, description="竞拍标题")
    status: Optional[str] = Field(None, description="竞拍状态")
    start_time_from: Optional[datetime] = Field(None, description="开始时间范围起始")
    start_time_to: Optional[datetime] = Field(None, description="开始时间范围结束")
    end_time_from: Optional[datetime] = Field(None, description="结束时间范围起始")
    end_time_to: Optional[datetime] = Field(None, description="结束时间范围结束")

# 竞价状态枚举（本地定义，因为models中没有）
class BiddingStatusEnum(str, Enum):
    PENDING = "待开始"
    ACTIVE = "进行中"
    COMPLETED = "已完成"
    CANCELLED = "已取消"

# 支付状态枚举（本地定义，因为models中没有）
class PaymentStatusEnum(str, Enum):
    PENDING = "待支付"
    PARTIAL = "部分支付"
    PAID = "已支付"
    OVERDUE = "已逾期"

# 竞价评价模型（本地定义，因为models中没有）
class BiddingReview(BaseModel):
    id: str
    registration_id: str
    reviewer_id: str
    status: str
    remark: Optional[str]
    review_date: datetime

    class Config:
        orm_mode = True

# 创建路由实例
router = APIRouter(
    prefix="/api/land-bidding",
    tags=["Land Bidding Management"],
    responses={404: {"description": "Not found"}}
)


# 竞价人注册管理路由
@router.get("/bidders", response_model=List[BidderRegistration])
def get_bidders(
    name: Optional[str] = None,
    id_number: Optional[str] = None,
    phone: Optional[str] = None,
    status: Optional[str] = None
):
    """获取竞价人注册列表"""
    return land_bidding_service.get_bidders(name, id_number, phone, status)


@router.get("/bidders/{bidder_id}", response_model=BidderRegistration)
def get_bidder_by_id(bidder_id: str):
    """根据ID获取竞价人注册信息"""
    bidder = land_bidding_service.get_bidder_by_id(bidder_id)
    if not bidder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bidder with id {bidder_id} not found"
        )
    return bidder


@router.post("/bidders", response_model=BidderRegistration, status_code=status.HTTP_201_CREATED)
def create_bidder(request: CreateBidderRegistrationRequest):
    """创建竞价人注册信息"""
    bidder = land_bidding_service.create_bidder(request)
    if not bidder:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create bidder registration"
        )
    return bidder


@router.put("/bidders/{bidder_id}", response_model=BidderRegistration)
def update_bidder(bidder_id: str, request: UpdateBidderRegistrationRequest):
    """更新竞价人注册信息"""
    bidder = land_bidding_service.update_bidder(bidder_id, request)
    if not bidder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bidder with id {bidder_id} not found"
        )
    return bidder


@router.delete("/bidders/{bidder_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bidder(bidder_id: str):
    """删除竞价人注册信息"""
    success = land_bidding_service.delete_bidder(bidder_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete bidder with id {bidder_id} as they have active bids or deposits"
        )


# 竞价信息管理路由
@router.get("/biddings", response_model=List[BiddingInfo])
def get_biddings(
    land_id: Optional[str] = None,
    bidding_no: Optional[str] = None,
    status: Optional[str] = None,
    start_time_from: Optional[datetime] = None,
    start_time_to: Optional[datetime] = None
):
    """获取竞价信息列表"""
    return land_bidding_service.get_biddings(land_id, bidding_no, status, start_time_from, start_time_to)


@router.get("/biddings/{bidding_id}", response_model=BiddingInfo)
def get_bidding_by_id(bidding_id: str):
    """根据ID获取竞价信息"""
    bidding = land_bidding_service.get_bidding_by_id(bidding_id)
    if not bidding:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bidding with id {bidding_id} not found"
        )
    return bidding


@router.post("/biddings", response_model=BiddingInfo, status_code=status.HTTP_201_CREATED)
def create_bidding(request: BiddingInfoCreateRequest):
    """创建竞价信息"""
    bidding = land_bidding_service.create_bidding(request)
    if not bidding:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create bidding information"
        )
    return bidding


@router.put("/biddings/{bidding_id}", response_model=BiddingInfo)
def update_bidding(bidding_id: str, request: BiddingInfoUpdateRequest):
    """更新竞价信息"""
    bidding = land_bidding_service.update_bidding(bidding_id, request)
    if not bidding:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bidding with id {bidding_id} not found"
        )
    return bidding


@router.delete("/biddings/{bidding_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bidding(bidding_id: str):
    """删除竞价信息"""
    success = land_bidding_service.delete_bidding(bidding_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete bidding with id {bidding_id} as it has started or has active bids"
        )


# 竞价人资格审核路由
@router.post("/bidders/{bidder_id}/review")
def review_bidder(bidder_id: str, approved: bool, remark: Optional[str] = None):
    """审核竞价人资格"""
    success = land_bidding_service.review_bidder(bidder_id, approved, remark)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to review bidder with id {bidder_id}"
        )
    return {"message": "Bidder reviewed successfully"}


# 竞价保证金交易管理路由
@router.get("/deposits", response_model=List[DepositTransaction])
def get_deposits(
    bidder_id: Optional[str] = None,
    bidding_id: Optional[str] = None,
    transaction_no: Optional[str] = None,
    status: Optional[str] = None,
    transaction_date_from: Optional[datetime] = None,
    transaction_date_to: Optional[datetime] = None
):
    """获取保证金交易列表"""
    return land_bidding_service.get_deposits(bidder_id, bidding_id, transaction_no, status, transaction_date_from, transaction_date_to)


@router.get("/deposits/{deposit_id}", response_model=DepositTransaction)
def get_deposit_by_id(deposit_id: str):
    """根据ID获取保证金交易"""
    deposit = land_bidding_service.get_deposit_by_id(deposit_id)
    if not deposit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deposit with id {deposit_id} not found"
        )
    return deposit


@router.post("/deposits", response_model=DepositTransaction, status_code=status.HTTP_201_CREATED)
def create_deposit(request: CreateDepositTransactionRequest):
    """创建保证金交易"""
    deposit = land_bidding_service.create_deposit(request)
    if not deposit:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create deposit transaction"
        )
    return deposit


@router.put("/deposits/{deposit_id}", response_model=DepositTransaction)
def update_deposit(deposit_id: str, request: UpdateDepositTransactionRequest):
    """更新保证金交易"""
    deposit = land_bidding_service.update_deposit(deposit_id, request)
    if not deposit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deposit with id {deposit_id} not found"
        )
    return deposit


# 确认保证金支付路由
@router.post("/deposits/{deposit_id}/confirm")
def confirm_deposit_payment(deposit_id: str):
    """确认保证金支付"""
    success = land_bidding_service.confirm_deposit_payment(deposit_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to confirm deposit payment for id {deposit_id}"
        )
    return {"message": "Deposit payment confirmed successfully"}


# 竞价记录管理路由
@router.get("/bid-records", response_model=List[BidRecord])
def get_bid_records(
    bidding_id: Optional[str] = None,
    user_id: Optional[str] = None
):
    """获取竞价记录列表"""
    return land_bidding_service.get_bid_records(bidding_id, user_id)


@router.get("/bid-records/{bid_record_id}", response_model=BidRecord)
def get_bid_record_by_id(bid_record_id: str):
    """根据ID获取竞价记录"""
    bid_record = land_bidding_service.get_bid_record_by_id(bid_record_id)
    if not bid_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bid record with id {bid_record_id} not found"
        )
    return bid_record


@router.post("/bid-records", response_model=BidRecord, status_code=status.HTTP_201_CREATED)
def create_bid_record(request: CreateBidRecordRequest):
    """创建竞价记录"""
    # 检查竞价资格
    user_id = request.bidder_id
    bidding_id = request.bidding_id
    
    eligibility_result = land_bidding_service.check_bidder_eligibility(user_id, bidding_id)
    if not eligibility_result["is_eligible"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not eligible for this bidding"
        )
    
    # 创建竞价记录
    # 设置用户ID
    bid_request = CreateBidRequest(
        bidding_id=request.bidding_id,
        bid_price=request.bid_price
    )
    bid_record = land_bidding_service.create_bid_record(bid_request)
    if not bid_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create bid record"
        )
    # 设置用户ID
    bid_record.user_id = user_id
    
    return bid_record


@router.put("/bid-records/{bid_record_id}", response_model=BidRecord)
def update_bid_record(bid_record_id: str, request: UpdateBidRecordRequest):
    """更新竞价记录"""
    bid_record = land_bidding_service.update_bid_record(bid_record_id, request)
    if not bid_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bid record with id {bid_record_id} not found"
        )
    return bid_record


# 成交支付管理路由
@router.get("/winning-payments", response_model=List[WinningPayment])
def get_winning_payments(
    bidding_id: Optional[str] = None,
    bidder_id: Optional[str] = None,
    status: Optional[PaymentStatusEnum] = None,
    payment_date_from: Optional[datetime] = None,
    payment_date_to: Optional[datetime] = None
):
    """获取成交支付列表"""
    return land_bidding_service.get_winning_payments(bidding_id, bidder_id, status, payment_date_from, payment_date_to)


@router.get("/winning-payments/{payment_id}", response_model=WinningPayment)
def get_winning_payment_by_id(payment_id: str):
    """根据ID获取成交支付"""
    payment = land_bidding_service.get_winning_payment_by_id(payment_id)
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Winning payment with id {payment_id} not found"
        )
    return payment


@router.post("/winning-payments", response_model=WinningPayment, status_code=status.HTTP_201_CREATED)
def create_winning_payment(request: CreateWinningPaymentRequest):
    """创建成交支付"""
    payment = land_bidding_service.create_winning_payment(request)
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create winning payment"
        )
    return payment


@router.put("/winning-payments/{payment_id}", response_model=WinningPayment)
def update_winning_payment(payment_id: str, request: UpdateWinningPaymentRequest):
    """更新成交支付"""
    payment = land_bidding_service.update_winning_payment(payment_id, request)
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Winning payment with id {payment_id} not found"
        )
    return payment


# 确认成交支付路由
@router.post("/winning-payments/{payment_id}/confirm")
def confirm_winning_payment(payment_id: str):
    """确认成交支付"""
    success = land_bidding_service.confirm_winning_payment(payment_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to confirm winning payment for id {payment_id}"
        )
    return {"message": "Winning payment confirmed successfully"}


# 竞价结果审核路由
@router.post("/biddings/{bidding_id}/review")
def review_bidding_result(bidding_id: str, approved: bool, remark: Optional[str] = None):
    """审核竞价结果"""
    success = land_bidding_service.review_bidding_result(bidding_id, approved, remark)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to review bidding result for id {bidding_id}"
        )
    return {"message": "Bidding result reviewed successfully"}


# 竞价评价管理路由
@router.get("/reviews", response_model=List[BiddingReview])
def get_bidding_reviews(
    bidding_id: Optional[str] = None,
    reviewer_id: Optional[str] = None,
    review_date_from: Optional[datetime] = None,
    review_date_to: Optional[datetime] = None
):
    """获取竞价评价列表"""
    return land_bidding_service.get_bidding_reviews(bidding_id, reviewer_id, review_date_from, review_date_to)


@router.get("/reviews/{review_id}", response_model=BiddingReview)
def get_bidding_review_by_id(review_id: str):
    """根据ID获取竞价评价"""
    review = land_bidding_service.get_bidding_review_by_id(review_id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bidding review with id {review_id} not found"
        )
    return review


@router.post("/reviews", response_model=BiddingReview, status_code=status.HTTP_201_CREATED)
def create_bidding_review(request: CreateBiddingReviewRequest):
    """创建竞价评价"""
    review = land_bidding_service.create_bidding_review(request)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create bidding review"
        )
    return review


@router.put("/reviews/{review_id}", response_model=BiddingReview)
def update_bidding_review(review_id: str, request: UpdateBiddingReviewRequest):
    """更新竞价评价"""
    review = land_bidding_service.update_bidding_review(review_id, request)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bidding review with id {review_id} not found"
        )
    return review


# 高级查询路由
@router.post("/biddings/query", response_model=List[BiddingInfo])
def query_biddings(request: BiddingQueryRequest):
    """高级查询竞价信息"""
    return land_bidding_service.query_biddings(request)


# 批量操作路由
@router.post("/bidders/batch", status_code=status.HTTP_201_CREATED)
def batch_create_bidders(requests: List[CreateBidderRegistrationRequest]):
    """批量创建竞价人注册信息"""
    created_bidders = []
    for req in requests:
        bidder = land_bidding_service.create_bidder(req)
        if bidder:
            created_bidders.append(bidder)
    return {
        "created_count": len(created_bidders),
        "created_ids": [b.id for b in created_bidders]
    }


# 获取竞价状态路由
@router.get("/biddings/{bidding_id}/status")
def get_bidding_status(bidding_id: str):
    """获取竞价当前状态"""
    bidding = land_bidding_service.get_bidding_by_id(bidding_id)
    if not bidding:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bidding with id {bidding_id} not found"
        )
    
    current_time = datetime.now()
    status_info = {
        "bidding_id": bidding_id,
        "status": bidding.status,
        "current_price": land_bidding_service.get_current_bidding_price(bidding_id),
        "remaining_time": None,
        "participant_count": land_bidding_service.get_bidding_participant_count(bidding_id),
        "bid_count": land_bidding_service.get_bidding_bid_count(bidding_id)
    }
    
    # 计算剩余时间
    if bidding.status == BiddingStatusEnum.ACTIVE:
        remaining = bidding.end_time - current_time
        if remaining.total_seconds() > 0:
            status_info["remaining_time"] = str(remaining)
        else:
            status_info["remaining_time"] = "0:00:00"
    
    return status_info


# 获取竞价历史路由
@router.get("/biddings/{bidding_id}/history")
def get_bidding_history(bidding_id: str):
    """获取竞价历史记录"""
    if bidding_id not in land_bidding_service.biddings_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bidding with id {bidding_id} not found"
        )
    
    history = land_bidding_service.get_bidding_history(bidding_id)
    return history


# 导出数据路由
@router.get("/export/bidders")
def export_bidders():
    """导出竞价人数据"""
    file_path = land_bidding_service.export_bidders()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }


@router.get("/export/biddings")
def export_biddings():
    """导出竞价信息数据"""
    file_path = land_bidding_service.export_biddings()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }


@router.get("/export/bid-records")
def export_bid_records():
    """导出竞价记录数据"""
    file_path = land_bidding_service.export_bid_records()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }