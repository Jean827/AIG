import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import PermissionRecommendations from '../components/PermissionRecommendations';
import useAuth from '../hooks/useAuth';

const PermissionRecommendationsPage = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Paper elevation={0} style={{ padding: '2rem', borderRadius: '0.5rem' }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          AI-Powered Permission Recommendations
        </Typography>
        
        <Typography variant="body1" paragraph align="center" color="textSecondary">
          Based on your role, activity patterns, and system context, we've identified permissions that might enhance your workflow.
        </Typography>
        
        {user && user.roles && user.roles.some(role => role.name === 'ROLE_ADMIN' || role.name === 'ROLE_TENANT_ADMIN') && (
          <div style={{ marginTop: '2rem' }}>
            <PermissionRecommendations />
          </div>
        )}
        
        {(!user || !user.roles || !user.roles.some(role => role.name === 'ROLE_ADMIN' || role.name === 'ROLE_TENANT_ADMIN')) && (
          <div style={{ textAlign: 'center', marginTop: '4rem', padding: '2rem', backgroundColor: '#f5f5f5', borderRadius: '0.5rem' }}>
            <Typography variant="h6" gutterBottom>
              Permission Recommendations Not Available
            </Typography>
            <Typography variant="body1" color="textSecondary">
              This feature is currently only available for administrators and tenant administrators.
            </Typography>
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default PermissionRecommendationsPage;