# 融资确权管理模块API路由
import sys
import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from datetime import datetime, timedelta

# 导入服务和模型
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.financing_management import (
    AllocatedLandInfo, 
    MortgageFinancingProject, 
    FinancingProjectNode,
    FinancingProjectLedger, 
    PostInvestmentRightTask, 
    DigitalCertificate,
    FundSupervision, 
    RepaymentAlert,
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
    CreateRepaymentAlertRequest, 
    UpdateRepaymentAlertRequest,
    FinancingProjectQueryRequest,
    ProjectStatusEnum, 

    TaskStatusEnum,
    CertificateStatusEnum, 
    AlertStatusEnum,
    RecordTypeEnum
)
from services.financing_management_service import financing_management_service

# 创建路由实例
router = APIRouter(
    prefix="/api/financing",
    tags=["Financing Management"],
    responses={404: {"description": "Not found"}}
)


# 确权地块信息管理路由
@router.get("/allocated-lands", response_model=List[AllocatedLandInfo])
def get_allocated_lands(
    land_id: Optional[str] = None,
    farmer_id: Optional[str] = None,
    status: Optional[str] = None,
    allocation_date_from: Optional[datetime] = None,
    allocation_date_to: Optional[datetime] = None
):
    """获取确权地块信息列表"""
    return financing_management_service.get_allocated_lands(land_id, farmer_id, status, allocation_date_from, allocation_date_to)


@router.get("/allocated-lands/{land_id}", response_model=AllocatedLandInfo)
def get_allocated_land_by_id(land_id: str):
    """根据ID获取确权地块信息"""
    land = financing_management_service.get_allocated_land_by_id(land_id)
    if not land:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Allocated land with id {land_id} not found"
        )
    return land


@router.post("/allocated-lands", response_model=AllocatedLandInfo, status_code=status.HTTP_201_CREATED)
def create_allocated_land(request: CreateAllocatedLandInfoRequest):
    """创建确权地块信息"""
    land = financing_management_service.create_allocated_land(request)
    if not land:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create allocated land information"
        )
    return land


@router.put("/allocated-lands/{land_id}", response_model=AllocatedLandInfo)
def update_allocated_land(land_id: str, request: UpdateAllocatedLandInfoRequest):
    """更新确权地块信息"""
    land = financing_management_service.update_allocated_land(land_id, request)
    if not land:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Allocated land with id {land_id} not found"
        )
    return land


@router.delete("/allocated-lands/{land_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_allocated_land(land_id: str):
    """删除确权地块信息"""
    success = financing_management_service.delete_allocated_land(land_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete allocated land with id {land_id} as it is involved in financing projects"
        )


# 抵押融资项目管理路由
@router.get("/projects", response_model=List[MortgageFinancingProject])
def get_projects(
    project_name: Optional[str] = None,
    farmer_id: Optional[str] = None,
    status: Optional[str] = None,
    start_date_from: Optional[datetime] = None,
    start_date_to: Optional[datetime] = None
):
    """获取抵押融资项目列表"""
    return financing_management_service.get_projects(project_name, farmer_id, status, start_date_from, start_date_to)


@router.get("/projects/{project_id}", response_model=MortgageFinancingProject)
def get_project_by_id(project_id: str):
    """根据ID获取抵押融资项目"""
    project = financing_management_service.get_project_by_id(project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found"
        )
    return project


@router.post("/projects", response_model=MortgageFinancingProject, status_code=status.HTTP_201_CREATED)
def create_project(request: CreateMortgageFinancingProjectRequest):
    """创建抵押融资项目"""
    # 检查关联的确权地块是否存在
    for land_id in request.land_ids:
        if not financing_management_service.get_allocated_land_by_id(land_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Allocated land with id {land_id} not found"
            )
    
    project = financing_management_service.create_project(request)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create mortgage financing project"
        )
    
    # 自动创建项目节点
    financing_management_service.generate_project_nodes(project.id)
    
    return project


@router.put("/projects/{project_id}", response_model=MortgageFinancingProject)
def update_project(project_id: str, request: UpdateMortgageFinancingProjectRequest):
    """更新抵押融资项目"""
    project = financing_management_service.update_project(project_id, request)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found"
        )
    return project


