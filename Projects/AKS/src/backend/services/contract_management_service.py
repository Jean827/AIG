# 承包合同管理模块服务层实现
import sys
import os
from typing import List, Optional, Dict, Tuple
from datetime import datetime, timedelta
import uuid

# 导入模型
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.contract_management import (
    Contract,
    ContractFee,
    ContractAttachment,
    CreateContractRequest,
    UpdateContractRequest,
    ContractReviewRequest,
    ContractCancelRequest,
    CreateContractFeeRequest,
    UpdateContractFeeRequest,
    CreateContractAttachmentRequest,
    UpdateContractAttachmentRequest,
    ContractQueryRequest
)


class ContractManagementService:
    def __init__(self):
        # 模拟数据库存储
        self.contracts_db: Dict[str, Contract] = {}
        self.contract_fees_db: Dict[str, ContractFee] = {}
        self.contract_attachments_db: Dict[str, ContractAttachment] = {}
        # 初始化一些测试数据
        self._init_test_data()
    
    def _init_test_data(self):
        # 初始化合同数据
        contract1 = Contract(
            id=str(uuid.uuid4()),
            contract_code="CONTRACT-2023-0001",
            land_id="land001",
            bidder_id="bidder001",
            contractor_name="张三",
            start_date=datetime(2023, 1, 1),
            end_date=datetime(2028, 12, 31),
            total_amount=77500.0,
            payment_term="一年一付",
            contract_status="待审核",
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.contracts_db[contract1.id] = contract1
        
        # 初始化合同费用数据
        contract_fee1 = ContractFee(
            id=str(uuid.uuid4()),
            contract_id=contract1.id,
            fee_type="土地承包费",
            amount=7750.0,
            due_date=datetime(2023, 12, 31),
            status="待支付",
            payment_time=None,
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.contract_fees_db[contract_fee1.id] = contract_fee1
    
    # 合同管理
    def get_contracts(self, 
                     farmer_id: Optional[str] = None, 
                     land_id: Optional[str] = None, 
                     contract_status: Optional[str] = None, 
                     start_date: Optional[datetime] = None, 
                     end_date: Optional[datetime] = None) -> List[Contract]:
        """获取所有合同信息"""
        contracts = list(self.contracts_db.values())
        
        if farmer_id:
            contracts = [c for c in contracts if c.farmer_id == farmer_id]
        if land_id:
            contracts = [c for c in contracts if c.land_id == land_id]
        if contract_status:
            contracts = [c for c in contracts if c.contract_status == contract_status]
        if start_date:
            contracts = [c for c in contracts if c.start_date >= start_date]
        if end_date:
            contracts = [c for c in contracts if c.end_date <= end_date]
            
        # 按创建时间倒序排序
        contracts.sort(key=lambda x: x.create_time, reverse=True)
        return contracts
    
    def get_contract_by_id(self, contract_id: str) -> Optional[Contract]:
        """根据ID获取合同信息"""
        return self.contracts_db.get(contract_id)
    
    def create_contract(self, request: CreateContractRequest) -> Contract:
        """创建合同信息"""
        # 生成合同编号
        contract_code = f"CONTRACT-{datetime.now().year}-{str(len(self.contracts_db) + 1).zfill(4)}"
        
        contract = Contract(
            id=str(uuid.uuid4()),
            user_id=request.user_id,
            land_id=request.land_id,
            contract_code=contract_code,
            contract_name=request.contract_name,
            start_date=request.start_date,
            end_date=request.end_date,
            total_amount=request.total_amount,
            payment_method=request.payment_method,
            payment_frequency=request.payment_frequency,
            contract_status="pending_review",
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.contracts_db[contract.id] = contract
        
        # 根据支付频率生成费用计划
        self._generate_contract_fees(contract)
        
        return contract
    
    def update_contract(self, contract_id: str, request: UpdateContractRequest) -> Optional[Contract]:
        """更新合同信息"""
        if contract_id not in self.contracts_db:
            return None
        
        contract = self.contracts_db[contract_id]
        # 只有在合同未审核通过时才能修改关键信息
        if contract.contract_status == "pending_review":
            if request.contract_name:
                contract.contract_name = request.contract_name
            if request.start_date:
                contract.start_date = request.start_date
            if request.end_date:
                contract.end_date = request.end_date
            if request.total_amount is not None:
                contract.total_amount = request.total_amount
            if request.payment_method:
                contract.payment_method = request.payment_method
            if request.payment_frequency:
                contract.payment_frequency = request.payment_frequency
                # 更新费用计划
                self._regenerate_contract_fees(contract)
        
        if request.contract_status:
            contract.contract_status = request.contract_status
        contract.update_time = datetime.now()
        
        self.contracts_db[contract_id] = contract
        return contract
    
    def delete_contract(self, contract_id: str) -> bool:
        """删除合同信息"""
        if contract_id not in self.contracts_db:
            return False
        
        # 检查合同状态
        contract = self.contracts_db[contract_id]
        if contract.contract_status != "pending_review":
            return False
        
        # 删除相关的费用和附件
        self._delete_contract_related_data(contract_id)
        
        del self.contracts_db[contract_id]
        return True
    
    # 合同审核
    def review_contract(self, request: ContractReviewRequest) -> Optional[Contract]:
        """审核合同"""
        if request.contract_id not in self.contracts_db:
            return None
        
        contract = self.contracts_db[request.contract_id]
        # 检查合同状态
        if contract.contract_status != "pending_review":
            return None
        
        # 更新合同状态
        contract.contract_status = request.status
        if request.comments:
            contract.comments = request.comments
        contract.update_time = datetime.now()
        
        self.contracts_db[contract.id] = contract
        return contract
    
    # 合同取消
    def cancel_contract(self, request: ContractCancelRequest) -> Optional[Contract]:
        """取消合同"""
        if request.contract_id not in self.contracts_db:
            return None
        
        contract = self.contracts_db[request.contract_id]
        # 检查合同状态
        if contract.contract_status not in ["approved", "effective"]:
            return None
        
        # 更新合同状态
        contract.contract_status = "cancelled"
        if request.reason:
            contract.cancellation_reason = request.reason
        contract.cancelled_at = datetime.now()
        contract.update_time = datetime.now()
        
        self.contracts_db[contract.id] = contract
        return contract
    
    # 合同费用管理
    def get_contract_fees(self, 
                         contract_id: Optional[str] = None, 
                         fee_type: Optional[str] = None, 
                         status: Optional[str] = None) -> List[ContractFee]:
        """获取所有合同费用信息"""
        fees = list(self.contract_fees_db.values())
        
        if contract_id:
            fees = [f for f in fees if f.contract_id == contract_id]
        if fee_type:
            fees = [f for f in fees if f.fee_type == fee_type]
        if status:
            fees = [f for f in fees if f.status == status]
            
        # 按到期日期排序
        fees.sort(key=lambda x: x.due_date)
        return fees
    
    def get_contract_fee_by_id(self, fee_id: str) -> Optional[ContractFee]:
        """根据ID获取合同费用信息"""
        return self.contract_fees_db.get(fee_id)
    
    def create_contract_fee(self, request: CreateContractFeeRequest) -> Optional[ContractFee]:
        """创建合同费用信息"""
        # 检查合同是否存在
        if request.contract_id not in self.contracts_db:
            return None
        
        contract_fee = ContractFee(
            id=str(uuid.uuid4()),
            contract_id=request.contract_id,
            fee_type=request.fee_type,
            amount=request.amount,
            due_date=request.due_date,
            payment_status="pending",
            payment_date=None,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        self.contract_fees_db[contract_fee.id] = contract_fee
        return contract_fee
    
    def update_contract_fee(self, fee_id: str, request: UpdateContractFeeRequest) -> Optional[ContractFee]:
        """更新合同费用信息"""
        if fee_id not in self.contract_fees_db:
            return None
        
        contract_fee = self.contract_fees_db[fee_id]
        if request.fee_type:
            contract_fee.fee_type = request.fee_type
        if request.amount is not None:
            contract_fee.amount = request.amount
        if request.due_date:
            contract_fee.due_date = request.due_date
        if request.payment_status:
            contract_fee.payment_status = request.payment_status
        if request.payment_date:
            contract_fee.payment_date = request.payment_date
        contract_fee.update_time = datetime.now()
        
        self.contract_fees_db[fee_id] = contract_fee
        return contract_fee
    
    def delete_contract_fee(self, fee_id: str) -> bool:
        """删除合同费用信息"""
        if fee_id not in self.contract_fees_db:
            return False
        
        # 检查费用状态
        contract_fee = self.contract_fees_db[fee_id]
        if contract_fee.payment_status != "pending":
            return False
        
        del self.contract_fees_db[fee_id]
        return True
    
    # 合同附件管理
    def get_contract_attachments(self, 
                                contract_id: Optional[str] = None, 
                                attachment_type: Optional[str] = None) -> List[ContractAttachment]:
        """获取所有合同附件信息"""
        attachments = list(self.contract_attachments_db.values())
        
        if contract_id:
            attachments = [a for a in attachments if a.contract_id == contract_id]
        if attachment_type:
            attachments = [a for a in attachments if a.attachment_type == attachment_type]
            
        # 按创建时间倒序排序
        attachments.sort(key=lambda x: x.create_time, reverse=True)
        return attachments
    
    def get_contract_attachment_by_id(self, attachment_id: str) -> Optional[ContractAttachment]:
        """根据ID获取合同附件信息"""
        return self.contract_attachments_db.get(attachment_id)
    
    def create_contract_attachment(self, request: CreateContractAttachmentRequest) -> Optional[ContractAttachment]:
        """创建合同附件信息"""
        # 检查合同是否存在
        if request.contract_id not in self.contracts_db:
            return None
        
        contract_attachment = ContractAttachment(
            id=str(uuid.uuid4()),
            contract_id=request.contract_id,
            attachment_name=request.attachment_name,
            attachment_type=request.attachment_type,
            file_path=request.file_path,
            file_size=request.file_size,
            file_type=request.file_type,
            created_at=datetime.now()
        )
        self.contract_attachments_db[contract_attachment.id] = contract_attachment
        return contract_attachment
    
    def update_contract_attachment(self, attachment_id: str, request: UpdateContractAttachmentRequest) -> Optional[ContractAttachment]:
        """更新合同附件信息"""
        if attachment_id not in self.contract_attachments_db:
            return None
        
        contract_attachment = self.contract_attachments_db[attachment_id]
        if request.attachment_name:
            contract_attachment.attachment_name = request.attachment_name
        if request.attachment_type:
            contract_attachment.attachment_type = request.attachment_type
        if request.file_path:
            contract_attachment.file_path = request.file_path
        if request.file_size is not None:
            contract_attachment.file_size = request.file_size
        if request.file_type:
            contract_attachment.file_type = request.file_type
        
        self.contract_attachments_db[attachment_id] = contract_attachment
        return contract_attachment
    
    def delete_contract_attachment(self, attachment_id: str) -> bool:
        """删除合同附件信息"""
        if attachment_id not in self.contract_attachments_db:
            return False
        
        del self.contract_attachments_db[attachment_id]
        return True
    
    # 合同查询
    def query_contracts(self, request: ContractQueryRequest) -> List[Contract]:
        """高级合同查询"""
        contracts = list(self.contracts_db.values())
        
        # 应用查询条件
        if request.farmer_id:
            contracts = [c for c in contracts if c.farmer_id == request.farmer_id]
        if request.land_id:
            contracts = [c for c in contracts if c.land_id == request.land_id]
        if request.contract_codes:
            contracts = [c for c in contracts if c.contract_code in request.contract_codes]
        if request.contract_statuses:
            contracts = [c for c in contracts if c.contract_status in request.contract_statuses]
        if request.start_date_from:
            contracts = [c for c in contracts if c.start_date >= request.start_date_from]
        if request.start_date_to:
            contracts = [c for c in contracts if c.start_date <= request.start_date_to]
        if request.end_date_from:
            contracts = [c for c in contracts if c.end_date >= request.end_date_from]
        if request.end_date_to:
            contracts = [c for c in contracts if c.end_date <= request.end_date_to]
        if request.amount_from is not None:
            contracts = [c for c in contracts if c.total_amount >= request.amount_from]
        if request.amount_to is not None:
            contracts = [c for c in contracts if c.total_amount <= request.amount_to]
        if request.payment_methods:
            contracts = [c for c in contracts if c.payment_method in request.payment_methods]
        
        # 排序
        if request.sort_by:
            try:
                contracts.sort(key=lambda x: getattr(x, request.sort_by), reverse=request.sort_descending)
            except AttributeError:
                # 如果排序字段不存在，按创建时间倒序排序
                contracts.sort(key=lambda x: x.created_at, reverse=True)
        else:
            # 默认按创建时间倒序排序
            contracts.sort(key=lambda x: x.created_at, reverse=True)
        
        # 分页
        if request.page and request.page_size:
            start = (request.page - 1) * request.page_size
            end = start + request.page_size
            contracts = contracts[start:end]
        
        return contracts
    
    # 生成合同费用计划
    def _generate_contract_fees(self, contract: Contract) -> None:
        """根据合同信息生成费用计划"""
        # 清除已有的费用计划
        self._delete_contract_related_fees(contract.id)
        
        # 根据支付频率生成费用计划
        if contract.payment_frequency == "yearly":
            # 计算合同年限
            years = (contract.end_date.year - contract.start_date.year) + 1
            # 计算每年费用
            yearly_amount = contract.total_amount / years if years > 0 else 0
            
            # 生成每年的费用记录
            for i in range(years):
                due_date = datetime(contract.start_date.year + i, 12, 31)
                self.create_contract_fee(
                    CreateContractFeeRequest(
                        contract_id=contract.id,
                        fee_type="rent",
                        amount=yearly_amount,
                        due_date=due_date
                    )
                )
        elif contract.payment_frequency == "quarterly":
            # 简化实现，实际应按季度生成
            pass
        elif contract.payment_frequency == "monthly":
            # 简化实现，实际应按月生成
            pass
        elif contract.payment_frequency == "one_time":
            # 一次性支付
            self.create_contract_fee(
                CreateContractFeeRequest(
                    contract_id=contract.id,
                    fee_type="rent",
                    amount=contract.total_amount,
                    due_date=contract.start_date
                )
            )
    
    # 重新生成合同费用计划
    def _regenerate_contract_fees(self, contract: Contract) -> None:
        """重新生成合同费用计划"""
        self._generate_contract_fees(contract)
    
    # 删除合同相关的费用
    def _delete_contract_related_fees(self, contract_id: str) -> None:
        """删除合同相关的所有费用"""
        # 找出所有相关的费用ID
        fee_ids_to_delete = [
            fee_id for fee_id, fee in self.contract_fees_db.items()
            if fee.contract_id == contract_id
        ]
        
        # 删除相关的费用
        for fee_id in fee_ids_to_delete:
            del self.contract_fees_db[fee_id]
    
    # 删除合同相关的附件
    def _delete_contract_related_attachments(self, contract_id: str) -> None:
        """删除合同相关的所有附件"""
        # 找出所有相关的附件ID
        attachment_ids_to_delete = [
            attachment_id for attachment_id, attachment in self.contract_attachments_db.items()
            if attachment.contract_id == contract_id
        ]
        
        # 删除相关的附件
        for attachment_id in attachment_ids_to_delete:
            del self.contract_attachments_db[attachment_id]
    
    # 删除合同相关的数据
    def _delete_contract_related_data(self, contract_id: str) -> None:
        """删除合同相关的所有数据"""
        self._delete_contract_related_fees(contract_id)
        self._delete_contract_related_attachments(contract_id)
    
    # 合同统计
    def get_contract_statistics(self) -> Dict:
        """获取合同统计信息"""
        # 计算各状态的合同数量
        status_count = {}
        for contract in self.contracts_db.values():
            status_count[contract.contract_status] = status_count.get(contract.contract_status, 0) + 1
        
        # 计算总金额
        total_amount = sum(contract.total_amount for contract in self.contracts_db.values())
        
        # 计算待支付费用总额
        pending_fees_amount = sum(
            fee.amount for fee in self.contract_fees_db.values()
            if fee.payment_status == "pending"
        )
        
        # 计算已支付费用总额
        paid_fees_amount = sum(
            fee.amount for fee in self.contract_fees_db.values()
            if fee.payment_status == "paid"
        )
        
        return {
            "total_contracts": len(self.contracts_db),
            "status_count": status_count,
            "total_amount": total_amount,
            "pending_fees_amount": pending_fees_amount,
            "paid_fees_amount": paid_fees_amount
        }


# 创建服务实例供导入使用
contract_management_service = ContractManagementService()