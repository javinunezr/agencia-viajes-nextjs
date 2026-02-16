import './globals.css'

export const metadata = {
  title: 'Agencia de Viajes Oeste',
  description: 'Portal de gestión de reservas de vuelos',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
