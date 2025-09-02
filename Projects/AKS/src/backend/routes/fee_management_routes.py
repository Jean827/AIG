# 费用信息管理模块API路由
import sys
import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime

# 导入服务和模型
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.fee_management import (
    FeeInfo, 
    ReductionInfo, 
    PaymentRecord,
    CreateFeeInfoRequest, 
    UpdateFeeInfoRequest,
    CreateReductionInfoRequest, 
    UpdateReductionInfoRequest,
    CreatePaymentRecordRequest, 
    UpdatePaymentRecordRequest,
    FeeQueryRequest,
    FeeTypeEnum, 
    FeeStatusEnum, 
    ReductionStatusEnum, 
    PaymentStatusEnum
)
from services.fee_management_service import fee_management_service

# 创建路由实例
router = APIRouter(
    prefix="/api/fee",
    tags=["Fee Management"],
    responses={404: {"description": "Not found"}}
)


# 费用信息管理路由
@router.get("/fees", response_model=List[FeeInfo])
def get_fees(
    fee_name: Optional[str] = None,
    fee_type: Optional[FeeTypeEnum] = None,
    status: Optional[FeeStatusEnum] = None,
    related_id: Optional[str] = None,
    create_time_from: Optional[datetime] = None,
    create_time_to: Optional[datetime] = None
):
    """获取费用信息列表"""
    return fee_management_service.get_fees(fee_name, fee_type, status, related_id, create_time_from, create_time_to)


@router.get("/fees/{fee_id}", response_model=FeeInfo)
def get_fee_by_id(fee_id: str):
    """根据ID获取费用信息"""
    fee = fee_management_service.get_fee_by_id(fee_id)
    if not fee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Fee with id {fee_id} not found"
        )
    return fee


@router.post("/fees", response_model=FeeInfo, status_code=status.HTTP_201_CREATED)
def create_fee(request: CreateFeeInfoRequest):
    """创建费用信息"""
    fee = fee_management_service.create_fee(request)
    if not fee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create fee information"
        )
    return fee


@router.put("/fees/{fee_id}", response_model=FeeInfo)
def update_fee(fee_id: str, request: UpdateFeeInfoRequest):
    """更新费用信息"""
    fee = fee_management_service.update_fee(fee_id, request)
    if not fee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Fee with id {fee_id} not found"
        )
    return fee


@router.delete("/fees/{fee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_fee(fee_id: str):
    """删除费用信息"""
    success = fee_management_service.delete_fee(fee_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete fee with id {fee_id} as it has payments or reductions associated"
        )


# 减免信息管理路由
@router.get("/reductions", response_model=List[ReductionInfo])
def get_reductions(
    fee_id: Optional[str] = None,
    reduction_type: Optional[str] = None,
    status: Optional[ReductionStatusEnum] = None,
    apply_time_from: Optional[datetime] = None,
    apply_time_to: Optional[datetime] = None
):
    """获取减免信息列表"""
    return fee_management_service.get_reductions(fee_id, reduction_type, status, apply_time_from, apply_time_to)


@router.get("/reductions/{reduction_id}", response_model=ReductionInfo)
def get_reduction_by_id(reduction_id: str):
    """根据ID获取减免信息"""
    reduction = fee_management_service.get_reduction_by_id(reduction_id)
    if not reduction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reduction with id {reduction_id} not found"
        )
    return reduction


@router.post("/reductions", response_model=ReductionInfo, status_code=status.HTTP_201_CREATED)
def create_reduction(request: CreateReductionInfoRequest):
    """创建减免信息"""
    # 检查费用是否存在
    fee_id = request.fee_id
    if not fee_management_service.get_fee_by_id(fee_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Fee with id {fee_id} not found"
        )
    
    reduction = fee_management_service.create_reduction(request)
    if not reduction:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create reduction information"
        )
    return reduction