@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: str):
    """删除抵押融资项目"""
    success = financing_management_service.delete_project(project_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete project with id {project_id} as it has active nodes or transactions"
        )


# 项目节点管理路由
@router.get("/projects/{project_id}/nodes", response_model=List[FinancingProjectNode])
def get_project_nodes(project_id: str):
    """获取项目相关节点列表"""
    if project_id not in financing_management_service.projects_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found"
        )
    return financing_management_service.get_project_nodes(project_id)


@router.get("/nodes/{node_id}", response_model=FinancingProjectNode)
def get_project_node_by_id(node_id: str):
    """根据ID获取项目节点"""
    node = financing_management_service.get_project_node_by_id(node_id)
    if not node:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project node with id {node_id} not found"
        )
    return node


@router.post("/projects/{project_id}/nodes", response_model=FinancingProjectNode, status_code=status.HTTP_201_CREATED)
def create_project_node(project_id: str, request: CreateFinancingProjectNodeRequest):
    """为项目创建节点信息"""
    if project_id not in financing_management_service.projects_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found"
        )
    
    # 设置项目ID
    updated_request = request.copy(update={"project_id": project_id})
    
    node = financing_management_service.create_project_node(updated_request)
    if not node:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create project node"
        )
    return node


@router.put("/nodes/{node_id}", response_model=FinancingProjectNode)
def update_project_node(node_id: str, request: UpdateFinancingProjectNodeRequest):
    """更新项目节点"""
    node = financing_management_service.update_project_node(node_id, request)
    if not node:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project node with id {node_id} not found"
        )
    return node


# 项目节点状态更新路由
@router.post("/nodes/{node_id}/update-status")
def update_node_status(node_id: str, status: str, remark: Optional[str] = None):
    """更新项目节点状态"""
    node = financing_management_service.get_project_node_by_id(node_id)
    if not node:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project node with id {node_id} not found"
        )
    
    success = financing_management_service.update_node_status(node_id, status, remark)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update status for node with id {node_id}"
        )
    
    # 获取更新后的节点信息
    updated_node = financing_management_service.get_project_node_by_id(node_id)
    return updated_node


# 台账管理路由
@router.get("/ledgers", response_model=List[FinancingProjectLedger])
def get_ledgers(
    project_id: Optional[str] = None,
    ledger_type: Optional[str] = None,
    create_time_from: Optional[datetime] = None,
    create_time_to: Optional[datetime] = None
):
    """获取台账列表"""
    return financing_management_service.get_ledgers(project_id, ledger_type, create_time_from, create_time_to)


@router.get("/ledgers/{ledger_id}", response_model=FinancingProjectLedger)
def get_ledger_by_id(ledger_id: str):
    """根据ID获取台账"""
    ledger = financing_management_service.get_ledger_by_id(ledger_id)
    if not ledger:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Financing project ledger with id {ledger_id} not found"
        )
    return ledger


@router.post("/ledgers", response_model=FinancingProjectLedger, status_code=status.HTTP_201_CREATED)
def create_ledger(request: CreateFinancingProjectLedgerRequest):
    """创建台账"""
    # 检查项目是否存在
    project_id = request.project_id
    if not financing_management_service.get_project_by_id(project_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found"
        )
    
    ledger = financing_management_service.create_ledger(request)
    if not ledger:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create financing project ledger"
        )
    return ledger


@router.put("/ledgers/{ledger_id}", response_model=FinancingProjectLedger)
def update_ledger(ledger_id: str, request: UpdateFinancingProjectLedgerRequest):
    """更新台账"""
    ledger = financing_management_service.update_ledger(ledger_id, request)
    if not ledger:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Financing project ledger with id {ledger_id} not found"
        )
    return ledger


# 投后确权任务管理路由
@router.get("/post-investment-tasks", response_model=List[PostInvestmentRightTask])
def get_post_investment_tasks(
    project_id: Optional[str] = None,
    status: Optional[str] = None,
    due_date_from: Optional[datetime] = None,
    due_date_to: Optional[datetime] = None
):
    """获取投后确权任务列表"""
    return financing_management_service.get_post_investment_tasks(project_id, status, due_date_from, due_date_to)


