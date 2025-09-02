# 融资及确权管理模块服务层实现
import sys
import os
from typing import List, Optional, Dict, Tuple
from datetime import datetime, timedelta
import uuid

# 导入模型
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.financing_management import (
    AllocatedLandInfo,
    MortgageFinancingProject,
    FinancingProjectNode,
    FinancingProjectLedger,
    PostInvestmentRightTask,
    DigitalCertificate,
    FundSupervision,
    CreateAllocatedLandInfoRequest,
    UpdateAllocatedLandInfoRequest,
    CreateMortgageFinancingProjectRequest,
    UpdateMortgageFinancingProjectRequest,
    CreateFinancingProjectNodeRequest,
    UpdateFinancingProjectNodeRequest,
    CreateFinancingProjectLedgerRequest,
    UpdateFinancingProjectLedgerRequest,
    CreatePostInvestmentRightTaskRequest,
    UpdatePostInvestmentRightTaskRequest,
    CreateDigitalCertificateRequest,
    UpdateDigitalCertificateRequest,
    CreateFundSupervisionRequest,
    UpdateFundSupervisionRequest,
)

# 临时定义RepaymentReminder相关类，因为模型层中不存在这些类
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class RepaymentReminder(BaseModel):
    id: str = Field(..., description="提醒ID")
    project_id: str = Field(..., description="项目ID")
    reminder_type: str = Field(..., description="提醒类型")
    reminder_date: datetime = Field(..., description="提醒日期")
    due_date: datetime = Field(..., description="到期日期")
    reminder_amount: float = Field(..., description="提醒金额")
    status: str = Field(..., description="状态")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")

class CreateRepaymentReminderRequest(BaseModel):
    project_id: str = Field(..., description="项目ID")
    reminder_type: str = Field(..., description="提醒类型")
    reminder_date: Optional[datetime] = Field(None, description="提醒日期")
    due_date: datetime = Field(..., description="到期日期")
    reminder_amount: float = Field(..., description="提醒金额")

class UpdateRepaymentReminderRequest(BaseModel):
    reminder_type: Optional[str] = Field(None, description="提醒类型")
    reminder_date: Optional[datetime] = Field(None, description="提醒日期")
    due_date: Optional[datetime] = Field(None, description="到期日期")
    reminder_amount: Optional[float] = Field(None, description="提醒金额")
    status: Optional[str] = Field(None, description="状态")

class ProjectQueryRequest(BaseModel):
    farmer_ids: Optional[List[str]] = Field(None, description="农户ID列表")
    project_codes: Optional[List[str]] = Field(None, description="项目编码列表")
    project_statuses: Optional[List[str]] = Field(None, description="项目状态列表")
    application_date_from: Optional[datetime] = Field(None, description="申请日期开始")
    application_date_to: Optional[datetime] = Field(None, description="申请日期结束")