@router.put("/reductions/{reduction_id}", response_model=ReductionInfo)
def update_reduction(reduction_id: str, request: UpdateReductionInfoRequest):
    """更新减免信息"""
    reduction = fee_management_service.update_reduction(reduction_id, request)
    if not reduction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reduction with id {reduction_id} not found"
        )
    return reduction


@router.delete("/reductions/{reduction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reduction(reduction_id: str):
    """删除减免信息"""
    success = fee_management_service.delete_reduction(reduction_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete reduction with id {reduction_id} as it has been approved or applied"
        )


# 支付记录管理路由
@router.get("/payments", response_model=List[PaymentRecord])
def get_payment_records(
    fee_id: Optional[str] = None,
    payment_no: Optional[str] = None,
    status: Optional[PaymentStatusEnum] = None,
    payment_time_from: Optional[datetime] = None,
    payment_time_to: Optional[datetime] = None
):
    """获取支付记录列表"""
    return fee_management_service.get_payment_records(fee_id, payment_no, status, payment_time_from, payment_time_to)


@router.get("/payments/{payment_id}", response_model=PaymentRecord)
def get_payment_record_by_id(payment_id: str):
    """根据ID获取支付记录"""
    payment = fee_management_service.get_payment_record_by_id(payment_id)
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Payment record with id {payment_id} not found"
        )
    return payment


@router.post("/payments", response_model=PaymentRecord, status_code=status.HTTP_201_CREATED)
def create_payment_record(request: CreatePaymentRecordRequest):
    """创建支付记录"""
    # 检查费用是否存在
    fee_id = request.fee_id
    fee = fee_management_service.get_fee_by_id(fee_id)
    if not fee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Fee with id {fee_id} not found"
        )
    
    # 检查支付金额是否超过剩余未支付金额
    remaining_amount = fee.total_amount - fee.paid_amount
    if request.amount > remaining_amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payment amount exceeds remaining amount: {remaining_amount}"
        )
    
    payment = fee_management_service.create_payment_record(request)
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create payment record"
        )
    return payment


@router.put("/payments/{payment_id}", response_model=PaymentRecord)
def update_payment_record(payment_id: str, request: UpdatePaymentRecordRequest):
    """更新支付记录"""
    payment = fee_management_service.update_payment_record(payment_id, request)
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Payment record with id {payment_id} not found"
        )
    return payment


@router.delete("/payments/{payment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_payment_record(payment_id: str):
    """删除支付记录"""
    success = fee_management_service.delete_payment_record(payment_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete payment record with id {payment_id} as it has been confirmed"
        )


# 费用减免审核路由
@router.post("/reductions/{reduction_id}/review")
def review_reduction(reduction_id: str, approved: bool, remark: Optional[str] = None):
    """审核费用减免申请"""
    reduction = fee_management_service.get_reduction_by_id(reduction_id)
    if not reduction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reduction with id {reduction_id} not found"
        )
    
    success = fee_management_service.review_reduction(reduction_id, approved, remark)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to review reduction with id {reduction_id}"
        )
    
    # 获取更新后的减免信息
    updated_reduction = fee_management_service.get_reduction_by_id(reduction_id)
    return updated_reduction


# 确认支付路由
@router.post("/payments/{payment_id}/confirm")
def confirm_payment(payment_id: str):
    """确认支付记录"""
    payment = fee_management_service.get_payment_record_by_id(payment_id)
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Payment record with id {payment_id} not found"
        )
    
    success = fee_management_service.confirm_payment(payment_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to confirm payment with id {payment_id}"
        )
    
    # 获取更新后的支付记录和费用信息
    updated_payment = fee_management_service.get_payment_record_by_id(payment_id)
    updated_fee = fee_management_service.get_fee_by_id(payment.fee_id)
    
    return {
        "payment": updated_payment,
        "fee": updated_fee
    }