@router.get("/post-investment-tasks/{task_id}", response_model=PostInvestmentRightTask)
def get_post_investment_task_by_id(task_id: str):
    """根据ID获取投后确权任务"""
    task = financing_management_service.get_post_investment_task_by_id(task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Post-investment task with id {task_id} not found"
        )
    return task


@router.post("/post-investment-tasks", response_model=PostInvestmentRightTask, status_code=status.HTTP_201_CREATED)
def create_post_investment_task(request: CreatePostInvestmentRightTaskRequest):
    """创建投后确权任务"""
    # 检查项目是否存在
    project_id = request.project_id
    if not financing_management_service.get_project_by_id(project_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found"
        )
    
    task = financing_management_service.create_post_investment_task(request)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create post-investment task"
        )
    return task


@router.put("/post-investment-tasks/{task_id}", response_model=PostInvestmentRightTask)
def update_post_investment_task(task_id: str, request: UpdatePostInvestmentRightTaskRequest):
    """更新投后确权任务"""
    task = financing_management_service.update_post_investment_task(task_id, request)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Post-investment task with id {task_id} not found"
        )
    return task


# 数字证书管理路由
@router.get("/certificates", response_model=List[DigitalCertificate])
def get_digital_certificates(
    project_id: Optional[str] = None,
    farmer_id: Optional[str] = None,
    status: Optional[str] = None,
    issue_date_from: Optional[datetime] = None,
    issue_date_to: Optional[datetime] = None
):
    """获取数字证书列表"""
    return financing_management_service.get_digital_certificates(project_id, farmer_id, status, issue_date_from, issue_date_to)


@router.get("/certificates/{certificate_id}", response_model=DigitalCertificate)
def get_digital_certificate_by_id(certificate_id: str):
    """根据ID获取数字证书"""
    certificate = financing_management_service.get_digital_certificate_by_id(certificate_id)
    if not certificate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Digital certificate with id {certificate_id} not found"
        )
    return certificate


@router.post("/certificates", response_model=DigitalCertificate, status_code=status.HTTP_201_CREATED)
def create_digital_certificate(request: CreateDigitalCertificateRequest):
    """创建数字证书"""
    # 检查项目是否存在
    project_id = request.project_id
    if not financing_management_service.get_project_by_id(project_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found"
        )
    
    certificate = financing_management_service.create_digital_certificate(request)
    if not certificate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create digital certificate"
        )
    return certificate


@router.put("/certificates/{certificate_id}", response_model=DigitalCertificate)
def update_digital_certificate(certificate_id: str, request: UpdateDigitalCertificateRequest):
    """更新数字证书"""
    certificate = financing_management_service.update_digital_certificate(certificate_id, request)
    if not certificate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Digital certificate with id {certificate_id} not found"
        )
    return certificate


# 资金监管管理路由
@router.get("/fund-supervisions", response_model=List[FundSupervision])
def get_fund_supervisions(
    project_id: Optional[str] = None,
    is_abnormal: Optional[bool] = None,
    start_time_from: Optional[datetime] = None,
    start_time_to: Optional[datetime] = None
):
    """获取资金监管列表"""
    return financing_management_service.get_fund_supervisions(project_id, is_abnormal, start_time_from, start_time_to)


@router.get("/fund-supervisions/{supervision_id}", response_model=FundSupervision)
def get_fund_supervision_by_id(supervision_id: str):
    """根据ID获取资金监管"""
    supervision = financing_management_service.get_fund_supervision_by_id(supervision_id)
    if not supervision:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Fund supervision with id {supervision_id} not found"
        )
    return supervision


@router.post("/fund-supervisions", response_model=FundSupervision, status_code=status.HTTP_201_CREATED)
def create_fund_supervision(request: CreateFundSupervisionRequest):
    """创建资金监管"""
    # 检查项目是否存在
    project_id = request.project_id
    if not financing_management_service.get_project_by_id(project_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found"
        )
    
    supervision = financing_management_service.create_fund_supervision(request)
    if not supervision:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create fund supervision"
        )
    return supervision


