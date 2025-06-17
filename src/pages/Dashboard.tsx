
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Package, 
  TrendingUp, 
  Bell, 
  Settings, 
  UserPlus,
  FileText,
  BarChart3,
  Shield,
  Clock,
  CheckCircle
} from 'lucide-react';
import PWAFeatures from '@/components/PWAFeatures';
import { useAuth } from '@/hooks/useAuth';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const rolePermissions = {
    'master-admin': {
      title: 'Master Administrator',
      color: 'bg-red-100 text-red-800',
      permissions: [
        'Kelola semua pengguna',
        'Approval sistem',
        'Analytics global',
        'Manage admin & PIC',
        'Full system access'
      ]
    },
    'admin': {
      title: 'Administrator',
      color: 'bg-blue-100 text-blue-800',
      permissions: [
        'Kelola PIC & Kurir',
        'Monitor performa',
        'Generate reports',
        'Approval requests'
      ]
    },
    'pic': {
      title: 'Person In Charge',
      color: 'bg-green-100 text-green-800',
      permissions: [
        'Kelola kurir',
        'Track delivery',
        'Daily reports',
        'Koordinasi tim'
      ]
    }
  };

  const currentRole = rolePermissions[profile.role as keyof typeof rolePermissions];

  const quickActions = [
    { 
      title: 'Kelola Kurir', 
      description: 'Tambah, edit, atau hapus data kurir',
      icon: Users, 
      path: '/manage-kurir',
      roles: ['master-admin', 'admin', 'pic']
    },
    { 
      title: 'Kelola PIC', 
      description: 'Manajemen Person In Charge',
      icon: UserPlus, 
      path: '/manage-pic',
      roles: ['master-admin', 'admin']
    },
    { 
      title: 'Kelola Admin', 
      description: 'Manajemen administrator sistem',
      icon: Shield, 
      path: '/manage-admin',
      roles: ['master-admin']
    },
    { 
      title: 'Laporan', 
      description: 'Lihat laporan performa dan analytics',
      icon: FileText, 
      path: '/reports',
      roles: ['master-admin', 'admin', 'pic']
    },
    { 
      title: 'Approval', 
      description: 'Review dan approve permintaan',
      icon: CheckCircle, 
      path: '/approval',
      roles: ['master-admin', 'admin']
    },
    { 
      title: 'Notifications', 
      description: 'Kirim notifikasi ke kurir',
      icon: Bell, 
      path: '/notifications',
      roles: ['master-admin', 'admin', 'pic']
    }
  ];

  const filteredActions = quickActions.filter(action => 
    action.roles.includes(profile.role)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard INSAN MOBILE</h1>
              <p className="text-sm text-gray-600">Sistem Manajemen Kurir Professional</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={currentRole?.color}>
                {currentRole?.title}
              </Badge>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Selamat Datang, {profile.name}
            </CardTitle>
            <CardDescription>
              Role: {currentRole?.title} | ID: {profile.employee_id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Hak Akses Anda:</h4>
                <ul className="space-y-2">
                  {currentRole?.permissions.map((permission, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {permission}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Status Sistem</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Database:</span>
                    <Badge variant="default">Aktif</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Supabase:</span>
                    <Badge variant="default">Terhubung</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>PWA:</span>
                    <Badge variant="default">Ready</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Aksi cepat berdasarkan role Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 text-left justify-start"
                  onClick={() => navigate(action.path)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <action.icon className="h-5 w-5 mt-1 text-blue-600" />
                    <div>
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {action.description}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Kurir</p>
                  <p className="text-2xl font-bold">25</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Paket Hari Ini</p>
                  <p className="text-2xl font-bold">1,234</p>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold">95.2%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Delivery</p>
                  <p className="text-2xl font-bold">4.2h</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PWA Features */}
        <PWAFeatures />
      </div>
    </div>
  );
};

export default Dashboard;
