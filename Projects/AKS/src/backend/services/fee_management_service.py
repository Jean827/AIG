# 费用信息管理模块服务层实现
import sys
import os
from typing import List, Optional, Dict, Tuple
from datetime import datetime, timedelta
import uuid

# 导入模型
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
    PaymentRecordQueryRequest,
    FeeTypeEnum,
    FeeStatusEnum,
    PaymentStatusEnum,
    ReductionStatusEnum
)


class FeeManagementService:
    def __init__(self):
        # 模拟数据库存储
        self.fee_infos_db: Dict[str, FeeInfo] = {}
        self.reduction_infos_db: Dict[str, ReductionInfo] = {}
        self.payment_records_db: Dict[str, PaymentRecord] = {}
        # 初始化一些测试数据
        self._init_test_data()
    
    def _init_test_data(self):
        # 初始化费用信息数据
        fee1 = FeeInfo(
            id=str(uuid.uuid4()),
            contract_id="contract001",
            land_id="land001",
            user_id="user001",
            fee_type=FeeTypeEnum.LAND_CONTRACT_FEE,
            amount=7750.0,
            original_amount=7750.0,
            reduction_amount=0.0,
            due_date=datetime(2023, 12, 31),
            status=FeeStatusEnum.PENDING,
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.fee_infos_db[fee1.id] = fee1
        
        # 初始化支付记录数据
        payment1 = PaymentRecord(
            id=str(uuid.uuid4()),
            fee_id=fee1.id,
            amount=3000.0,
            payment_method="bank_transfer",
            transaction_id="TXN-20231015-0001",
            payment_time=datetime(2023, 10, 15),
            status=PaymentStatusEnum.SUCCESS
        )
        self.payment_records_db[payment1.id] = payment1
    
    # 费用信息管理
    def get_fee_infos(self, 
                     user_id: Optional[str] = None, 
                     land_id: Optional[str] = None, 
                     fee_type: Optional[str] = None, 
                     status: Optional[str] = None, 
                     due_date_from: Optional[datetime] = None, 
                     due_date_to: Optional[datetime] = None) -> List[FeeInfo]:
        """获取所有费用信息"""
        fees = list(self.fee_infos_db.values())
        
        if user_id:
            fees = [f for f in fees if f.user_id == user_id]
        if land_id:
            fees = [f for f in fees if f.land_id == land_id]
        if fee_type:
            fees = [f for f in fees if f.fee_type == fee_type]
        if status:
            fees = [f for f in fees if f.status == status]
        if due_date_from:
            fees = [f for f in fees if f.due_date >= due_date_from]
        if due_date_to:
            fees = [f for f in fees if f.due_date <= due_date_to]
            
        # 按到期日期排序
        fees.sort(key=lambda x: x.due_date)
        return fees
    
    def get_fee_info_by_id(self, fee_id: str) -> Optional[FeeInfo]:
        """根据ID获取费用信息"""
        return self.fee_infos_db.get(fee_id)
    
    def create_fee_info(self, request: CreateFeeInfoRequest) -> FeeInfo:
        """创建费用信息"""
        # 生成费用编号
        fee_code = f"FEE-{datetime.now().year}-{str(len(self.fee_infos_db) + 1).zfill(4)}"
        
        fee_info = FeeInfo(
            id=str(uuid.uuid4()),
            contract_id=request.contract_id,
            land_id=request.land_id,
            user_id=request.user_id,
            fee_type=request.fee_type,
            amount=request.amount,
            original_amount=request.amount,
            reduction_amount=0.0,
            due_date=request.due_date,
            status=FeeStatusEnum.PENDING,
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.fee_infos_db[fee_info.id] = fee_info
        
        return fee_info
    
    def update_fee_info(self, fee_id: str, request: UpdateFeeInfoRequest) -> Optional[FeeInfo]:
        """更新费用信息"""
        if fee_id not in self.fee_infos_db:
            return None
        
        fee_info = self.fee_infos_db[fee_id]
        # 只有在费用未支付时才能修改金额和到期日期
        if fee_info.status == FeeStatusEnum.PENDING:
            if request.amount is not None:
                fee_info.amount = request.amount
                # 同步更新原始金额
                fee_info.original_amount = request.amount
            if request.due_date:
                fee_info.due_date = request.due_date
        
        if request.fee_type:
            fee_info.fee_type = request.fee_type
        if request.status:
            fee_info.status = request.status
        if request.remark:
            fee_info.remark = request.remark
        fee_info.update_time = datetime.now()
        
        self.fee_infos_db[fee_id] = fee_info
        return fee_info
    
    def delete_fee_info(self, fee_id: str) -> bool:
        """删除费用信息"""
        if fee_id not in self.fee_infos_db:
            return False
        
        # 检查费用状态
        fee_info = self.fee_infos_db[fee_id]
        if fee_info.status != FeeStatusEnum.PENDING:
            return False
        
        # 删除相关的减免信息和支付记录
        self._delete_fee_related_data(fee_id)
        
        del self.fee_infos_db[fee_id]
        return True
    
    # 减免信息管理
    def get_reduction_infos(self, 
                           fee_id: Optional[str] = None, 
                           user_id: Optional[str] = None, 
                           reduction_reason: Optional[str] = None, 
                           status: Optional[str] = None) -> List[ReductionInfo]:
        """获取所有减免信息"""
        reductions = list(self.reduction_infos_db.values())
        
        if fee_id:
            reductions = [r for r in reductions if r.fee_id == fee_id]
        if user_id:
            reductions = [r for r in reductions if r.user_id == user_id]
        if reduction_reason:
            reductions = [r for r in reductions if reduction_reason in r.reduction_reason]
        if status:
            reductions = [r for r in reductions if r.status == status]
            
        # 按申请时间倒序排序
        reductions.sort(key=lambda x: x.application_time, reverse=True)
        return reductions
    
    def get_reduction_info_by_id(self, reduction_id: str) -> Optional[ReductionInfo]:
        """根据ID获取减免信息"""
        return self.reduction_infos_db.get(reduction_id)
    
    def create_reduction_info(self, request: CreateReductionInfoRequest) -> Optional[ReductionInfo]:
        """创建减免信息"""
        # 检查费用是否存在
        if request.fee_id not in self.fee_infos_db:
            return None
        
        # 获取费用信息以获取用户ID
        fee_info = self.fee_infos_db[request.fee_id]
        
        reduction_info = ReductionInfo(
            id=str(uuid.uuid4()),
            fee_id=request.fee_id,
            user_id=fee_info.user_id,
            reduction_amount=request.reduction_amount,
            reduction_reason=request.reduction_reason,
            application_time=datetime.now(),
            status=ReductionStatusEnum.PENDING_REVIEW,
            review_time=None,
            review_remark=None
        )
        self.reduction_infos_db[reduction_info.id] = reduction_info
        return reduction_info
    
    def update_reduction_info(self, reduction_id: str, request: UpdateReductionInfoRequest) -> Optional[ReductionInfo]:
        """更新减免信息"""
        if reduction_id not in self.reduction_infos_db:
            return None
        
        reduction_info = self.reduction_infos_db[reduction_id]
        # 只有在未审核时才能修改部分信息
        if reduction_info.status == ReductionStatusEnum.PENDING_REVIEW:
            if request.reduction_amount is not None:
                reduction_info.reduction_amount = request.reduction_amount
            if request.reduction_reason:
                reduction_info.reduction_reason = request.reduction_reason
        
        if request.status:
            reduction_info.status = request.status
            # 如果审核通过，更新费用金额
            if request.status == ReductionStatusEnum.APPROVED:
                self._apply_reduction(reduction_info)
            # 设置审核时间
            reduction_info.review_time = datetime.now()
        
        self.reduction_infos_db[reduction_id] = reduction_info
        return reduction_info
    
    def delete_reduction_info(self, reduction_id: str) -> bool:
        """删除减免信息"""
        if reduction_id not in self.reduction_infos_db:
            return False
        
        # 检查减免状态
        reduction_info = self.reduction_infos_db[reduction_id]
        if reduction_info.status != ReductionStatusEnum.PENDING_REVIEW:
            return False
        
        del self.reduction_infos_db[reduction_id]
        return True
    
    # 支付记录管理
    def get_payment_records(self, 
                           fee_id: Optional[str] = None, 
                           status: Optional[str] = None, 
                           payment_time_from: Optional[datetime] = None, 
                           payment_time_to: Optional[datetime] = None) -> List[PaymentRecord]:
        """获取所有支付记录"""
        payments = list(self.payment_records_db.values())
        
        if fee_id:
            payments = [p for p in payments if p.fee_id == fee_id]
        if status:
            payments = [p for p in payments if p.status == status]
        if payment_time_from:
            payments = [p for p in payments if p.payment_time >= payment_time_from]
        if payment_time_to:
            payments = [p for p in payments if p.payment_time <= payment_time_to]
            
        # 按支付时间倒序排序
        payments.sort(key=lambda x: x.payment_time, reverse=True)
        return payments
    
    def get_payment_record_by_id(self, payment_id: str) -> Optional[PaymentRecord]:
        """根据ID获取支付记录"""
        return self.payment_records_db.get(payment_id)
    
    def create_payment_record(self, request: CreatePaymentRecordRequest) -> Optional[PaymentRecord]:
        """创建支付记录"""
        # 检查费用是否存在
        if request.fee_id not in self.fee_infos_db:
            return None
        
        # 检查费用状态
        fee_info = self.fee_infos_db[request.fee_id]
        if fee_info.status == FeeStatusEnum.PAID:
            return None
        
        # 生成交易ID
        transaction_id = f"TXN-{datetime.now().strftime('%Y%m%d')}-{str(len(self.payment_records_db) + 1).zfill(4)}"
        
        payment_record = PaymentRecord(
            id=str(uuid.uuid4()),
            fee_id=request.fee_id,
            amount=request.amount,
            payment_method=request.payment_method,
            transaction_id=transaction_id,
            payment_time=request.payment_time or datetime.now(),
            status=request.status or PaymentStatusEnum.PROCESSING
        )
        self.payment_records_db[payment_record.id] = payment_record
        
        # 更新费用状态
        self._update_fee_status(fee_info.id)
        
        return payment_record
    
    def update_payment_record(self, payment_id: str, request: UpdatePaymentRecordRequest) -> Optional[PaymentRecord]:
        """更新支付记录"""
        if payment_id not in self.payment_records_db:
            return None
        
        payment_record = self.payment_records_db[payment_id]
        
        if request.amount is not None:
            old_amount = payment_record.amount
            payment_record.amount = request.amount
            # 如果金额有变化，更新费用状态
            if old_amount != request.amount:
                self._update_fee_status(payment_record.fee_id)
        if request.payment_time:
            payment_record.payment_time = request.payment_time
        if request.payment_method:
            payment_record.payment_method = request.payment_method
        if request.status:
            old_status = payment_record.status
            payment_record.status = request.status
            # 如果状态有变化，更新费用状态
            if old_status != request.status:
                self._update_fee_status(payment_record.fee_id)
        if request.transaction_id:
            payment_record.transaction_id = request.transaction_id
        if request.remark:
            payment_record.remark = request.remark
        
        self.payment_records_db[payment_id] = payment_record
        return payment_record
    
    def delete_payment_record(self, payment_id: str) -> bool:
        """删除支付记录"""
        if payment_id not in self.payment_records_db:
            return False
        
        # 检查支付状态
        payment_record = self.payment_records_db[payment_id]
        if payment_record.status == PaymentStatusEnum.SUCCESS:
            return False
        
        # 获取费用ID
        fee_id = payment_record.fee_id
        
        del self.payment_records_db[payment_id]
        
        # 更新费用状态
        self._update_fee_status(fee_id)
        
        return True
    
    # 费用查询
    def query_fees(self, request: FeeQueryRequest) -> List[FeeInfo]:
        """高级费用查询"""
        fees = list(self.fee_infos_db.values())
        
        # 应用查询条件
        if request.user_id:
            fees = [f for f in fees if f.user_id == request.user_id]
        if request.land_id:
            fees = [f for f in fees if f.land_id == request.land_id]
        if request.contract_id:
            fees = [f for f in fees if f.contract_id == request.contract_id]
        if request.fee_type:
            fees = [f for f in fees if f.fee_type == request.fee_type]
        if request.status:
            fees = [f for f in fees if f.status == request.status]
        if request.start_date:
            fees = [f for f in fees if f.due_date >= request.start_date]
        if request.end_date:
            fees = [f for f in fees if f.due_date <= request.end_date]
        
        # 排序
        if request.sort_by:
            try:
                fees.sort(key=lambda x: getattr(x, request.sort_by), reverse=request.sort_descending)
            except AttributeError:
                # 如果排序字段不存在，按到期日期排序
                fees.sort(key=lambda x: x.due_date)
        else:
            # 默认按到期日期排序
            fees.sort(key=lambda x: x.due_date)
        
        # 分页
        if request.page and request.page_size:
            start = (request.page - 1) * request.page_size
            end = start + request.page_size
            fees = fees[start:end]
        
        return fees
    
    # 支付记录查询
    def query_payment_records(self, request: PaymentRecordQueryRequest) -> List[PaymentRecord]:
        """高级支付记录查询"""
        payments = list(self.payment_records_db.values())
        
        # 应用查询条件
        if request.fee_ids:
            payments = [p for p in payments if p.fee_id in request.fee_ids]
        if request.payment_methods:
            payments = [p for p in payments if p.payment_method in request.payment_methods]
        if request.statuses:
            payments = [p for p in payments if p.status in request.statuses]
        if request.transaction_ids:
            payments = [p for p in payments if p.transaction_id in request.transaction_ids]
        if request.payment_time_from:
            payments = [p for p in payments if p.payment_time >= request.payment_time_from]
        if request.payment_time_to:
            payments = [p for p in payments if p.payment_time <= request.payment_time_to]
        if request.amount_from is not None:
            payments = [p for p in payments if p.amount >= request.amount_from]
        if request.amount_to is not None:
            payments = [p for p in payments if p.amount <= request.amount_to]
        
        # 排序
        if request.sort_by:
            try:
                payments.sort(key=lambda x: getattr(x, request.sort_by), reverse=request.sort_descending)
            except AttributeError:
                # 如果排序字段不存在，按支付时间倒序排序
                payments.sort(key=lambda x: x.payment_time, reverse=True)
        else:
            # 默认按支付时间倒序排序
            payments.sort(key=lambda x: x.payment_time, reverse=True)
        
        # 分页
        if request.page and request.page_size:
            start = (request.page - 1) * request.page_size
            end = start + request.page_size
            payments = payments[start:end]
        
        return payments
    
    # 应用减免
    def _apply_reduction(self, reduction_info: ReductionInfo) -> None:
        """应用费用减免"""
        if reduction_info.fee_id not in self.fee_infos_db:
            return
        
        fee_info = self.fee_infos_db[reduction_info.fee_id]
        # 计算减免后的金额
        original_amount = fee_info.amount
        new_amount = original_amount - reduction_info.reduction_amount
        
        # 更新费用金额
        fee_info.amount = max(0, new_amount)  # 确保金额不小于0
        fee_info.update_time = datetime.now()
        
        self.fee_infos_db[fee_info.id] = fee_info
        
        # 更新费用状态
        self._update_fee_status(fee_info.id)
    
    # 更新费用状态
    def _update_fee_status(self, fee_id: str) -> None:
        """根据支付记录更新费用状态"""
        if fee_id not in self.fee_infos_db:
            return
        
        fee_info = self.fee_infos_db[fee_id]
        
        # 获取所有与该费用相关的已完成支付记录
        completed_payments = [
            p for p in self.payment_records_db.values()
            if p.fee_id == fee_id and p.status == PaymentStatusEnum.SUCCESS
        ]
        
        # 计算已支付总额
        paid_amount = sum(p.amount for p in completed_payments)
        
        # 更新费用状态
        if paid_amount >= fee_info.amount:
            fee_info.status = FeeStatusEnum.PAID
        elif paid_amount > 0:
            fee_info.status = FeeStatusEnum.PARTIAL_PAID
        else:
            fee_info.status = FeeStatusEnum.PENDING
        
        fee_info.update_time = datetime.now()
        self.fee_infos_db[fee_id] = fee_info
    
    # 删除费用相关的数据
    def _delete_fee_related_data(self, fee_id: str) -> None:
        """删除费用相关的所有数据"""
        # 删除相关的减免信息
        reduction_ids_to_delete = [
            reduction_id for reduction_id, reduction in self.reduction_infos_db.items()
            if reduction.fee_id == fee_id and reduction.status == ReductionStatusEnum.PENDING_REVIEW
        ]
        for reduction_id in reduction_ids_to_delete:
            del self.reduction_infos_db[reduction_id]
        
        # 删除相关的支付记录
        payment_ids_to_delete = [
            payment_id for payment_id, payment in self.payment_records_db.items()
            if payment.fee_id == fee_id and payment.status != PaymentStatusEnum.SUCCESS
        ]
        for payment_id in payment_ids_to_delete:
            del self.payment_records_db[payment_id]
    
    # 计算费用统计
    def get_fee_statistics(self) -> Dict:
        """获取费用统计信息"""
        # 计算各状态的费用数量和金额
        status_count = {}
        status_amount = {}
        for fee in self.fee_infos_db.values():
            status_count[fee.status] = status_count.get(fee.status, 0) + 1
            status_amount[fee.status] = status_amount.get(fee.status, 0) + fee.amount
        
        # 计算各类型的费用数量和金额
        type_count = {}
        type_amount = {}
        for fee in self.fee_infos_db.values():
            type_count[fee.fee_type] = type_count.get(fee.fee_type, 0) + 1
            type_amount[fee.fee_type] = type_amount.get(fee.fee_type, 0) + fee.amount
        
        # 计算逾期费用
        today = datetime.now()
        overdue_fees = [
            fee for fee in self.fee_infos_db.values()
            if fee.due_date < today and fee.status in [FeeStatusEnum.PENDING, FeeStatusEnum.PARTIAL_PAID]
        ]
        overdue_count = len(overdue_fees)
        overdue_amount = sum(fee.amount for fee in overdue_fees)
        
        # 计算已完成支付总额
        completed_payments = [
            p for p in self.payment_records_db.values()
            if p.status == PaymentStatusEnum.SUCCESS
        ]
        total_paid_amount = sum(p.amount for p in completed_payments)
        
        return {
            "total_fees": len(self.fee_infos_db),
            "total_fee_amount": sum(fee.amount for fee in self.fee_infos_db.values()),
            "status_count": status_count,
            "status_amount": status_amount,
            "type_count": type_count,
            "type_amount": type_amount,
            "overdue_count": overdue_count,
            "overdue_amount": overdue_amount,
            "total_paid_amount": total_paid_amount
        }
    
    # 计算用户费用汇总
    def get_user_fee_summary(self, user_id: str) -> Dict:
        """获取用户费用汇总信息"""
        # 获取用户的所有费用
        user_fees = [f for f in self.fee_infos_db.values() if f.user_id == user_id]
        
        # 计算各状态的费用数量和金额
        status_count = {}
        status_amount = {}
        for fee in user_fees:
            status_count[fee.status] = status_count.get(fee.status, 0) + 1
            status_amount[fee.status] = status_amount.get(fee.status, 0) + fee.amount
        
        # 计算逾期费用
        today = datetime.now()
        overdue_fees = [
            fee for fee in user_fees
            if fee.due_date < today and fee.status in [FeeStatusEnum.PENDING, FeeStatusEnum.PARTIAL_PAID]
        ]
        overdue_count = len(overdue_fees)
        overdue_amount = sum(fee.amount for fee in overdue_fees)
        
        # 计算已完成支付总额
        # 首先获取用户的所有费用ID
        user_fee_ids = [fee.id for fee in user_fees]
        # 然后获取与这些费用相关的所有成功支付记录
        user_payments = [
            p for p in self.payment_records_db.values()
            if p.fee_id in user_fee_ids and p.status == PaymentStatusEnum.SUCCESS
        ]
        total_paid_amount = sum(p.amount for p in user_payments)
        
        return {
            "total_fees": len(user_fees),
            "total_fee_amount": sum(fee.amount for fee in user_fees),
            "status_count": status_count,
            "status_amount": status_amount,
            "overdue_count": overdue_count,
            "overdue_amount": overdue_amount,
            "total_paid_amount": total_paid_amount
        }


# 创建服务实例供导入使用
fee_management_service = FeeManagementService()