
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Truck, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signInWithEmployeeId } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signInWithEmployeeId(id, password);
      
      if (error) {
        toast({
          title: "Login Gagal",
          description: "ID atau password salah!",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Login Berhasil",
          description: `Selamat datang!`,
        });
        
        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      toast({
        title: "Login Gagal",
        description: "Terjadi kesalahan saat login!",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Beranda
        </Button>
        
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
              <Truck className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-indigo-700">INSAN MOBILE</CardTitle>
            <CardDescription>Dashboard Admin - Login dengan ID</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id">ID Mitra</Label>
                <Input
                  id="id"
                  type="text"
                  placeholder="Contoh: MASTERADMIN2025"
                  value={id}
                  onChange={(e) => setId(e.target.value.toUpperCase())}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : 'Login Dashboard'}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">🔑 Akun Demo Dashboard:</p>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Master Admin:</strong> MASTERADMIN2025 / 123456</p>
                <p><strong>Admin:</strong> ADMIN2025 / 123456</p>
                <p><strong>PIC:</strong> PIC2025 / 123456</p>
              </div>
              <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
                <strong>📱 Untuk Kurir Mobile:</strong> Gunakan halaman <code>/auth</code> atau install PWA
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