class FinancingManagementService:
    def __init__(self):
        # 模拟数据库存储
        self.allocated_lands_db: Dict[str, AllocatedLandInfo] = {}
        self.mortgage_projects_db: Dict[str, MortgageFinancingProject] = {}
        self.project_nodes_db: Dict[str, FinancingProjectNode] = {}
        self.ledgers_db: Dict[str, FinancingProjectLedger] = {}
        self.post_investment_tasks_db: Dict[str, PostInvestmentRightTask] = {}
        self.digital_certificates_db: Dict[str, DigitalCertificate] = {}
        self.fund_supervisions_db: Dict[str, FundSupervision] = {}
        self.repayment_reminders_db: Dict[str, RepaymentReminder] = {}
        # 初始化一些测试数据
        self._init_test_data()
    
    def _init_test_data(self):
        # 初始化分配土地信息数据
        allocated_land = AllocatedLandInfo(
            id=str(uuid.uuid4()),
            land_code="land001",
            land_name="测试土地",
            location="新疆阿克苏地区",
            area=100.5,
            unit="亩",
            land_type="耕地",
            ownership_type="集体所有",
            digitization_status="已数字化",
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.allocated_lands_db[allocated_land.id] = allocated_land
        
        # 初始化抵押融资项目数据
        project = MortgageFinancingProject(
            id=str(uuid.uuid4()),
            project_name="测试抵押融资项目",
            project_code="project001",
            borrower_id="farmer001",
            borrower_name="农户张三",
            loan_amount=500000.0,
            loan_term=36,  # 36个月
            interest_rate=4.2,
            collateral_type="土地使用权",
            collateral_value=1000000.0,
            project_status="待审批",
            apply_time=datetime(2023, 4, 1),
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.mortgage_projects_db[project.id] = project
    
    # 分配土地信息管理
    def get_allocated_lands(self, 
                          user_id: Optional[str] = None, 
                          land_id: Optional[str] = None, 
                          land_status: Optional[str] = None) -> List[AllocatedLandInfo]:
        """获取所有分配土地信息"""
        allocated_lands = list(self.allocated_lands_db.values())
        
        if user_id:
            allocated_lands = [a for a in allocated_lands if a.user_id == user_id]
        if land_id:
            allocated_lands = [a for a in allocated_lands if a.land_id == land_id]
        if land_status:
            allocated_lands = [a for a in allocated_lands if a.land_status == land_status]
            
        # 按分配日期倒序排序
        allocated_lands.sort(key=lambda x: x.allocation_date, reverse=True)
        return allocated_lands
    
    def get_allocated_land_by_id(self, allocated_land_id: str) -> Optional[AllocatedLandInfo]:
        """根据ID获取分配土地信息"""
        return self.allocated_lands_db.get(allocated_land_id)
    
    def create_allocated_land(self, request: CreateAllocatedLandInfoRequest) -> AllocatedLandInfo:
        """创建分配土地信息"""
        allocated_land = AllocatedLandInfo(
            id=str(uuid.uuid4()),
            land_id=request.land_id,
            user_id=request.user_id,
            allocation_date=request.allocation_date or datetime.now(),
            allocation_period=request.allocation_period,
            land_status="allocated",
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.allocated_lands_db[allocated_land.id] = allocated_land
        return allocated_land
    
    def update_allocated_land(self, allocated_land_id: str, request: UpdateAllocatedLandInfoRequest) -> Optional[AllocatedLandInfo]:
        """更新分配土地信息"""
        if allocated_land_id not in self.allocated_lands_db:
            return None
        
        allocated_land = self.allocated_lands_db[allocated_land_id]
        if request.land_id:
            allocated_land.land_id = request.land_id
        if request.user_id:
            allocated_land.user_id = request.user_id
        if request.allocation_date:
            allocated_land.allocation_date = request.allocation_date
        if request.allocation_period is not None:
            allocated_land.allocation_period = request.allocation_period
        if request.land_status:
            allocated_land.land_status = request.land_status
        allocated_land.update_time = datetime.now()
        
        self.allocated_lands_db[allocated_land_id] = allocated_land
        return allocated_land
    
    def delete_allocated_land(self, allocated_land_id: str) -> bool:
        """删除分配土地信息"""
        if allocated_land_id not in self.allocated_lands_db:
            return False
        
        # 检查是否有相关的融资项目
        for project in self.mortgage_projects_db.values():
            if project.allocated_land_id == allocated_land_id and project.project_status != "completed":
                return False
        
        del self.allocated_lands_db[allocated_land_id]
        return True
    
    # 抵押融资项目管理
    def get_mortgage_projects(self, 
                            user_id: Optional[str] = None, 
                            allocated_land_id: Optional[str] = None, 
                            project_status: Optional[str] = None, 
                            application_date_from: Optional[datetime] = None, 
                            application_date_to: Optional[datetime] = None) -> List[MortgageFinancingProject]:
        """获取所有抵押融资项目"""
        projects = list(self.mortgage_projects_db.values())
        
        if user_id:
            projects = [p for p in projects if p.user_id == user_id]
        if allocated_land_id:
            projects = [p for p in projects if p.allocated_land_id == allocated_land_id]
        if project_status:
            projects = [p for p in projects if p.project_status == project_status]
        if application_date_from:
            projects = [p for p in projects if p.application_date >= application_date_from]
        if application_date_to:
            projects = [p for p in projects if p.application_date <= application_date_to]
            
        # 按申请日期倒序排序
        projects.sort(key=lambda x: x.application_date, reverse=True)
        return projects
    
    def get_mortgage_project_by_id(self, project_id: str) -> Optional[MortgageFinancingProject]:
        """根据ID获取抵押融资项目"""
        return self.mortgage_projects_db.get(project_id)
    
    def create_mortgage_project(self, request: CreateMortgageFinancingProjectRequest) -> Optional[MortgageFinancingProject]:
        """创建抵押融资项目"""
        # 检查分配土地信息是否存在且状态为已分配
        if request.allocated_land_id not in self.allocated_lands_db:
            return None
        
        allocated_land = self.allocated_lands_db[request.allocated_land_id]
        if allocated_land.land_status != "allocated":
            return None
        
        # 生成项目编号
        project_code = f"PROJ-{datetime.now().year}-{str(len(self.mortgage_projects_db) + 1).zfill(4)}"
        
        project = MortgageFinancingProject(
            id=str(uuid.uuid4()),
            project_code=project_code,
            user_id=request.user_id,
            allocated_land_id=request.allocated_land_id,
            project_name=request.project_name,
            application_date=request.application_date or datetime.now(),
            financing_amount=request.financing_amount,
            financing_term=request.financing_term,
            interest_rate=request.interest_rate,
            project_status="pending_review",
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.mortgage_projects_db[project.id] = project
        
        # 创建项目初始节点
        self._create_initial_project_nodes(project.id)
        
        return project
    
    def update_mortgage_project(self, project_id: str, request: UpdateMortgageFinancingProjectRequest) -> Optional[MortgageFinancingProject]:
        """更新抵押融资项目"""
        if project_id not in self.mortgage_projects_db:
            return None
        
        project = self.mortgage_projects_db[project_id]
        
        if request.project_name:
            project.project_name = request.project_name
        if request.financing_amount is not None:
            project.financing_amount = request.financing_amount
        if request.financing_term is not None:
            project.financing_term = request.financing_term
        if request.interest_rate is not None:
            project.interest_rate = request.interest_rate
        if request.project_status:
            project.project_status = request.project_status
            # 更新项目状态时，创建相应的项目节点
            self._create_project_node(project.id, request.project_status)
        if request.remark:
            project.remark = request.remark
        project.update_time = datetime.now()
        
        self.mortgage_projects_db[project_id] = project
        return project
    
    def delete_mortgage_project(self, project_id: str) -> bool:
        """删除抵押融资项目"""
        if project_id not in self.mortgage_projects_db:
            return False
        
        # 检查项目状态
        project = self.mortgage_projects_db[project_id]
        if project.project_status not in ["pending_review", "rejected"]:
            return False
        
        # 删除相关的项目节点、台账、投后确权任务等
        self._delete_project_related_data(project_id)
        
        del self.mortgage_projects_db[project_id]
        return True
    
    # 项目节点管理
    def get_project_nodes(self, 
                         project_id: Optional[str] = None, 
                         node_type: Optional[str] = None, 
                         status: Optional[str] = None) -> List[FinancingProjectNode]:
        """获取所有项目节点"""
        nodes = list(self.project_nodes_db.values())
        
        if project_id:
            nodes = [n for n in nodes if n.project_id == project_id]
        if node_type:
            nodes = [n for n in nodes if n.node_type == node_type]
        if status:
            nodes = [n for n in nodes if n.status == status]
            
        # 按创建时间排序
        nodes.sort(key=lambda x: x.create_time)
        return nodes
    
    def get_project_node_by_id(self, node_id: str) -> Optional[FinancingProjectNode]:
        """根据ID获取项目节点"""
        return self.project_nodes_db.get(node_id)
    
    def create_project_node(self, request: CreateFinancingProjectNodeRequest) -> Optional[FinancingProjectNode]:
        """创建项目节点"""
        # 检查项目是否存在
        if request.project_id not in self.mortgage_projects_db:
            return None
        
        node = FinancingProjectNode(
            id=str(uuid.uuid4()),
            project_id=request.project_id,
            node_type=request.node_type,
            status="pending",
            start_time=request.start_time or datetime.now(),
            end_time=request.end_time,
            create_time=datetime.now(),
            update_time=datetime.now()
        )
        self.project_nodes_db[node.id] = node
        return node
    
    def update_project_node(self, node_id: str, request: UpdateFinancingProjectNodeRequest) -> Optional[FinancingProjectNode]:
        """更新项目节点"""
        if node_id not in self.project_nodes_db:
            return None
        
        node = self.project_nodes_db[node_id]
        if request.node_type:
            node.node_type = request.node_type
        if request.status:
            node.status = request.status
        if request.start_time:
            node.start_time = request.start_time
        if request.end_time:
            node.end_time = request.end_time
        if request.remark:
            node.remark = request.remark
        node.update_time = datetime.now()
        
        self.project_nodes_db[node_id] = node
        return node
    
    # 台账管理
    def get_ledgers(self, 
                   project_id: Optional[str] = None, 
                   ledger_type: Optional[str] = None, 
                   record_date_from: Optional[datetime] = None, 
                   record_date_to: Optional[datetime] = None) -> List[FinancingProjectLedger]:
        """获取所有台账记录"""
        ledgers = list(self.ledgers_db.values())
        
        if project_id:
            ledgers = [l for l in ledgers if l.project_id == project_id]
        if ledger_type:
            ledgers = [l for l in ledgers if l.record_type == ledger_type]
        if record_date_from:
            ledgers = [l for l in ledgers if l.record_time >= record_date_from]
        if record_date_to:
            ledgers = [l for l in ledgers if l.record_time <= record_date_to]
            
        # 按记录日期倒序排序
        ledgers.sort(key=lambda x: x.record_time, reverse=True)
        return ledgers
    
    def get_ledger_by_id(self, ledger_id: str) -> Optional[FinancingProjectLedger]:
        """根据ID获取台账记录"""
        return self.ledgers_db.get(ledger_id)
    
    def create_ledger(self, request: CreateFinancingProjectLedgerRequest) -> Optional[FinancingProjectLedger]:
        """创建台账记录"""
        # 检查项目是否存在
        if request.project_id not in self.mortgage_projects_db:
            return None
        
        ledger = FinancingProjectLedger(
            id=str(uuid.uuid4()),
            project_id=request.project_id,
            record_type=request.record_type,
            amount=request.amount,
            record_time=request.record_time or datetime.now(),
            description=request.description,
            create_time=datetime.now()
        )
        self.ledgers_db[ledger.id] = ledger
        return ledger
    
    def update_ledger(self, ledger_id: str, request: UpdateFinancingProjectLedgerRequest) -> Optional[FinancingProjectLedger]:
        """更新台账记录"""
        if ledger_id not in self.ledgers_db:
            return None
        
        ledger = self.ledgers_db[ledger_id]
        if request.record_type:
            ledger.record_type = request.record_type
        if request.amount is not None:
            ledger.amount = request.amount
        if request.record_time:
            ledger.record_time = request.record_time
        if request.description:
            ledger.description = request.description
        
        self.ledgers_db[ledger_id] = ledger
        return ledger
    
    # 投后确权任务管理
    def get_post_investment_tasks(self, 
                                project_id: Optional[str] = None, 
                                task_type: Optional[str] = None, 
                                task_status: Optional[str] = None, 
                                due_date_from: Optional[datetime] = None, 
                                due_date_to: Optional[datetime] = None) -> List[PostInvestmentRightTask]:
        """获取所有投后确权任务"""
        tasks = list(self.post_investment_tasks_db.values())
        
        if project_id:
            tasks = [t for t in tasks if t.project_id == project_id]
        if task_type:
            tasks = [t for t in tasks if t.task_type == task_type]
        if task_status:
            tasks = [t for t in tasks if t.task_status == task_status]
        if due_date_from:
            tasks = [t for t in tasks if t.due_date >= due_date_from]
        if due_date_to:
            tasks = [t for t in tasks if t.due_date <= due_date_to]
            
        # 按到期日期排序
        tasks.sort(key=lambda x: x.due_date)
        return tasks
    
    def get_post_investment_task_by_id(self, task_id: str) -> Optional[PostInvestmentRightTask]:
        """根据ID获取投后确权任务"""
        return self.post_investment_tasks_db.get(task_id)
    
    def create_post_investment_task(self, request: CreatePostInvestmentRightTaskRequest) -> Optional[PostInvestmentRightTask]:
        """创建投后确权任务"""
        # 检查项目是否存在
        if request.project_id not in self.mortgage_projects_db:
            return None
        
        task = PostInvestmentRightTask(
            id=str(uuid.uuid4()),
            project_id=request.project_id,
            task_type=request.task_type,
            task_name=request.task_name,
            assignee_id=request.assignee_id,
            due_date=request.due_date,
            task_status="pending",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        self.post_investment_tasks_db[task.id] = task
        return task
    
    def update_post_investment_task(self, task_id: str, request: UpdatePostInvestmentRightTaskRequest) -> Optional[PostInvestmentRightTask]:
        """更新投后确权任务"""
        if task_id not in self.post_investment_tasks_db:
            return None
        
        task = self.post_investment_tasks_db[task_id]
        if request.task_type:
            task.task_type = request.task_type
        if request.task_name:
            task.task_name = request.task_name
        if request.assignee_id:
            task.assignee_id = request.assignee_id
        if request.due_date:
            task.due_date = request.due_date
        if request.task_status:
            task.task_status = request.task_status
        if request.completion_date:
            task.completion_date = request.completion_date
        if request.remark:
            task.remark = request.remark
        task.updated_at = datetime.now()
        
        self.post_investment_tasks_db[task_id] = task
        return task
    
    # 数字证书管理
    def get_digital_certificates(self, 
                               project_id: Optional[str] = None, 
                               farmer_id: Optional[str] = None, 
                               certificate_status: Optional[str] = None) -> List[DigitalCertificate]:
        """获取所有数字证书"""
        certificates = list(self.digital_certificates_db.values())
        
        if project_id:
            certificates = [c for c in certificates if c.project_id == project_id]
        if farmer_id:
            certificates = [c for c in certificates if c.farmer_id == farmer_id]
        if certificate_status:
            certificates = [c for c in certificates if c.certificate_status == certificate_status]
            
        # 按颁发日期倒序排序
        certificates.sort(key=lambda x: x.issue_date, reverse=True)
        return certificates
    
    def get_digital_certificate_by_id(self, certificate_id: str) -> Optional[DigitalCertificate]:
        """根据ID获取数字证书"""
        return self.digital_certificates_db.get(certificate_id)
    
    def create_digital_certificate(self, request: CreateDigitalCertificateRequest) -> Optional[DigitalCertificate]:
        """创建数字证书"""
        # 检查项目是否存在
        if request.project_id not in self.mortgage_projects_db:
            return None
        
        certificate = DigitalCertificate(
            id=str(uuid.uuid4()),
            project_id=request.project_id,
            farmer_id=request.farmer_id,
            certificate_number=request.certificate_number,
            issue_date=request.issue_date or datetime.now(),
            expiry_date=request.expiry_date,
            certificate_status="active",
            file_path=request.file_path,
            created_at=datetime.now()
        )
        self.digital_certificates_db[certificate.id] = certificate
        return certificate
    
    def update_digital_certificate(self, certificate_id: str, request: UpdateDigitalCertificateRequest) -> Optional[DigitalCertificate]:
        """更新数字证书"""
        if certificate_id not in self.digital_certificates_db:
            return None
        
        certificate = self.digital_certificates_db[certificate_id]
        if request.certificate_number:
            certificate.certificate_number = request.certificate_number
        if request.issue_date:
            certificate.issue_date = request.issue_date
        if request.expiry_date:
            certificate.expiry_date = request.expiry_date
        if request.certificate_status:
            certificate.certificate_status = request.certificate_status
        if request.file_path:
            certificate.file_path = request.file_path
        
        self.digital_certificates_db[certificate_id] = certificate
        return certificate
    
    # 资金监管管理
    def get_fund_supervisions(self, 
                             project_id: Optional[str] = None, 
                             supervision_type: Optional[str] = None, 
                             status: Optional[str] = None) -> List[FundSupervision]:
        """获取所有资金监管记录"""
        supervisions = list(self.fund_supervisions_db.values())
        
        if project_id:
            supervisions = [s for s in supervisions if s.project_id == project_id]
        if supervision_type:
            supervisions = [s for s in supervisions if s.supervision_type == supervision_type]
        if status:
            supervisions = [s for s in supervisions if s.status == status]
            
        # 按监管日期倒序排序
        supervisions.sort(key=lambda x: x.supervision_date, reverse=True)
        return supervisions
    
    def get_fund_supervision_by_id(self, supervision_id: str) -> Optional[FundSupervision]:
        """根据ID获取资金监管记录"""
        return self.fund_supervisions_db.get(supervision_id)
    
    def create_fund_supervision(self, request: CreateFundSupervisionRequest) -> Optional[FundSupervision]:
        """创建资金监管记录"""
        # 检查项目是否存在
        if request.project_id not in self.mortgage_projects_db:
            return None
        
        supervision = FundSupervision(
            id=str(uuid.uuid4()),
            project_id=request.project_id,
            supervision_type=request.supervision_type,
            supervision_date=request.supervision_date or datetime.now(),
            status="completed",
            findings=request.findings,
            created_at=datetime.now()
        )
        self.fund_supervisions_db[supervision.id] = supervision
        return supervision
    
    def update_fund_supervision(self, supervision_id: str, request: UpdateFundSupervisionRequest) -> Optional[FundSupervision]:
        """更新资金监管记录"""
        if supervision_id not in self.fund_supervisions_db:
            return None
        
        supervision = self.fund_supervisions_db[supervision_id]
        if request.supervision_type:
            supervision.supervision_type = request.supervision_type
        if request.supervision_date:
            supervision.supervision_date = request.supervision_date
        if request.status:
            supervision.status = request.status
        if request.findings:
            supervision.findings = request.findings
        if request.recommendations:
            supervision.recommendations = request.recommendations
        
        self.fund_supervisions_db[supervision_id] = supervision
        return supervision
    
    # 还款提醒管理
    def get_repayment_reminders(self, 
                              project_id: Optional[str] = None, 
                              reminder_type: Optional[str] = None, 
                              status: Optional[str] = None) -> List[RepaymentReminder]:
        """获取所有还款提醒"""
        reminders = list(self.repayment_reminders_db.values())
        
        if project_id:
            reminders = [r for r in reminders if r.project_id == project_id]
        if reminder_type:
            reminders = [r for r in reminders if r.reminder_type == reminder_type]
        if status:
            reminders = [r for r in reminders if r.status == status]
            
        # 按提醒日期倒序排序
        reminders.sort(key=lambda x: x.reminder_date, reverse=True)
        return reminders
    
    def get_repayment_reminder_by_id(self, reminder_id: str) -> Optional[RepaymentReminder]:
        """根据ID获取还款提醒"""
        return self.repayment_reminders_db.get(reminder_id)
    
    def create_repayment_reminder(self, request: CreateRepaymentReminderRequest) -> Optional[RepaymentReminder]:
        """创建还款提醒"""
        # 检查项目是否存在
        if request.project_id not in self.mortgage_projects_db:
            return None
        
        reminder = RepaymentReminder(
            id=str(uuid.uuid4()),
            project_id=request.project_id,
            reminder_type=request.reminder_type,
            reminder_date=request.reminder_date or datetime.now(),
            due_date=request.due_date,
            reminder_amount=request.reminder_amount,
            status="pending",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        self.repayment_reminders_db[reminder.id] = reminder
        return reminder
    
    def update_repayment_reminder(self, reminder_id: str, request: UpdateRepaymentReminderRequest) -> Optional[RepaymentReminder]:
        """更新还款提醒"""
        if reminder_id not in self.repayment_reminders_db:
            return None
        
        reminder = self.repayment_reminders_db[reminder_id]
        if request.reminder_type:
            reminder.reminder_type = request.reminder_type
        if request.reminder_date:
            reminder.reminder_date = request.reminder_date
        if request.due_date:
            reminder.due_date = request.due_date
        if request.reminder_amount is not None:
            reminder.reminder_amount = request.reminder_amount
        if request.status:
            reminder.status = request.status
        if request.sent_time:
            reminder.sent_time = request.sent_time
        reminder.updated_at = datetime.now()
        
        self.repayment_reminders_db[reminder_id] = reminder
        return reminder
    
    # 项目查询
    def query_projects(self, request: ProjectQueryRequest) -> List[MortgageFinancingProject]:
        """高级项目查询"""
        projects = list(self.mortgage_projects_db.values())
        
        # 应用查询条件
        if request.farmer_ids:
            projects = [p for p in projects if p.farmer_id in request.farmer_ids]
        if request.project_codes:
            projects = [p for p in projects if p.project_code in request.project_codes]
        if request.project_statuses:
            projects = [p for p in projects if p.project_status in request.project_statuses]
        if request.application_date_from:
            projects = [p for p in projects if p.application_date >= request.application_date_from]
        if request.application_date_to:
            projects = [p for p in projects if p.application_date <= request.application_date_to]
        if request.amount_from is not None:
            projects = [p for p in projects if p.financing_amount >= request.amount_from]
        if request.amount_to is not None:
            projects = [p for p in projects if p.financing_amount <= request.amount_to]
        if request.term_from is not None:
            projects = [p for p in projects if p.financing_term >= request.term_from]
        if request.term_to is not None:
            projects = [p for p in projects if p.financing_term <= request.term_to]
        
        # 排序
        if request.sort_by:
            try:
                projects.sort(key=lambda x: getattr(x, request.sort_by), reverse=request.sort_descending)
            except AttributeError:
                # 如果排序字段不存在，按申请日期倒序排序
                projects.sort(key=lambda x: x.application_date, reverse=True)
        else:
            # 默认按申请日期倒序排序
            projects.sort(key=lambda x: x.application_date, reverse=True)
        
        # 分页
        if request.page and request.page_size:
            start = (request.page - 1) * request.page_size
            end = start + request.page_size
            projects = projects[start:end]
        
        return projects
    
    # 创建项目初始节点
    def _create_initial_project_nodes(self, project_id: str) -> None:
        """创建项目的初始节点"""
        # 创建申请提交节点
        self.create_project_node(
            CreateFinancingProjectNodeRequest(
                project_id=project_id,
                node_type="application_submitted",
                status="completed",
                start_time=datetime.now(),
                end_time=datetime.now()
            )
        )
        
        # 创建待审核节点
        self.create_project_node(
            CreateFinancingProjectNodeRequest(
                project_id=project_id,
                node_type="pending_review",
                status="pending",
                start_time=datetime.now()
            )
        )
    
    # 创建项目节点
    def _create_project_node(self, project_id: str, node_type: str) -> None:
        """根据项目状态创建相应的项目节点"""
        # 查找当前项目的所有节点
        project_nodes = [n for n in self.project_nodes_db.values() if n.project_id == project_id]
        
        # 查找当前处于pending状态的节点
        pending_nodes = [n for n in project_nodes if n.status == "pending"]
        
        # 结束所有pending状态的节点
        for node in pending_nodes:
            node.status = "completed"
            node.end_time = datetime.now()
            node.updated_at = datetime.now()
            self.project_nodes_db[node.id] = node
        
        # 创建新的节点
        if node_type != "completed" and node_type != "rejected":
            self.create_project_node(
                CreateFinancingProjectNodeRequest(
                    project_id=project_id,
                    node_type=node_type,
                    status="pending",
                    start_time=datetime.now()
                )
            )
    
    # 删除项目相关的数据
    def _delete_project_related_data(self, project_id: str) -> None:
        """删除项目相关的所有数据"""
        # 删除相关的项目节点
        node_ids_to_delete = [n.id for n in self.project_nodes_db.values() if n.project_id == project_id]
        for node_id in node_ids_to_delete:
            del self.project_nodes_db[node_id]
        
        # 删除相关的台账记录
        ledger_ids_to_delete = [l.id for l in self.ledgers_db.values() if l.project_id == project_id]
        for ledger_id in ledger_ids_to_delete:
            del self.ledgers_db[ledger_id]
        
        # 删除相关的投后确权任务
        task_ids_to_delete = [t.id for t in self.post_investment_tasks_db.values() if t.project_id == project_id]
        for task_id in task_ids_to_delete:
            del self.post_investment_tasks_db[task_id]
        
        # 删除相关的数字证书
        certificate_ids_to_delete = [c.id for c in self.digital_certificates_db.values() if c.project_id == project_id]
        for certificate_id in certificate_ids_to_delete:
            del self.digital_certificates_db[certificate_id]
        
        # 删除相关的资金监管记录
        supervision_ids_to_delete = [s.id for s in self.fund_supervisions_db.values() if s.project_id == project_id]
        for supervision_id in supervision_ids_to_delete:
            del self.fund_supervisions_db[supervision_id]
        
        # 删除相关的还款提醒
        reminder_ids_to_delete = [r.id for r in self.repayment_reminders_db.values() if r.project_id == project_id]
        for reminder_id in reminder_ids_to_delete:
            del self.repayment_reminders_db[reminder_id]
    
    # 计算项目统计
    def get_project_statistics(self) -> Dict:
        """获取项目统计信息"""
        # 计算各状态的项目数量
        status_count = {}
        for project in self.mortgage_projects_db.values():
            status_count[project.project_status] = status_count.get(project.project_status, 0) + 1
        
        # 计算总融资金额
        total_amount = sum(project.financing_amount for project in self.mortgage_projects_db.values())
        
        # 计算平均融资期限和平均利率
        if len(self.mortgage_projects_db) > 0:
            avg_term = sum(project.financing_term for project in self.mortgage_projects_db.values()) / len(self.mortgage_projects_db)
            avg_rate = sum(project.interest_rate for project in self.mortgage_projects_db.values()) / len(self.mortgage_projects_db)
        else:
            avg_term = 0
            avg_rate = 0
        
        return {
            "total_projects": len(self.mortgage_projects_db),
            "status_count": status_count,
            "total_amount": total_amount,
            "avg_term": avg_term,
            "avg_rate": avg_rate
        }
    
    # 计算农户融资汇总
    def get_farmer_financing_summary(self, farmer_id: str) -> Dict:
        """获取农户融资汇总信息"""
        # 获取农户的所有融资项目
        farmer_projects = [p for p in self.mortgage_projects_db.values() if p.farmer_id == farmer_id]
        
        # 计算各状态的项目数量
        status_count = {}
        for project in farmer_projects:
            status_count[project.project_status] = status_count.get(project.project_status, 0) + 1
        
        # 计算总融资金额
        total_amount = sum(project.financing_amount for project in farmer_projects)
        
        # 计算已完成和进行中的项目数量
        completed_count = sum(1 for project in farmer_projects if project.project_status == "completed")
        in_progress_count = sum(1 for project in farmer_projects if project.project_status not in ["completed", "rejected"])
        
        return {
            "total_projects": len(farmer_projects),
            "status_count": status_count,
            "total_amount": total_amount,
            "completed_count": completed_count,
            "in_progress_count": in_progress_count
        }
    
    # 生成还款计划
    def generate_repayment_schedule(self, project_id: str) -> List[Dict]:
        """为项目生成还款计划"""
        if project_id not in self.mortgage_projects_db:
            return []
        
        project = self.mortgage_projects_db[project_id]
        schedule = []
        
        # 简化的等额本息还款计划生成
        principal = project.financing_amount
        monthly_rate = project.interest_rate / 12
        months = project.financing_term
        
        # 计算每月还款额
        if monthly_rate > 0:
            monthly_payment = principal * (monthly_rate * (1 + monthly_rate) ** months) / ((1 + monthly_rate) ** months - 1)
        else:
            monthly_payment = principal / months
        
        # 生成每月还款计划
        remaining_principal = principal
        for i in range(months):
            # 计算利息
            interest_payment = remaining_principal * monthly_rate
            # 计算本金
            principal_payment = monthly_payment - interest_payment
            # 更新剩余本金
            remaining_principal -= principal_payment
            
            # 计算还款日
            due_date = (datetime.now() + timedelta(days=30 * (i + 1))).replace(day=28)  # 简化为每月28日
            
            schedule.append({
                "month": i + 1,
                "due_date": due_date,
                "monthly_payment": round(monthly_payment, 2),
                "principal_payment": round(principal_payment, 2),
                "interest_payment": round(interest_payment, 2),
                "remaining_principal": round(remaining_principal, 2)
            })
        
        return schedule


# 创建服务实例供导入使用
financing_management_service = FinancingManagementService()