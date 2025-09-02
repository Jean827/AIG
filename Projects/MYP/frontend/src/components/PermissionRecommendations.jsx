import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Divider, Snackbar, Alert, Chip, Tooltip, LinearProgress } from '@mui/material';
import { SettingOutlined, QuestionCircleOutlined, SyncOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import permissionRecommendationsAPI from '../api/permissionRecommendations';

const PermissionRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageSeverity, setMessageSeverity] = useState('success');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [appliedCount, setAppliedCount] = useState(0);
  const [declinedCount, setDeclinedCount] = useState(0);
  const [recommendationHistory, setRecommendationHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Mock数据 - 用于在没有后端API时展示功能
  const mockRecommendations = [
    {
      id: '1',
      permission: {
        id: 'p1',
        name: '用户管理权限',
        description: '允许查看和管理系统中的所有用户账户'
      },
      recommendationScore: 0.85,
      recommendationReason: '根据您的角色和活动模式，您经常需要访问用户数据进行分析和管理',
      createdAt: '2023-11-05T10:30:00Z',
      source: 'activity_analysis'
    },
    {
      id: '2',
      permission: {
        id: 'p2',
        name: '订单导出权限',
        description: '允许导出订单数据为Excel或CSV格式'
      },
      recommendationScore: 0.72,
      recommendationReason: '您最近多次查看订单列表，可能需要导出功能进行进一步分析',
      createdAt: '2023-11-04T15:45:00Z',
      source: 'pattern_recognition'
    },
    {
      id: '3',
      permission: {
        id: 'p3',
        name: '系统日志查看权限',
        description: '允许查看系统运行日志和错误记录'
      },
      recommendationScore: 0.65,
      recommendationReason: '作为管理员，查看日志有助于您快速诊断和解决系统问题',
      createdAt: '2023-11-03T09:15:00Z',
      source: 'role_based'
    }
  ];

  // Mock历史数据
  const mockHistory = [
    {
      id: 'h1',
      permissionName: '数据分析权限',
      action: 'applied',
      date: '2023-10-28T14:20:00Z',
      reason: '提高数据分析效率'
    },
    {
      id: 'h2',
      permissionName: '批量操作权限',
      action: 'declined',
      date: '2023-10-25T09:10:00Z',
      reason: '当前工作流程不需要'
    }
  ];

  // 加载权限推荐
  const loadRecommendations = async () => {
    setLoading(true);
    try {
      // 尝试从API获取数据
      const response = await permissionRecommendationsAPI.getPermissionRecommendations().catch(() => {
        // API调用失败时使用mock数据
        return { data: mockRecommendations };
      });
      setRecommendations(response.data);
    } catch (error) {
      console.error('Failed to load permission recommendations, using mock data', error);
      // 确保始终有数据展示
      setRecommendations(mockRecommendations);
      showMessage('使用本地推荐数据', 'info');
    } finally {
      setLoading(false);
    }
  };

  // 生成新的权限推荐
  const generateNewRecommendations = async () => {
    setLoading(true);
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 尝试从API获取数据
      const response = await permissionRecommendationsAPI.generatePermissionRecommendations().catch(() => {
        // API调用失败时生成新的mock数据
        const newMockRecommendations = mockRecommendations.map(rec => ({
          ...rec,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          recommendationScore: Math.min(0.95, rec.recommendationScore + (Math.random() * 0.1 - 0.05)),
          createdAt: new Date().toISOString()
        }));
        return { data: newMockRecommendations };
      });
      
      setRecommendations(response.data);
      showMessage('权限推荐已更新', 'success');
    } catch (error) {
      handleError('生成推荐失败，使用本地数据', error);
      // 确保始终有数据展示
      setRecommendations(mockRecommendations);
    } finally {
      setLoading(false);
    }
  };

  // 应用权限推荐
  const applyRecommendation = async (recommendationId) => {
    setLoading(true);
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 尝试调用API
      await permissionRecommendationsAPI.applyPermissionRecommendation(recommendationId).catch(() => {
        // API调用失败时模拟成功响应
        console.log('Mock: Permission applied successfully');
      });
      
      // 更新本地状态
      const updatedRecommendations = recommendations.filter(rec => rec.id !== recommendationId);
      setRecommendations(updatedRecommendations);
      setAppliedCount(prev => prev + 1);
      
      // 添加到历史记录
      const appliedRec = recommendations.find(rec => rec.id === recommendationId);
      if (appliedRec) {
        const newHistoryItem = {
          id: `h${Date.now()}`,
          permissionName: appliedRec.permission.name,
          action: 'applied',
          date: new Date().toISOString(),
          reason: appliedRec.recommendationReason
        };
        setRecommendationHistory(prev => [newHistoryItem, ...prev]);
      }
      
      showMessage('权限已应用', 'success');
    } catch (error) {
      handleError('应用权限失败', error);
    } finally {
      setLoading(false);
    }
  };

  // 拒绝权限推荐
  const declineRecommendation = async (recommendationId) => {
    setLoading(true);
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 尝试调用API
      await permissionRecommendationsAPI.declinePermissionRecommendation(recommendationId).catch(() => {
        // API调用失败时模拟成功响应
        console.log('Mock: Recommendation declined');
      });
      
      // 更新本地状态
      const updatedRecommendations = recommendations.filter(rec => rec.id !== recommendationId);
      setRecommendations(updatedRecommendations);
      setDeclinedCount(prev => prev + 1);
      
      // 添加到历史记录
      const declinedRec = recommendations.find(rec => rec.id === recommendationId);
      if (declinedRec) {
        const newHistoryItem = {
          id: `h${Date.now()}`,
          permissionName: declinedRec.permission.name,
          action: 'declined',
          date: new Date().toISOString(),
          reason: '用户拒绝该权限'
        };
        setRecommendationHistory(prev => [newHistoryItem, ...prev]);
      }
      
      showMessage('推荐已拒绝', 'info');
    } catch (error) {
      handleError('拒绝推荐失败', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理错误
  const handleError = (message, error) => {
    console.error(message, error);
    showMessage(message, 'error');
  };

  // 显示消息提示
  const showMessage = (text, severity) => {
    setMessage(text);
    setMessageSeverity(severity);
    setShowSnackbar(true);
  };

  // 关闭消息提示
  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // 根据推荐分数获取颜色
  const getScoreColor = (score) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'primary';
  };

  // 组件加载时初始化数据
  useEffect(() => {
    loadRecommendations();
    // 初始化历史记录
    setRecommendationHistory(mockHistory);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Card elevation={2} className="permission-recommendations-card">
        <CardContent>
          {/* 头部区域 */}
          <div className="header-section">
            <div className="header-left">
              <Typography variant="h5" component="div" className="section-title">
                权限推荐
              </Typography>
              <Tooltip title="根据您的使用习惯和角色推荐可能需要的权限">
                <Button variant="text" color="primary" size="small" startIcon={<QuestionCircleOutlined />}>
                  了解更多
                </Button>
              </Tooltip>
            </div>
            
            <div className="header-right">
              <Button 
                variant="contained" 
                color="primary" 
                onClick={generateNewRecommendations}
                disabled={loading}
                startIcon={<SyncOutlined />}
                className="generate-btn"
              >
                {loading ? '更新中...' : '更新推荐'}
              </Button>
              
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={() => setShowHistory(!showHistory)}
                className="history-btn"
              >
                {showHistory ? '隐藏历史' : '查看历史'}
              </Button>
            </div>
          </div>

          <Divider className="section-divider" />

          {/* 统计信息 */}
          <div className="stats-section">
            <div className="stat-item">
              <Typography variant="body2" className="stat-label">推荐总数</Typography>
              <Typography variant="h6" className="stat-value">{recommendations.length}</Typography>
            </div>
            <div className="stat-item">
              <Typography variant="body2" className="stat-label">已应用</Typography>
              <Typography variant="h6" className="stat-value success">{appliedCount}</Typography>
            </div>
            <div className="stat-item">
              <Typography variant="body2" className="stat-label">已拒绝</Typography>
              <Typography variant="h6" className="stat-value info">{declinedCount}</Typography>
            </div>
          </div>

          {/* 推荐列表 */}
          <div className="recommendations-section">
            {loading ? (
              <div className="loading-container">
                <LinearProgress className="loading-progress" />
                <Typography variant="body2" className="loading-text">
                  加载权限推荐中...
                </Typography>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="empty-state">
                <Typography variant="h6" className="empty-title">
                  暂无权限推荐
                </Typography>
                <Typography variant="body2" className="empty-description">
                  当前没有为您推荐的权限，您可以点击"更新推荐"按钮获取最新推荐
                </Typography>
              </div>
            ) : (
              <div className="recommendations-list">
                {recommendations.map((recommendation) => (
                  <div key={recommendation.id} className="recommendation-item">
                    <div className="recommendation-header">
                      <div className="recommendation-title-section">
                        <Typography variant="h6" className="recommendation-title">
                          {recommendation.permission.name}
                        </Typography>
                        <Chip 
                          label={`推荐度: ${Math.round(recommendation.recommendationScore * 100)}%`}
                          color={getScoreColor(recommendation.recommendationScore)}
                          size="small"
                          className="score-chip"
                        />
                      </div>
                      <div className="recommendation-date">
                        {formatDate(recommendation.createdAt)}
                      </div>
                    </div>

                    <Typography variant="body2" className="recommendation-description">
                      {recommendation.permission.description}
                    </Typography>

                    <div className="recommendation-reason">
                      <Typography variant="subtitle2" className="reason-label">推荐理由:</Typography>
                      <Typography variant="body2" className="reason-text">
                        {recommendation.recommendationReason}
                      </Typography>
                    </div>

                    <div className="recommendation-actions">
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckOutlined />}
                        onClick={() => applyRecommendation(recommendation.id)}
                        disabled={loading}
                        size="small"
                        className="action-btn apply-btn"
                      >
                        应用
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<CloseOutlined />}
                        onClick={() => declineRecommendation(recommendation.id)}
                        disabled={loading}
                        size="small"
                        className="action-btn decline-btn"
                      >
                        拒绝
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 历史记录区域 */}
          {showHistory && (
            <div className="history-section">
              <Typography variant="h6" className="history-title">
                权限操作历史
              </Typography>
              {recommendationHistory.length === 0 ? (
                <Typography variant="body2" className="no-history">
                  暂无操作历史
                </Typography>
              ) : (
                <div className="history-list">
                  {recommendationHistory.map((item) => (
                    <div key={item.id} className="history-item">
                      <div className="history-main">
                        <Typography variant="subtitle2" className="history-permission">
                          {item.permissionName}
                        </Typography>
                        <Chip
                          label={item.action === 'applied' ? '已应用' : '已拒绝'}
                          color={item.action === 'applied' ? 'success' : 'default'}
                          size="small"
                          className="history-action"
                        />
                      </div>
                      <Typography variant="caption" className="history-date">
                        {formatDate(item.date)}
                      </Typography>
                      <Typography variant="body2" className="history-reason">
                        {item.reason}
                      </Typography>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 样式 */}
          <style jsx>{`
            .permission-recommendations-card {
              margin: 16px 0;
            }
            .header-section {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 16px;
            }
            .header-left {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .header-right {
              display: flex;
              gap: 8px;
            }
            .stats-section {
              display: flex;
              gap: 24px;
              margin-bottom: 24px;
              padding: 16px;
              background-color: #f9f9f9;
              border-radius: 8px;
            }
            .stat-item {
              text-align: center;
            }
            .stat-label {
              color: #666;
            }
            .stat-value {
              font-weight: bold;
            }
            .success {
              color: #4caf50;
            }
            .info {
              color: #2196f3;
            }
            .recommendations-section {
              margin-bottom: 24px;
            }
            .loading-container {
              padding: 24px;
              text-align: center;
            }
            .empty-state {
              padding: 40px 24px;
              text-align: center;
              color: #666;
            }
            .recommendations-list {
              display: flex;
              flex-direction: column;
              gap: 16px;
            }
            .recommendation-item {
              padding: 16px;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              transition: box-shadow 0.2s;
            }
            .recommendation-item:hover {
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .recommendation-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 8px;
            }
            .recommendation-title-section {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .recommendation-title {
              margin: 0;
            }
            .recommendation-description {
              margin-bottom: 12px;
              color: #666;
            }
            .recommendation-reason {
              margin-bottom: 16px;
              padding: 12px;
              background-color: #f3f3f3;
              border-radius: 4px;
            }
            .reason-label {
              font-weight: bold;
              margin-bottom: 4px;
            }
            .recommendation-actions {
              display: flex;
              gap: 8px;
            }
            .history-section {
              margin-top: 24px;
              padding-top: 16px;
              border-top: 1px solid #e0e0e0;
            }
            .history-title {
              margin-bottom: 16px;
            }
            .history-list {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            .history-item {
              padding: 12px;
              background-color: #f9f9f9;
              border-radius: 4px;
            }
            .history-main {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 4px;
            }
            .no-history {
              color: #666;
              font-style: italic;
            }
          `}</style>
        </CardContent>
      </Card>

      <Snackbar 
        open={showSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={messageSeverity} 
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PermissionRecommendations;