# 应用减免路由
@router.post("/reductions/{reduction_id}/apply")
def apply_reduction(reduction_id: str):
    """应用费用减免"""
    reduction = fee_management_service.get_reduction_by_id(reduction_id)
    if not reduction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reduction with id {reduction_id} not found"
        )
    
    success = fee_management_service.apply_reduction(reduction_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to apply reduction with id {reduction_id}"
        )
    
    # 获取更新后的减免信息和费用信息
    updated_reduction = fee_management_service.get_reduction_by_id(reduction_id)
    updated_fee = fee_management_service.get_fee_by_id(reduction.fee_id)
    
    return {
        "reduction": updated_reduction,
        "fee": updated_fee
    }


# 高级查询路由
@router.post("/fees/query", response_model=List[FeeInfo])
def query_fees(request: FeeQueryRequest):
    """高级查询费用信息"""
    return fee_management_service.query_fees(request)


# 批量操作路由
@router.post("/fees/batch", status_code=status.HTTP_201_CREATED)
def batch_create_fees(requests: List[CreateFeeInfoRequest]):
    """批量创建费用信息"""
    created_fees = []
    for req in requests:
        fee = fee_management_service.create_fee(req)
        if fee:
            created_fees.append(fee)
    return {
        "created_count": len(created_fees),
        "created_ids": [f.id for f in created_fees]
    }


# 费用统计路由
@router.get("/statistics/fees")
def get_fee_statistics():
    """获取费用统计信息"""
    return fee_management_service.get_fee_statistics()


@router.get("/statistics/payments")
def get_payment_statistics():
    """获取支付统计信息"""
    return fee_management_service.get_payment_statistics()


@router.get("/statistics/reductions")
def get_reduction_statistics():
    """获取减免统计信息"""
    return fee_management_service.get_reduction_statistics()


# 逾期费用查询路由
@router.get("/overdue-fees")
def get_overdue_fees(days_overdue: int = 0):
    """获取逾期费用"""
    return fee_management_service.get_overdue_fees(days_overdue)


# 费用结清路由
@router.post("/fees/{fee_id}/settle")
def settle_fee(fee_id: str):
    """结清费用"""
    fee = fee_management_service.get_fee_by_id(fee_id)
    if not fee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Fee with id {fee_id} not found"
        )
    
    if fee.status == FeeStatusEnum.PAID:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Fee with id {fee_id} is already paid"
        )
    
    # 计算剩余未支付金额
    remaining_amount = fee.total_amount - fee.paid_amount
    if remaining_amount <= 0:
        # 更新费用状态为已支付
        updated_fee = fee_management_service.update_fee_status(fee_id, FeeStatusEnum.PAID)
        return updated_fee
    
    # 创建结清支付记录
    payment_request = CreatePaymentRecordRequest(
        fee_id=fee_id,
        amount=remaining_amount,
        payment_method="系统结清",
        payment_time=datetime.now(),
        transaction_no=f"SETTLE_{fee_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}",
        status=PaymentStatusEnum.PENDING
    )
    
    payment = fee_management_service.create_payment_record(payment_request)
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create settlement payment for fee {fee_id}"
        )
    
    # 确认支付
    success = fee_management_service.confirm_payment(payment.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to confirm settlement payment for fee {fee_id}"
        )
    
    # 获取更新后的费用信息
    updated_fee = fee_management_service.get_fee_by_id(fee_id)
    return updated_fee


# 导出数据路由
@router.get("/export/fees")
def export_fees():
    """导出费用数据"""
    file_path = fee_management_service.export_fees()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }


@router.get("/export/payments")
def export_payments():
    """导出支付记录数据"""
    file_path = fee_management_service.export_payments()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }


@router.get("/export/reductions")
def export_reductions():
    """导出减免信息数据"""
    file_path = fee_management_service.export_reductions()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }


# 用户费用汇总路由
@router.get("/users/{user_id}/summary")
def get_user_fee_summary(user_id: str):
    """获取用户费用汇总信息"""
    return fee_management_service.get_user_fee_summary(user_id)