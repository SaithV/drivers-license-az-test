import { Outlet } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col mx-auto w-full max-w-screen-md px-3 pb-6">
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <footer className="pt-8 text-center text-xs text-gray-500">
        <p>Arizona Driver Practice • Built with React</p>
      </footer>
    </div>
  )
}