@router.put("/fund-supervisions/{supervision_id}", response_model=FundSupervision)
def update_fund_supervision(supervision_id: str, request: UpdateFundSupervisionRequest):
    """更新资金监管"""
    supervision = financing_management_service.update_fund_supervision(supervision_id, request)
    if not supervision:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Fund supervision with id {supervision_id} not found"
        )
    return supervision


# 还款提醒管理路由
@router.get("/repayment-alerts", response_model=List[RepaymentAlert])
def get_repayment_alerts(
    project_id: Optional[str] = None,
    status: Optional[str] = None,
    alert_time_from: Optional[datetime] = None,
    alert_time_to: Optional[datetime] = None
):
    """获取还款提醒列表"""
    return financing_management_service.get_repayment_alerts(project_id, status, alert_time_from, alert_time_to)


@router.get("/repayment-alerts/{alert_id}", response_model=RepaymentAlert)
def get_repayment_alert_by_id(alert_id: str):
    """根据ID获取还款提醒"""
    alert = financing_management_service.get_repayment_alert_by_id(alert_id)
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repayment alert with id {alert_id} not found"
        )
    return alert


@router.post("/repayment-alerts", response_model=RepaymentAlert, status_code=status.HTTP_201_CREATED)
def create_repayment_alert(request: CreateRepaymentAlertRequest):
    """创建还款提醒"""
    # 检查项目是否存在
    project_id = request.project_id
    if not financing_management_service.get_project_by_id(project_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found"
        )
    
    alert = financing_management_service.create_repayment_alert(request)
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create repayment alert"
        )
    return alert


@router.put("/repayment-alerts/{alert_id}", response_model=RepaymentAlert)
def update_repayment_alert(alert_id: str, request: UpdateRepaymentAlertRequest):
    """更新还款提醒"""
    alert = financing_management_service.update_repayment_alert(alert_id, request)
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repayment alert with id {alert_id} not found"
        )
    return alert


# 高级查询路由
@router.post("/projects/query", response_model=List[MortgageFinancingProject])
def query_projects(request: FinancingProjectQueryRequest):
    """高级查询项目信息"""
    return financing_management_service.query_projects(request)


# 批量操作路由
@router.post("/allocated-lands/batch", status_code=status.HTTP_201_CREATED)
def batch_create_allocated_lands(requests: List[CreateAllocatedLandInfoRequest]):
    """批量创建确权地块信息"""
    created_lands = []
    for req in requests:
        land = financing_management_service.create_allocated_land(req)
        if land:
            created_lands.append(land)
    return {
        "created_count": len(created_lands),
        "created_ids": [l.id for l in created_lands]
    }


# 项目统计路由
@router.get("/statistics/projects")
def get_project_statistics():
    """获取项目统计信息"""
    return financing_management_service.get_project_statistics()


@router.get("/statistics/farmers")
def get_farmer_financing_summary():
    """获取农户融资汇总信息"""
    return financing_management_service.get_farmer_financing_summary()


# 生成还款计划路由
@router.post("/projects/{project_id}/generate-repayment-schedule")
def generate_repayment_schedule(project_id: str):
    """为项目生成还款计划"""
    project = financing_management_service.get_project_by_id(project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found"
        )
    
    # 生成还款计划并创建还款提醒
    alerts = financing_management_service.generate_repayment_schedule(project_id)
    if not alerts:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to generate repayment schedule for project {project_id}"
        )
    return alerts


# 导出数据路由
@router.get("/export/projects")
def export_projects():
    """导出项目数据"""
    file_path = financing_management_service.export_projects()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }


@router.get("/export/allocated-lands")
def export_allocated_lands():
    """导出确权地块数据"""
    file_path = financing_management_service.export_allocated_lands()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }


@router.get("/export/ledgers")
def export_ledgers():
    """导出台账数据"""
    file_path = financing_management_service.export_ledgers()
    return {
        "file_path": file_path,
        "download_url": f"/download/{file_path.split('/')[-1]}"
    }