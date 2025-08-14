package com.example.metering_service.service;

import com.example.metering_service.model.MeteringRecord;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface MeteringService {

    /**
     * 记录资源使用量
     * @param meteringRecord 计量记录
     * @return 保存后的计量记录
     */
    MeteringRecord recordUsage(MeteringRecord meteringRecord);

    /**
     * 获取租户的资源使用统计
     * @param tenantId 租户ID
     * @param start 开始时间
     * @param end 结束时间
     * @return 按资源类型分组的使用统计
     */
    Map<String, Double> getUsageStatisticsByTenantId(Long tenantId, LocalDateTime start, LocalDateTime end);

    /**
     * 获取租户的资源使用统计
     * @param tenantCode 租户编码
     * @param start 开始时间
     * @param end 结束时间
     * @return 按资源类型分组的使用统计
     */
    Map<String, Double> getUsageStatisticsByTenantCode(String tenantCode, LocalDateTime start, LocalDateTime end);

    /**
     * 生成租户账单
     * @param tenantId 租户ID
     * @param start 账单开始时间
     * @param end 账单结束时间
     * @return 账单金额
     */
    Double generateBillByTenantId(Long tenantId, LocalDateTime start, LocalDateTime end);

    /**
     * 生成租户账单
     * @param tenantCode 租户编码
     * @param start 账单开始时间
     * @param end 账单结束时间
     * @return 账单金额
     */
    Double generateBillByTenantCode(String tenantCode, LocalDateTime start, LocalDateTime end);

    /**
     * 获取未结算的计量记录
     * @return 未结算的计量记录列表
     */
    List<MeteringRecord> getUnbilledRecords();

    /**
     * 标记计量记录为已结算
     * @param recordIds 计量记录ID列表
     */
    void markRecordsAsBilled(List<Long> recordIds);

    /**
     * 获取所有计量记录
     * @return 计量记录列表
     */
    List<MeteringRecord> getAllMeteringRecords();

    /**
     * 根据ID获取计量记录
     * @param id 计量记录ID
     * @return 计量记录
     */
    MeteringRecord getMeteringRecordById(Long id);

    /**
     * 删除计量记录
     * @param id 计量记录ID
     */
    void deleteMeteringRecord(Long id);
}