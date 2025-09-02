# 合同管理模块API路由
import sys
import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from datetime import datetime

# 导入服务和模型
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.contract_management import (
    Contract, 
    ContractFee, 
    ContractAttachment,
    CreateContractRequest, 
    UpdateContractRequest,
    CreateContractFeeRequest, 
    UpdateContractFeeRequest,
    CreateContractAttachmentRequest, 
    UpdateContractAttachmentRequest,
    ContractReviewRequest, 
    ContractCancelRequest,
    ContractQueryRequest,
    ContractStatusEnum, 
    FeeTypeEnum, 
    PaymentStatusEnum, 
    ReviewStatusEnum
)
from services.contract_management_service import contract_management_service

# 创建路由实例
router = APIRouter(
    prefix="/api/contract",
    tags=["Contract Management"],
    responses={404: {"description": "Not found"}}
)


# 合同管理路由
@router.get("/contracts", response_model=List[Contract])
def get_contracts(
    contract_no: Optional[str] = None,
    land_id: Optional[str] = None,
    party_a: Optional[str] = None,
    party_b: Optional[str] = None,
    status: Optional[str] = None,
    create_time_from: Optional[datetime] = None,
    create_time_to: Optional[datetime] = None
):
    """获取合同列表"""
    return contract_management_service.get_contracts(contract_no, land_id, party_a, party_b, status, create_time_from, create_time_to)


@router.get("/contracts/{contract_id}", response_model=Contract)
def get_contract_by_id(contract_id: str):
    """根据ID获取合同信息"""
    contract = contract_management_service.get_contract_by_id(contract_id)
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contract with id {contract_id} not found"
        )
    return contract


@router.post("/contracts", response_model=Contract, status_code=status.HTTP_201_CREATED)
def create_contract(request: CreateContractRequest):
    """创建合同信息"""
    contract = contract_management_service.create_contract(request)
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create contract"
        )
    return contract


@router.put("/contracts/{contract_id}", response_model=Contract)
def update_contract(contract_id: str, request: UpdateContractRequest):
    """更新合同信息"""
    contract = contract_management_service.update_contract(contract_id, request)
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contract with id {contract_id} not found"
        )
    return contract


@router.delete("/contracts/{contract_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contract(contract_id: str):
    """删除合同信息"""
    success = contract_management_service.delete_contract(contract_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete contract with id {contract_id} as it has active status or associated fees/attachments"
        )


# 合同费用管理路由
@router.get("/contracts/{contract_id}/fees", response_model=List[ContractFee])
def get_contract_fees(contract_id: str):
    """获取合同相关费用列表"""
    if contract_id not in contract_management_service.contracts_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contract with id {contract_id} not found"
        )
    return contract_management_service.get_contract_fees(contract_id)


@router.get("/fees/{fee_id}", response_model=ContractFee)
def get_contract_fee_by_id(fee_id: str):
    """根据ID获取合同费用"""
    fee = contract_management_service.get_contract_fee_by_id(fee_id)
    if not fee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contract fee with id {fee_id} not found"
        )
    return fee


@router.post("/contracts/{contract_id}/fees", response_model=ContractFee, status_code=status.HTTP_201_CREATED)
def create_contract_fee(contract_id: str, request: CreateContractFeeRequest):
    """为合同创建费用信息"""
    if contract_id not in contract_management_service.contracts_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contract with id {contract_id} not found"
        )
    
    # 设置合同ID
    updated_request = request.copy(update={"contract_id": contract_id})
    
    fee = contract_management_service.create_contract_fee(updated_request)
    if not fee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create contract fee"
        )
    return fee


@router.put("/fees/{fee_id}", response_model=ContractFee)
def update_contract_fee(fee_id: str, request: UpdateContractFeeRequest):
    """更新合同费用"""
    fee = contract_management_service.update_contract_fee(fee_id, request)
    if not fee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contract fee with id {fee_id} not found"
        )
    return fee


@router.delete("/fees/{fee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contract_fee(fee_id: str):
    """删除合同费用"""
    success = contract_management_service.delete_contract_fee(fee_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete contract fee with id {fee_id} as it has been paid or has pending transactions"
        )


# 合同附件管理路由
@router.get("/contracts/{contract_id}/attachments", response_model=List[ContractAttachment])
def get_contract_attachments(contract_id: str):
    """获取合同相关附件列表"""
    if contract_id not in contract_management_service.contracts_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contract with id {contract_id} not found"
        )
    return contract_management_service.get_contract_attachments(contract_id)


@router.get("/attachments/{attachment_id}", response_model=ContractAttachment)
def get_contract_attachment_by_id(attachment_id: str):
    """根据ID获取合同附件"""
    attachment = contract_management_service.get_contract_attachment_by_id(attachment_id)
    if not attachment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contract attachment with id {attachment_id} not found"
        )
    return attachment


