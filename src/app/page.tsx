'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  const [userType, setUserType] = useState<'user' | 'driver' | null>(null)

  if (userType === 'user') {
    return <UserApp />
  }

  if (userType === 'driver') {
    return <DriverApp />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            🏍️ Moto Taxi
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transporte rápido, seguro y confiable. Conectamos conductores de moto con pasajeros para viajes urbanos eficientes.
          </p>
        </header>

        {/* User Type Selection */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-8">¿Cómo quieres usar Moto Taxi?</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* User Card */}
            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 cursor-pointer transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="text-6xl mb-4">👤</div>
                <CardTitle className="text-2xl text-white">Soy Pasajero</CardTitle>
                <CardDescription className="text-gray-300">
                  Solicita viajes rápidos y seguros
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-gray-300 space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Solicitud de viajes en tiempo real
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Estimación de tarifas
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Seguimiento en vivo
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Múltiples métodos de pago
                  </li>
                </ul>
                <Button 
                  onClick={() => setUserType('user')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Continuar como Pasajero
                </Button>
              </CardContent>
            </Card>

            {/* Driver Card */}
            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 cursor-pointer transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="text-6xl mb-4">🏍️</div>
                <CardTitle className="text-2xl text-white">Soy Conductor</CardTitle>
                <CardDescription className="text-gray-300">
                  Genera ingresos conduciendo tu moto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-gray-300 space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Recibe solicitudes de viaje
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Navegación GPS integrada
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Dashboard de ganancias
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Sistema de calificaciones
                  </li>
                </ul>
                <Button 
                  onClick={() => setUserType('driver')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Continuar como Conductor
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-6xl mx-auto">
          <h3 className="text-3xl font-semibold text-center mb-12">¿Por qué elegir Moto Taxi?</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="text-xl font-semibold mb-2">Rápido</h4>
              <p className="text-gray-300">Evita el tráfico y llega a tu destino en tiempo récord</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h4 className="text-xl font-semibold mb-2">Seguro</h4>
              <p className="text-gray-300">Conductores verificados y sistema de calificaciones</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h4 className="text-xl font-semibold mb-2">Económico</h4>
              <p className="text-gray-300">Tarifas justas y transparentes para todos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// User App Component
function UserApp() {
  const [currentView, setCurrentView] = useState<'auth' | 'dashboard'>('auth')
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  if (currentView === 'dashboard') {
    return <UserDashboard />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => window.location.reload()}
              className="text-white hover:text-gray-300 mb-4"
            >
              ← Volver
            </Button>
            <h1 className="text-3xl font-bold mb-2">👤 Área de Pasajeros</h1>
            <p className="text-gray-300">Accede a tu cuenta para solicitar viajes</p>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex space-x-1 mb-4">
                <Button
                  variant={authMode === 'login' ? 'default' : 'ghost'}
                  onClick={() => setAuthMode('login')}
                  className="flex-1"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  variant={authMode === 'register' ? 'default' : 'ghost'}
                  onClick={() => setAuthMode('register')}
                  className="flex-1"
                >
                  Registrarse
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="tu@email.com"
                />
              </div>
              
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre Completo</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Teléfono</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      placeholder="123-456-7890"
                    />
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">Contraseña</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="••••••••"
                />
              </div>
              
              <Button 
                onClick={() => setCurrentView('dashboard')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Driver App Component
function DriverApp() {
  const [currentView, setCurrentView] = useState<'auth' | 'dashboard'>('auth')
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  if (currentView === 'dashboard') {
    return <DriverDashboard />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => window.location.reload()}
              className="text-white hover:text-gray-300 mb-4"
            >
              ← Volver
            </Button>
            <h1 className="text-3xl font-bold mb-2">🏍️ Área de Conductores</h1>
            <p className="text-gray-300">Accede a tu cuenta para recibir viajes</p>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex space-x-1 mb-4">
                <Button
                  variant={authMode === 'login' ? 'default' : 'ghost'}
                  onClick={() => setAuthMode('login')}
                  className="flex-1"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  variant={authMode === 'register' ? 'default' : 'ghost'}
                  onClick={() => setAuthMode('register')}
                  className="flex-1"
                >
                  Registrarse
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="tu@email.com"
                />
              </div>
              
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre Completo</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Teléfono</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      placeholder="123-456-7890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Modelo de Moto</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      placeholder="Honda CB 150"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Placa</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      placeholder="ABC-123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Número de Licencia</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      placeholder="DL123456789"
                    />
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">Contraseña</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="••••••••"
                />
              </div>
              
              <Button 
                onClick={() => setCurrentView('dashboard')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// User Dashboard Component
function UserDashboard() {
  const [rideStatus, setRideStatus] = useState<'idle' | 'requesting' | 'matched' | 'in-progress'>('idle')
  const [estimatedFare, setEstimatedFare] = useState<number>(0)

  const requestRide = () => {
    setRideStatus('requesting')
    // Simulate fare calculation
    const distance = Math.random() * 10 + 1 // 1-11 km
    const fare = Math.max(3.0, 2.0 + (distance * 0.5))
    setEstimatedFare(Math.round(fare * 100) / 100)
    
    // Simulate finding driver
    setTimeout(() => {
      setRideStatus('matched')
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">👤 Mi Dashboard</h1>
            <Button 
              variant="ghost" 
              onClick={() => window.location.reload()}
              className="text-white hover:text-gray-300"
            >
              Cerrar Sesión
            </Button>
          </div>

          {rideStatus === 'idle' && (
            <Card className="bg-gray-800 border-gray-700 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Solicitar Viaje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Origen</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    placeholder="Tu ubicación actual"
                    defaultValue="Mi ubicación actual"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Destino</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    placeholder="¿A dónde vas?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Método de Pago</label>
                  <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white">
                    <option>Efectivo</option>
                    <option>Tarjeta</option>
                    <option>Pago Digital</option>
                  </select>
                </div>
                <Button onClick={requestRide} className="w-full bg-blue-600 hover:bg-blue-700">
                  Solicitar Viaje
                </Button>
              </CardContent>
            </Card>
          )}

          {rideStatus === 'requesting' && (
            <Card className="bg-gray-800 border-gray-700 mb-6">
              <CardContent className="text-center py-8">
                <div className="animate-spin text-4xl mb-4">🔄</div>
                <h3 className="text-xl font-semibold mb-2">Buscando conductor...</h3>
                <p className="text-gray-300">Tarifa estimada: ${estimatedFare}</p>
              </CardContent>
            </Card>
          )}

          {rideStatus === 'matched' && (
            <Card className="bg-gray-800 border-gray-700 mb-6">
              <CardHeader>
                <CardTitle className="text-white">¡Conductor Encontrado!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-2xl">
                    👤
                  </div>
                  <div>
                    <h4 className="font-semibold">Carlos Rodríguez</h4>
                    <p className="text-gray-300">⭐ 4.8 • Honda CB 150</p>
                    <p className="text-gray-300">Placa: ABC-123</p>
                  </div>
                </div>
                <div className="bg-gray-700 p-4 rounded-md">
                  <p className="text-sm text-gray-300">Tiempo estimado de llegada</p>
                  <p className="text-2xl font-bold">3 minutos</p>
                </div>
                <div className="flex space-x-2">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    📞 Llamar
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setRideStatus('idle')}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ride History */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Historial de Viajes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <div>
                    <p className="font-medium">Centro → Universidad</p>
                    <p className="text-sm text-gray-300">Hace 2 días</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$4.50</p>
                    <p className="text-sm text-gray-300">⭐ 5.0</p>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <div>
                    <p className="font-medium">Casa → Trabajo</p>
                    <p className="text-sm text-gray-300">Hace 1 semana</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$3.25</p>
                    <p className="text-sm text-gray-300">⭐ 4.8</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Driver Dashboard Component
function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false)
  const [rideRequests, setRideRequests] = useState([
    {
      id: 1,
      passenger: 'María González',
      pickup: 'Centro Comercial',
      destination: 'Universidad Nacional',
      distance: '3.2 km',
      fare: '$4.50',
      rating: 4.9
    },
    {
      id: 2,
      passenger: 'Juan Pérez',
      pickup: 'Estación de Bus',
      destination: 'Hospital Central',
      distance: '5.1 km',
      fare: '$6.25',
      rating: 5.0
    }
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">🏍️ Dashboard del Conductor</h1>
            <Button 
              variant="ghost" 
              onClick={() => window.location.reload()}
              className="text-white hover:text-gray-300"
            >
              Cerrar Sesión
            </Button>
          </div>

          {/* Status Toggle */}
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardContent className="flex items-center justify-between py-6">
              <div>
                <h3 className="text-xl font-semibold mb-1">Estado</h3>
                <p className="text-gray-300">
                  {isOnline ? 'En línea - Recibiendo solicitudes' : 'Fuera de línea'}
                </p>
              </div>
              <Button
                onClick={() => setIsOnline(!isOnline)}
                className={`px-8 py-3 ${
                  isOnline 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isOnline ? 'Desconectar' : 'Conectar'}
              </Button>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Earnings */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Ganancias de Hoy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400 mb-2">$45.75</div>
                <p className="text-gray-300">12 viajes completados</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ganancias brutas:</span>
                    <span>$52.50</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Comisión plataforma:</span>
                    <span>-$6.75</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total neto:</span>
                    <span className="text-green-400">$45.75</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Calificación:</span>
                    <span className="font-semibold">⭐ 4.8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Viajes totales:</span>
                    <span className="font-semibold">247</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tasa de aceptación:</span>
                    <span className="font-semibold">94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tiempo en línea:</span>
                    <span className="font-semibold">6h 23m</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ride Requests */}
          {isOnline && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Solicitudes de Viaje</CardTitle>
              </CardHeader>
              <CardContent>
                {rideRequests.length === 0 ? (
                  <div className="text-center py-8 text-gray-300">
                    <div className="text-4xl mb-4">🔍</div>
                    <p>No hay solicitudes disponibles</p>
                    <p className="text-sm">Mantente conectado para recibir viajes</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rideRequests.map((request) => (
                      <div key={request.id} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{request.passenger}</h4>
                            <p className="text-sm text-gray-300">⭐ {request.rating}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-400">{request.fare}</p>
                            <p className="text-sm text-gray-300">{request.distance}</p>
                          </div>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm text-gray-300">Origen:</p>
                          <p className="font-medium">{request.pickup}</p>
                          <p className="text-sm text-gray-300 mt-1">Destino:</p>
                          <p className="font-medium">{request.destination}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => setRideRequests(prev => prev.filter(r => r.id !== request.id))}
                          >
                            Aceptar
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setRideRequests(prev => prev.filter(r => r.id !== request.id))}
                          >
                            Rechazar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
