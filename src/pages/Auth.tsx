
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Truck, AlertTriangle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

const Auth = () => {
  const { signIn, signInWithEmployeeId, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [area, setArea] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [useIdLogin, setUseIdLogin] = useState(true);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate('/kurir-mobile');
    }
  }, [user, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let result;
      if (useIdLogin) {
        result = await signInWithEmployeeId(email, password);
      } else {
        result = await signIn({ email, password });
      }
      
      if (result.error) {
        if (result.error.message.includes('Invalid login credentials') || result.error.message.includes('Invalid credentials')) {
          setError(useIdLogin ? 'ID atau password salah' : 'Email atau password salah');
        } else if (result.error.message.includes('Email not confirmed')) {
          setError('Silakan verifikasi email Anda terlebih dahulu');
        } else {
          setError(result.error.message);
        }
      } else {
        toast({
          title: "Login Berhasil",
          description: "Selamat datang di INSAN MOBILE!",
        });
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak sama');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp({
        email,
        password,
        name,
        employee_id: employeeId,
        area,
        role: 'kurir' as const
      });
      
      if (error) {
        if (error.message.includes('User already registered')) {
          setError('Email sudah terdaftar');
        } else {
          setError(error.message);
        }
      } else {
        setError('');
        toast({
          title: "Pendaftaran Berhasil!",
          description: "Silakan cek email untuk verifikasi akun.",
        });
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mendaftar');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Memuat aplikasi...</p>
        </div>
      </div>
    );
  }

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

        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">INSAN MOBILE</h1>
          <p className="text-gray-600">Aplikasi Kurir Professional</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Masuk</TabsTrigger>
            <TabsTrigger value="signup">Daftar Baru</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Masuk ke Akun</CardTitle>
                <CardDescription>
                  Login sebagai kurir untuk menggunakan aplikasi mobile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant={useIdLogin ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUseIdLogin(true)}
                    >
                      Login dengan ID
                    </Button>
                    <Button
                      type="button"
                      variant={!useIdLogin ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUseIdLogin(false)}
                    >
                      Login dengan Email
                    </Button>
                  </div>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">
                      {useIdLogin ? 'ID Kurir' : 'Email'}
                    </Label>
                    <Input
                      id="signin-email"
                      type={useIdLogin ? "text" : "email"}
                      value={email}
                      onChange={(e) => setEmail(useIdLogin ? e.target.value.toUpperCase() : e.target.value)}
                      placeholder={useIdLogin ? "Contoh: PISTEST2025" : "nama@perusahaan.com"}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan password"
                        required
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Memproses...' : 'Masuk'}
                  </Button>
                </form>

                {useIdLogin && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-1">🔑 Akun Demo Kurir:</p>
                    <p className="text-xs text-blue-700"><strong>ID:</strong> PISTEST2025</p>
                    <p className="text-xs text-blue-700"><strong>Password:</strong> 123456</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Akun Kurir</CardTitle>
                <CardDescription>
                  Buat akun baru untuk kurir
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">Nama Lengkap</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama lengkap"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-employee-id">ID Karyawan</Label>
                    <Input
                      id="signup-employee-id"
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      placeholder="ID Karyawan"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-area">Area Kerja</Label>
                    <Input
                      id="signup-area"
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="Jakarta Pusat Hub"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@perusahaan.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-confirm-password">Konfirmasi Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password"
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Memproses...' : 'Daftar'}
                  </Button>
                </form>

                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ <strong>Catatan:</strong> Akun baru perlu disetujui oleh Admin/PIC sebelum dapat digunakan.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Developed with ❤️ for Courier Teams</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