@router.post("/contracts/{contract_id}/attachments", response_model=ContractAttachment, status_code=status.HTTP_201_CREATED)
def create_contract_attachment(
    contract_id: str,
    request: CreateContractAttachmentRequest,
    file: UploadFile = File(...)
):
    """为合同创建附件信息"""
    if contract_id not in contract_management_service.contracts_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contract with id {contract_id} not found"
        )
    
    # 设置合同ID
    updated_request = request.copy(update={"contract_id": contract_id})
    
    # 在实际应用中，这里应该处理文件上传
    # 简化版本中，我们使用模拟的文件路径
    file_path = f"/uploads/{contract_id}_{attachment_id}_{file.filename}"
    updated_request = updated_request.copy(update={"file_path": file_path})
    
    attachment = contract_management_service.create_contract_attachment(updated_request)
    if not attachment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create contract attachment"
        )
    return attachment


@router.put("/attachments/{attachment_id}", response_model=ContractAttachment)
def update_contract_attachment(
    attachment_id: str,
    request: UpdateContractAttachmentRequest,
    file: UploadFile = File(None)
):
    """更新合同附件"""
    # 在实际应用中，如果提供了新文件，应该处理文件上传
    
    attachment = contract_management_service.update_contract_attachment(attachment_id, request)
    if not attachment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contract attachment with id {attachment_id} not found"
        )
    return attachment


@router.delete("/attachments/{attachment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contract_attachment(attachment_id: str):
    """删除合同附件"""
    success = contract_management_service.delete_contract_attachment(attachment_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete contract attachment with id {attachment_id}"
        )


# 合同审核路由
@router.post("/contracts/{contract_id}/review")
def review_contract(contract_id: str, request: ContractReviewRequest):
    """审核合同"""
    contract = contract_management_service.get_contract_by_id(contract_id)
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contract with id {contract_id} not found"
        )
    
    success = contract_management_service.review_contract(contract_id, request)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to review contract with id {contract_id}"
        )
    
    # 获取更新后的合同信息
    updated_contract = contract_management_service.get_contract_by_id(contract_id)
    return updated_contract


# 合同撤销路由
@router.post("/contracts/{contract_id}/cancel")
def cancel_contract(contract_id: str, request: ContractCancelRequest):
    """撤销合同"""
    contract = contract_management_service.get_contract_by_id(contract_id)
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contract with id {contract_id} not found"
        )
    
    success = contract_management_service.cancel_contract(contract_id, request)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to cancel contract with id {contract_id}"
        )
    
    # 获取更新后的合同信息
    updated_contract = contract_management_service.get_contract_by_id(contract_id)
    return updated_contract


# 合同费用支付确认路由
@router.post("/fees/{fee_id}/confirm-payment")
def confirm_fee_payment(fee_id: str):
    """确认合同费用支付"""
    fee = contract_management_service.get_contract_fee_by_id(fee_id)
    if not fee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contract fee with id {fee_id} not found"
        )
    
    success = contract_management_service.confirm_fee_payment(fee_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to confirm payment for fee with id {fee_id}"
        )
    
    # 获取更新后的费用信息
    updated_fee = contract_management_service.get_contract_fee_by_id(fee_id)
    return updated_fee


# 合同费用计划生成路由
@router.post("/contracts/{contract_id}/generate-fee-plan")
def generate_fee_plan(contract_id: str):
    """为合同生成费用计划"""
    contract = contract_management_service.get_contract_by_id(contract_id)
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contract with id {contract_id} not found"
        )
    
    fees = contract_management_service.generate_fee_plan(contract_id)
    if not fees:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to generate fee plan for contract with id {contract_id}"
        )
    return fees


# 高级查询路由
@router.post("/contracts/query", response_model=List[Contract])
def query_contracts(request: ContractQueryRequest):
    """高级查询合同信息"""
    return contract_management_service.query_contracts(request)


# 批量操作路由
@router.post("/contracts/batch", status_code=status.HTTP_201_CREATED)
def batch_create_contracts(requests: List[CreateContractRequest]):
    """批量创建合同信息"""
    created_contracts = []
    for req in requests:
        contract = contract_management_service.create_contract(req)
        if contract:
            created_contracts.append(contract)
    return {
        "created_count": len(created_contracts),
        "created_ids": [c.id for c in created_contracts]
    }


# 合同统计路由
@router.get("/statistics/contracts")
def get_contract_statistics():
    """获取合同统计信息"""
    return contract_management_service.get_contract_statistics()


@router.get("/statistics/fees")
def get_fee_statistics():
    """获取费用统计信息"""
    return contract_management_service.get_fee_statistics()


# 合同到期提醒路由
@router.get("/contracts/expiring-soon")
def get_expiring_contracts(days_ahead: int = 30):
    """获取即将到期的合同"""
    return contract_management_service.get_expiring_contracts(days_ahead)


# 合同履行情况路由
@router.get("/contracts/{contract_id}/performance")
def get_contract_performance(contract_id: str):
    """获取合同履行情况"""
    contract = contract_management_service.get_contract_by_id(contract_id)
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contract with id {contract_id} not found"
        )
    
    performance = contract_management_service.get_contract_performance(contract_id)
    return performance


# 导出数据路由
@router.get("/export/contracts")
def export_contracts():
    """导出合同数据"""
    file_path = contract_management_service.export_contracts()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }


@router.get("/export/fees")
def export_fees():
    """导出费用数据"""
    file_path = contract_management_service.export_fees()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }


@router.get("/export/attachments")
def export_attachments():
    """导出附件数据"""
    file_path = contract_management_service.export_attachments()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }