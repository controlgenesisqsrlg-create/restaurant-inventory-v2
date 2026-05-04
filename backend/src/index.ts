import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import roleRoutes from './routes/role.routes'
import moduleRoutes from './routes/module.routes'
import permissionRoutes from './routes/permission.routes'
import outletRoutes from './routes/outlet.routes'
import regionRoutes from './routes/region.routes'
import inventoryRoutes from './routes/inventory.routes'
import { errorMiddleware } from './middleware/error.middleware'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/roles', roleRoutes)
app.use('/api/modules', moduleRoutes)
app.use('/api/permissions', permissionRoutes)
app.use('/api/outlets', outletRoutes)
app.use('/api/regions', regionRoutes)
app.use('/api/inventory', inventoryRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
})
