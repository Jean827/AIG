# 土地竞拍管理模块服务层实现
import sys
import os
from typing import List, Optional, Dict, Tuple
from datetime import datetime, timedelta
import uuid
import random

# 导入模型
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
    CreateBidRequest,
    CreateWinningPaymentRequest,
    BiddingReviewRequest
)
from pydantic import BaseModel

# 保证金交易创建请求（本地定义，因为models中没有）
class CreateDepositTransactionRequest(BaseModel):
    bidding_id: str
    user_id: str
    payment_method: str
    transaction_id: str

# 保证金交易更新请求（本地定义，因为models中没有）
class UpdateDepositTransactionRequest(BaseModel):
    user_id: Optional[str] = None
    bidding_id: Optional[str] = None
    amount: Optional[float] = None
    transaction_type: Optional[str] = None
    status: Optional[str] = None
    transaction_time: Optional[datetime] = None
    remark: Optional[str] = None


class LandBiddingService:
    def __init__(self):
        # 模拟数据库存储
        self.bidder_registrations_db: Dict[str, BidderRegistration] = {}
        self.bidding_info_db: Dict[str, BiddingInfo] = {}
        self.deposit_transactions_db: Dict[str, DepositTransaction] = {}
        self.bid_records_db: Dict[str, BidRecord] = {}
        self.winning_payments_db: Dict[str, WinningPayment] = {}
        # 初始化一些测试数据
        self._init_test_data()
    
    def _init_test_data(self):
        # 初始化竞拍信息数据
        bidding1 = BiddingInfo(
            id=str(uuid.uuid4()),
            land_id="land001",
            title="团结村优质耕地竞拍",
            description="团结村15.5亩优质耕地竞拍",
            starting_price=7750.0,
            increment=500.0,
            deposit_amount=1550.0,
            start_time=datetime.now() + timedelta(days=1),
            end_time=datetime.now() + timedelta(days=8),
            status="待开始",
            winner_id=None,
            final_price=None,
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.bidding_info_db[bidding1.id] = bidding1
    
    # 竞拍者注册管理
    def get_bidder_registrations(self, 
                                user_id: Optional[str] = None, 
                                status: Optional[str] = None) -> List[BidderRegistration]:
        """获取所有竞拍者注册信息"""
        registrations = list(self.bidder_registrations_db.values())
        
        if user_id:
            registrations = [r for r in registrations if r.user_id == user_id]
        if status:
            registrations = [r for r in registrations if r.status == status]
            
        # 按时间倒序排序
        registrations.sort(key=lambda x: x.create_time, reverse=True)
        return registrations
    
    def get_bidder_registration_by_id(self, registration_id: str) -> Optional[BidderRegistration]:
        """根据ID获取竞拍者注册信息"""
        return self.bidder_registrations_db.get(registration_id)
    
    def get_bidder_registration_by_user_id(self, user_id: str) -> Optional[BidderRegistration]:
        """根据用户ID获取竞拍者注册信息"""
        for registration in self.bidder_registrations_db.values():
            if registration.user_id == user_id:
                return registration
        return None
    
    def create_bidder_registration(self, request: CreateBidderRegistrationRequest) -> BidderRegistration:
        """创建竞拍者注册信息"""
        registration = BidderRegistration(
            id=str(uuid.uuid4()),
            user_id=str(uuid.uuid4()),  # 生成新的用户ID
            user_type=request.user_type,
            real_name=request.real_name,
            id_card_number=request.id_card_number,
            phone_number=request.phone_number,
            address=request.address,
            business_license=request.business_license,
            status="待审核",
            review_time=None,
            review_remark=None,
            create_time=datetime.now()
        )
        self.bidder_registrations_db[registration.id] = registration
        return registration
    
    def update_bidder_registration(self, registration_id: str, request: UpdateBidderRegistrationRequest) -> Optional[BidderRegistration]:
        """更新竞拍者注册信息"""
        if registration_id not in self.bidder_registrations_db:
            return None
        
        registration = self.bidder_registrations_db[registration_id]
        if request.user_type:
            registration.user_type = request.user_type
        if request.real_name:
            registration.real_name = request.real_name
        if request.id_card_number:
            registration.id_card_number = request.id_card_number
        if request.phone_number:
            registration.phone_number = request.phone_number
        if request.address:
            registration.address = request.address
        if request.business_license is not None:
            registration.business_license = request.business_license
        
        self.bidder_registrations_db[registration_id] = registration
        return registration
    
    def delete_bidder_registration(self, registration_id: str) -> bool:
        """删除竞拍者注册信息"""
        if registration_id not in self.bidder_registrations_db:
            return False
        
        del self.bidder_registrations_db[registration_id]
        return True
    
    # 竞拍信息管理
    def get_bidding_info(self, 
                        land_id: Optional[str] = None, 
                        status: Optional[str] = None, 
                        start_date: Optional[datetime] = None, 
                        end_date: Optional[datetime] = None) -> List[BiddingInfo]:
        """获取所有竞拍信息"""
        bidding_list = list(self.bidding_info_db.values())
        
        if land_id:
            bidding_list = [b for b in bidding_list if b.land_id == land_id]
        if status:
            bidding_list = [b for b in bidding_list if b.status == status]
        if start_date:
            bidding_list = [b for b in bidding_list if b.start_time >= start_date]
        if end_date:
            bidding_list = [b for b in bidding_list if b.end_time <= end_date]
            
        # 按开始时间排序
        bidding_list.sort(key=lambda x: x.start_time)
        return bidding_list
    
    def get_bidding_info_by_id(self, bidding_id: str) -> Optional[BiddingInfo]:
        """根据ID获取竞拍信息"""
        return self.bidding_info_db.get(bidding_id)
    
    def create_bidding_info(self, request: BiddingInfoCreateRequest) -> BiddingInfo:
        """创建竞拍信息"""
        bidding = BiddingInfo(
            id=str(uuid.uuid4()),
            land_id=request.land_id,
            title=request.title,
            description=request.description,
            starting_price=request.starting_price,
            increment=request.increment,
            deposit_amount=request.deposit_amount,
            start_time=request.start_time,
            end_time=request.end_time,
            status="待开始",
            winner_id=None,
            final_price=None,
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.bidding_info_db[bidding.id] = bidding
        return bidding
    
    def update_bidding_info(self, bidding_id: str, request: BiddingInfoUpdateRequest) -> Optional[BiddingInfo]:
        """更新竞拍信息"""
        if bidding_id not in self.bidding_info_db:
            return None
        
        bidding = self.bidding_info_db[bidding_id]
        # 只有在竞拍未开始时才能修改关键信息
        now = datetime.now()
        if now < bidding.start_time:
            if request.title:
                bidding.title = request.title
            if request.description:
                bidding.description = request.description
            if request.starting_price is not None:
                bidding.starting_price = request.starting_price
            if request.increment is not None:
                bidding.increment = request.increment
            if request.deposit_amount is not None:
                bidding.deposit_amount = request.deposit_amount
            if request.start_time:
                bidding.start_time = request.start_time
            if request.end_time:
                bidding.end_time = request.end_time
        
        if request.status:
            bidding.status = request.status
        bidding.update_time = datetime.now()
        
        self.bidding_info_db[bidding_id] = bidding
        return bidding
    
    def delete_bidding_info(self, bidding_id: str) -> bool:
        """删除竞拍信息"""
        if bidding_id not in self.bidding_info_db:
            return False
        
        # 检查竞拍是否已经开始
        bidding = self.bidding_info_db[bidding_id]
        if datetime.now() >= bidding.start_time:
            return False
        
        del self.bidding_info_db[bidding_id]
        return True
    
    # 保证金交易管理
    def get_deposit_transactions(self, 
                                bidding_id: Optional[str] = None, 
                                user_id: Optional[str] = None, 
                                status: Optional[str] = None) -> List[DepositTransaction]:
        """获取所有保证金交易记录"""
        transactions = list(self.deposit_transactions_db.values())
        
        if bidding_id:
            transactions = [t for t in transactions if t.bidding_id == bidding_id]
        if user_id:
            transactions = [t for t in transactions if t.user_id == user_id]
        if status:
            transactions = [t for t in transactions if t.status == status]
            
        # 按时间倒序排序
        transactions.sort(key=lambda x: x.created_at, reverse=True)
        return transactions
    
    def get_deposit_transaction_by_id(self, transaction_id: str) -> Optional[DepositTransaction]:
        """根据ID获取保证金交易记录"""
        return self.deposit_transactions_db.get(transaction_id)
    
    def create_deposit_transaction(self, request: CreateDepositTransactionRequest) -> Optional[DepositTransaction]:
        """创建保证金交易记录"""
        # 检查竞拍信息是否存在
        bidding = self.get_bidding_info_by_id(request.bidding_id)
        if not bidding:
            return None
        
        # 创建保证金交易记录
        transaction = DepositTransaction(
            id=str(uuid.uuid4()),
            user_id=request.user_id,
            bidding_id=request.bidding_id,
            amount=bidding.deposit_amount,
            transaction_type="支付",
            status="已支付",
            transaction_time=datetime.now(),
            remark=None
        )
        self.deposit_transactions_db[transaction.id] = transaction
        return transaction
    
    # 路由层使用的方法，与现有的内部方法名称保持一致
    def get_deposits(self, bidder_id: Optional[str] = None, bidding_id: Optional[str] = None,
                   transaction_no: Optional[str] = None, status: Optional[str] = None,
                   transaction_date_from: Optional[datetime] = None, transaction_date_to: Optional[datetime] = None) -> List[DepositTransaction]:
        """获取保证金交易列表（路由层使用）"""
        # 调用现有的get_deposit_transactions方法，并映射参数
        transactions = self.get_deposit_transactions(bidding_id=bidding_id, user_id=bidder_id, status=status)
        
        # 添加额外的过滤条件
        if transaction_date_from:
            transactions = [t for t in transactions if t.transaction_time and t.transaction_time >= transaction_date_from]
        if transaction_date_to:
            transactions = [t for t in transactions if t.transaction_time and t.transaction_time <= transaction_date_to]
            
        return transactions
    
    def get_deposit_by_id(self, deposit_id: str) -> Optional[DepositTransaction]:
        """根据ID获取保证金交易（路由层使用）"""
        # 调用现有的get_deposit_transaction_by_id方法
        return self.get_deposit_transaction_by_id(transaction_id=deposit_id)
    
    def create_deposit(self, request: CreateDepositTransactionRequest) -> Optional[DepositTransaction]:
        """创建保证金交易（路由层使用）"""
        # 调用现有的create_deposit_transaction方法
        return self.create_deposit_transaction(request=request)
    
    def update_deposit(self, deposit_id: str, request: UpdateDepositTransactionRequest) -> Optional[DepositTransaction]:
        """更新保证金交易"""
        # 获取要更新的交易记录
        transaction = self.get_deposit_transaction_by_id(transaction_id=deposit_id)
        if not transaction:
            return None
        
        # 更新交易记录的字段
        if request.user_id is not None:
            transaction.user_id = request.user_id
        if request.bidding_id is not None:
            transaction.bidding_id = request.bidding_id
        if request.amount is not None:
            transaction.amount = request.amount
        if request.transaction_type is not None:
            transaction.transaction_type = request.transaction_type
        if request.status is not None:
            transaction.status = request.status
        if request.transaction_time is not None:
            transaction.transaction_time = request.transaction_time
        if request.remark is not None:
            transaction.remark = request.remark
            
        return transaction
    
    def confirm_deposit_payment(self, deposit_id: str) -> bool:
        """确认保证金支付"""
        # 获取要确认的交易记录
        transaction = self.get_deposit_transaction_by_id(transaction_id=deposit_id)
        if not transaction or transaction.status != "待支付":
            return False
        
        # 更新交易状态为已支付
        transaction.status = "已支付"
        transaction.transaction_time = datetime.now()
        return True
    
    # 竞价记录管理
    def get_bid_records(self, 
                       bidding_id: Optional[str] = None, 
                       user_id: Optional[str] = None) -> List[BidRecord]:
        """获取所有竞价记录"""
        records = list(self.bid_records_db.values())
        
        if bidding_id:
            records = [r for r in records if r.bidding_id == bidding_id]
        if user_id:
            records = [r for r in records if r.user_id == user_id]
            
        # 按时间倒序排序
        records.sort(key=lambda x: x.create_time, reverse=True)
        return records
    
    def get_bid_record_by_id(self, record_id: str) -> Optional[BidRecord]:
        """根据ID获取竞价记录"""
        return self.bid_records_db.get(record_id)
    
    def create_bid_record(self, request: CreateBidRequest) -> Optional[BidRecord]:
        """创建竞价记录"""
        # 检查竞拍信息是否存在且处于进行中
        bidding = self.get_bidding_info_by_id(request.bidding_id)
        now = datetime.now()
        if (not bidding or 
            bidding.status != "进行中" or 
            now < bidding.start_time or 
            now > bidding.end_time):
            return None
        
        # 创建竞价记录
        bid_record = BidRecord(
            id=str(uuid.uuid4()),
            bidding_id=request.bidding_id,
            user_id=str(uuid.uuid4()),  # 假设这是当前用户的ID
            bid_price=request.bid_price,
            bid_time=now,
            status="有效"
        )
        self.bid_records_db[bid_record.id] = bid_record
        
        return bid_record
    
    # 成交支付管理
    def get_winning_payments(self, 
                            bidding_id: Optional[str] = None, 
                            user_id: Optional[str] = None, 
                            status: Optional[str] = None) -> List[WinningPayment]:
        """获取所有成交支付记录"""
        payments = list(self.winning_payments_db.values())
        
        if bidding_id:
            payments = [p for p in payments if p.bidding_id == bidding_id]
        if user_id:
            payments = [p for p in payments if p.user_id == user_id]
        if status:
            payments = [p for p in payments if p.status == status]
            
        # 按时间倒序排序
        payments.sort(key=lambda x: x.create_time, reverse=True)
        return payments
    
    def get_winning_payment_by_id(self, payment_id: str) -> Optional[WinningPayment]:
        """根据ID获取成交支付记录"""
        return self.winning_payments_db.get(payment_id)
    
    def create_winning_payment(self, request: CreateWinningPaymentRequest) -> Optional[WinningPayment]:
        """创建成交支付记录"""
        # 检查竞拍信息是否存在且已结束
        bidding = self.get_bidding_info_by_id(request.bidding_id)
        now = datetime.now()
        if (not bidding or 
            bidding.status != "已结束" or 
            now <= bidding.end_time or 
            not bidding.winner_id):
            return None
        
        # 创建成交支付记录
        payment = WinningPayment(
            id=str(uuid.uuid4()),
            bidding_id=request.bidding_id,
            user_id=bidding.winner_id,
            total_amount=bidding.final_price or 0,
            paid_amount=request.amount,
            status="已支付" if request.amount >= (bidding.final_price or 0) else "部分支付",
            due_date=now + timedelta(days=30),
            penalty_amount=0,
            create_time=now,
            update_time=now
        )
        self.winning_payments_db[payment.id] = payment
        
        return payment
    
    # 竞拍审核管理 - 获取已审核的注册信息
    def get_approved_registrations(self) -> List[BidderRegistration]:
        """获取所有已审核通过的竞拍者注册信息"""
        approved = [r for r in self.bidder_registrations_db.values() if r.status == "已通过"]
        # 按时间倒序排序
        approved.sort(key=lambda x: x.create_time, reverse=True)
        return approved
    
    def create_bidding_review(self, request: BiddingReviewRequest) -> Optional[BidderRegistration]:
        """创建竞拍审核记录"""
        # 检查注册信息是否存在
        registration = next(
            (r for r in self.bidder_registrations_db.values() if r.id == request.registration_id),
            None
        )
        if not registration:
            return None
        
        # 更新注册信息状态
        registration.status = request.status
        registration.review_time = datetime.now()
        registration.review_remark = request.remark
        self.bidder_registrations_db[registration.id] = registration
        
        return registration
    
    # 竞拍者资格检查
    def check_bidder_eligibility(self, farmer_id: str, bidding_id: str) -> Dict[str, bool]:
        """检查竞拍者资格"""
        result = {
            "is_eligible": False,
            "has_registration": False,
            "is_registration_approved": False,
            "has_deposit": False,
            "bidding_is_active": False,
            "bidding_in_time": False
        }
        
        # 检查竞拍者注册信息
        bidder_registration = self.get_bidder_registration_by_farmer_id(farmer_id)
        if bidder_registration:
            result["has_registration"] = True
            if bidder_registration.status == "approved":
                result["is_registration_approved"] = True
        
        # 检查保证金缴纳情况
        deposit_transaction = next(
            (t for t in self.deposit_transactions_db.values()
             if t.bidding_id == bidding_id and 
                t.farmer_id == farmer_id and 
                t.status == "success"),
            None
        )
        if deposit_transaction:
            result["has_deposit"] = True
        
        # 检查竞拍状态和时间
        bidding = self.get_bidding_info_by_id(bidding_id)
        if bidding:
            result["bidding_is_active"] = bidding.status == "active"
            now = datetime.now()
            result["bidding_in_time"] = bidding.start_time <= now <= bidding.end_time
        
        # 判断是否具备资格
        result["is_eligible"] = (
            result["is_registration_approved"] and 
            result["has_deposit"] and 
            result["bidding_is_active"] and 
            result["bidding_in_time"]
        )
        
        return result
    
    # 自动延长竞拍时间
    def check_and_extend_bidding_time(self, bidding_id: str) -> Optional[BiddingInfo]:
        """检查并延长竞拍时间（最后5分钟内有新报价则延长5分钟）"""
        bidding = self.get_bidding_info_by_id(bidding_id)
        if not bidding or bidding.status != "进行中":
            return None
        
        now = datetime.now()
        # 检查是否在最后5分钟内
        if bidding.end_time - now <= timedelta(minutes=5):
            # 检查最后5分钟内是否有新报价
            recent_bids = [
                bid for bid in self.bid_records_db.values()
                if bid.bidding_id == bidding_id and 
                   bid.bid_time >= bidding.end_time - timedelta(minutes=5)
            ]
            
            if recent_bids:
                # 延长5分钟
                bidding.end_time += timedelta(minutes=5)
                bidding.update_time = datetime.now()
                self.bidding_info_db[bidding.id] = bidding
                return bidding
        
        return None


# 创建服务实例供导入使用
land_bidding_service = LandBiddingService()